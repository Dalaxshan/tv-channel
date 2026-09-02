import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/db/mongodb";
import { getServerSession } from "@/lib/auth/session";
import { programSchema, flattenZodError } from "@/lib/validation/admin";
import { generateUniqueSlug } from "@/lib/slug";
import { apiSuccess, apiError } from "@/lib/api-response";
import { deleteImageFromR2 } from "@/lib/r2/client";
import { toProgramResponse } from "@/lib/program-serializer";
import type { ProgramDocument } from "@/types/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  const { id } = await params;
  if (!ObjectId.isValid(id)) return apiError("Invalid program id", 400);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiError("Invalid request body", 400);

    const parsed = programSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Please fix the errors below", 422, flattenZodError(parsed.error));
    }

    const db = await getDb();
    const collection = db.collection<ProgramDocument>(COLLECTIONS.programs);
    const existing = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing) return apiError("Program not found", 404);

    // Only regenerate the slug if the title actually changed, so editing
    // other fields doesn't silently change a program's URL.
    const slug =
      existing.title === parsed.data.title
        ? existing.slug
        : await generateUniqueSlug(db, parsed.data.title, id);

    const { thumbnailKey, thumbnailUrl } = body as { thumbnailKey?: string; thumbnailUrl?: string };
    const nextThumbnailKey = thumbnailKey || existing.thumbnailKey;
    const nextThumbnailUrl = thumbnailUrl || existing.thumbnailUrl;
    const replacingImage = Boolean(thumbnailKey && thumbnailKey !== existing.thumbnailKey);

    const update: Partial<ProgramDocument> = {
      title: parsed.data.title,
      slug,
      thumbnailKey: nextThumbnailKey,
      thumbnailUrl: nextThumbnailUrl,
      category: parsed.data.category as ProgramDocument["category"],
      schedule: parsed.data.schedule as ProgramDocument["schedule"],
      effectiveFrom: new Date(parsed.data.effectiveFrom),
      effectiveEnd: new Date(parsed.data.effectiveEnd),
      updatedAt: new Date(),
    };

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: update });

    if (replacingImage) {
      await deleteImageFromR2(existing.thumbnailKey);
    }

    const updated = await collection.findOne({ _id: new ObjectId(id) });
    return apiSuccess(toProgramResponse(updated as ProgramDocument & { _id: ObjectId }));
  } catch (error) {
    console.error("Update program error:", error);
    return apiError("Failed to update program", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  const { id } = await params;
  if (!ObjectId.isValid(id)) return apiError("Invalid program id", 400);

  try {
    const db = await getDb();
    const collection = db.collection<ProgramDocument>(COLLECTIONS.programs);
    const existing = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing) return apiError("Program not found", 404);

    await collection.deleteOne({ _id: new ObjectId(id) });
    await deleteImageFromR2(existing.thumbnailKey);

    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("Delete program error:", error);
    return apiError("Failed to delete program", 500);
  }
}
