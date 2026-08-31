import { NextRequest } from "next/server";
import { getDb, COLLECTIONS, ensureIndexes } from "@/lib/db/mongodb";
import { getServerSession } from "@/lib/auth/session";
import { teledramaSchema, flattenZodError } from "@/lib/validation/admin";
import { generateUniqueSlug } from "@/lib/slug";
import { apiSuccess, apiError } from "@/lib/api-response";
import type { TeledramaDocument, TeledramaResponse } from "@/types/admin";
import type { ObjectId } from "mongodb";

function toTeledramaResponse(doc: TeledramaDocument & { _id: ObjectId }): TeledramaResponse {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    duration: doc.duration,
    startingAt:doc.startingAt,
    thumbnailKey: doc.thumbnailKey,
    thumbnailUrl: doc.thumbnailUrl,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function GET() {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  try {
    await ensureIndexes();
    const db = await getDb();
    const teledramas = await db
      .collection<TeledramaDocument>(COLLECTIONS.teledramas)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return apiSuccess(
      teledramas.map((t) => toTeledramaResponse(t as TeledramaDocument & { _id: ObjectId }))
    );
  } catch (error) {
    console.error("List teledramas error:", error);
    return apiError("Failed to load teledramas", 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiError("Invalid request body", 400);

    const parsed = teledramaSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Please fix the errors below", 422, flattenZodError(parsed.error));
    }

    const { thumbnailKey, thumbnailUrl } = body as {
      thumbnailKey?: string;
      thumbnailUrl?: string;
    };
    if (!thumbnailKey || !thumbnailUrl) {
      return apiError("A thumbnail image is required", 422, {
        image: "Please upload a thumbnail",
      });
    }

    await ensureIndexes();
    const db = await getDb();

    // The backend independently derives and validates the slug - the
    // frontend's live preview is convenience only, never trusted as-is.
    const slug = await generateUniqueSlug(db, parsed.data.title);

    const now = new Date();
    const doc: TeledramaDocument = {
      title: parsed.data.title,
      slug,
      startingAt:parsed.data.startingAt,
      duration:parsed.data.duration,
      thumbnailKey,
      thumbnailUrl,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db
      .collection<TeledramaDocument>(COLLECTIONS.teledramas)
      .insertOne(doc);

    return apiSuccess(toTeledramaResponse({ ...doc, _id: result.insertedId }), 201);
  } catch (error) {
    console.error("Create teledrama error:", error);
    return apiError("Failed to create teledrama", 500);
  }
}
