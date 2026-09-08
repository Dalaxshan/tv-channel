import { NextRequest } from "next/server";
import { getDb, COLLECTIONS, ensureIndexes } from "@/lib/db/mongodb";
import { getServerSession } from "@/lib/auth/session";
import { programSchema, flattenZodError } from "@/lib/validation/admin";
import { generateUniqueSlug } from "@/lib/slug";
import { apiSuccess, apiError } from "@/lib/api-response";
import { toProgramResponse } from "@/lib/program-serializer";
import type { ProgramDocument } from "@/types/admin";
import type { ObjectId } from "mongodb";

export async function GET() {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  try {
    await ensureIndexes();
    const db = await getDb();
    const programs = await db
      .collection<ProgramDocument>(COLLECTIONS.programs)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return apiSuccess(programs.map((p) => toProgramResponse(p as ProgramDocument & { _id: ObjectId })));
  } catch (error) {
    console.error("List programs error:", error);
    return apiError("Failed to load programs", 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiError("Invalid request body", 400);

    const parsed = programSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Please fix the errors below", 422, flattenZodError(parsed.error));
    }

    const { thumbnailKey, thumbnailUrl } = body as { thumbnailKey?: string; thumbnailUrl?: string };
    if (!thumbnailKey || !thumbnailUrl) {
      return apiError("A thumbnail image is required", 422, { image: "Please upload a thumbnail" });
    }

    await ensureIndexes();
    const db = await getDb();

    // The backend independently derives and validates the slug — the
    // frontend's live preview is convenience only, never trusted as-is.
    const slug = await generateUniqueSlug(db, parsed.data.title);

    const now = new Date();
    const doc: ProgramDocument = {
      title: parsed.data.title,
      slug,
      thumbnailKey,
      thumbnailUrl,
      category: parsed.data.category as ProgramDocument["category"],
      schedule: parsed.data.schedule as ProgramDocument["schedule"],
      effectiveFrom: new Date(parsed.data.effectiveFrom),
      effectiveEnd: new Date(parsed.data.effectiveEnd),
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection<ProgramDocument>(COLLECTIONS.programs).insertOne(doc);

    return apiSuccess(toProgramResponse({ ...doc, _id: result.insertedId }), 201);
  } catch (error) {
    console.error("Create program error:", error);
    return apiError("Failed to create program", 500);
  }
}
