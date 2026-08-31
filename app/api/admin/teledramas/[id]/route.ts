import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/db/mongodb";
import { getServerSession } from "@/lib/auth/session";
import { teledramaSchema, flattenZodError } from "@/lib/validation/admin";
import { generateUniqueSlug } from "@/lib/slug";
import { apiSuccess, apiError } from "@/lib/api-response";
import { deleteImageFromR2 } from "@/lib/r2/client";
import type { TeledramaDocument, TeledramaResponse } from "@/types/admin";

function toTeledramaResponse(doc: TeledramaDocument & { _id: ObjectId }): TeledramaResponse {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    startingAt: doc.startingAt,
    duration:doc.duration,
    thumbnailKey: doc.thumbnailKey,
    thumbnailUrl: doc.thumbnailUrl,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  const { id } = await params;
  if (!ObjectId.isValid(id)) return apiError("Invalid teledrama id", 400);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiError("Invalid request body", 400);

    const parsed = teledramaSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Please fix the errors below", 422, flattenZodError(parsed.error));
    }

    const db = await getDb();
    const collection = db.collection<TeledramaDocument>(COLLECTIONS.teledramas);
    const existing = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing) return apiError("Teledrama not found", 404);

    // Only regenerate the slug if the title actually changed, so editing
    // other fields doesn't silently change a teledrama's URL.
    const slug =
      existing.title === parsed.data.title
        ? existing.slug
        : await generateUniqueSlug(db, parsed.data.title, id);

    const { thumbnailKey, thumbnailUrl } = body as {
      thumbnailKey?: string;
      thumbnailUrl?: string;
    };
    const nextThumbnailKey = thumbnailKey || existing.thumbnailKey;
    const nextThumbnailUrl = thumbnailUrl || existing.thumbnailUrl;
    const replacingImage = Boolean(thumbnailKey && thumbnailKey !== existing.thumbnailKey);

    const update: Partial<TeledramaDocument> = {
      title: parsed.data.title,
      startingAt: parsed.data.startingAt,
      duration:parsed.data.duration,
      slug,
      thumbnailKey: nextThumbnailKey,
      thumbnailUrl: nextThumbnailUrl,
      updatedAt: new Date(),
    };

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (replacingImage) {
      await deleteImageFromR2(existing.thumbnailKey);
    }

    const updated = await collection.findOne({ _id: new ObjectId(id) });
    return apiSuccess(toTeledramaResponse(updated as TeledramaDocument & { _id: ObjectId }));
  } catch (error) {
    console.error("Update teledrama error:", error);
    return apiError("Failed to update teledrama", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  const { id } = await params;
  if (!ObjectId.isValid(id)) return apiError("Invalid teledrama id", 400);

  try {
    const db = await getDb();
    const collection = db.collection<TeledramaDocument>(COLLECTIONS.teledramas);
    const existing = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing) return apiError("Teledrama not found", 404);

    await collection.deleteOne({ _id: new ObjectId(id) });
    await deleteImageFromR2(existing.thumbnailKey);

    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("Delete teledrama error:", error);
    return apiError("Failed to delete teledrama", 500);
  }
}
