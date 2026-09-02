import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/db/mongodb";
import { getServerSession } from "@/lib/auth/session";
import { heroSchema, flattenZodError } from "@/lib/validation/admin";
import { apiSuccess, apiError } from "@/lib/api-response";
import { deleteImageFromR2 } from "@/lib/r2/client";
import type { HeroDocument, HeroResponse } from "@/types/admin";

function toHeroResponse(doc: HeroDocument & { _id: ObjectId }): HeroResponse {
  return {
    id: doc._id.toString(),
    title: doc.title,
    subtitle: doc.subtitle,
    badge: doc.badge,
    cta: doc.cta,
    imageKey: doc.imageKey,
    imageUrl: doc.imageUrl,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  const { id } = await params;
  if (!ObjectId.isValid(id)) return apiError("Invalid hero id", 400);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiError("Invalid request body", 400);

    const parsed = heroSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Please fix the errors below", 422, flattenZodError(parsed.error));
    }

    const db = await getDb();
    const collection = db.collection<HeroDocument>(COLLECTIONS.heroes);
    const existing = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing) return apiError("Hero not found", 404);

    const { imageKey, imageUrl } = body as { imageKey?: string; imageUrl?: string };
    // If a new image was uploaded, use it and clean up the old R2 object.
    // Otherwise retain the existing image reference.
    const nextImageKey = imageKey || existing.imageKey;
    const nextImageUrl = imageUrl || existing.imageUrl;
    const replacingImage = Boolean(imageKey && imageKey !== existing.imageKey);

    const update: Partial<HeroDocument> = {
      title: parsed.data.title,
      subtitle: parsed.data.subtitle,
      badge: parsed.data.badge,
      cta: {
        buttonText: parsed.data.ctaButtonText,
        buttonUrl: parsed.data.ctaButtonUrl,
      },
      imageKey: nextImageKey,
      imageUrl: nextImageUrl,
      updatedAt: new Date(),
    };

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (replacingImage) {
      await deleteImageFromR2(existing.imageKey);
    }

    const updated = await collection.findOne({ _id: new ObjectId(id) });
    return apiSuccess(toHeroResponse(updated as HeroDocument & { _id: ObjectId }));
  } catch (error) {
    console.error("Update hero error:", error);
    return apiError("Failed to update hero", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  const { id } = await params;
  if (!ObjectId.isValid(id)) return apiError("Invalid hero id", 400);

  try {
    const db = await getDb();
    const collection = db.collection<HeroDocument>(COLLECTIONS.heroes);
    const existing = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing) return apiError("Hero not found", 404);

    await collection.deleteOne({ _id: new ObjectId(id) });
    await deleteImageFromR2(existing.imageKey);

    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("Delete hero error:", error);
    return apiError("Failed to delete hero", 500);
  }
}
