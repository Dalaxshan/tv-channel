import { NextRequest } from "next/server";
import { getDb, COLLECTIONS, ensureIndexes } from "@/lib/db/mongodb";
import { getServerSession } from "@/lib/auth/session";
import { heroSchema, flattenZodError } from "@/lib/validation/admin";
import { apiSuccess, apiError } from "@/lib/api-response";
import type { HeroDocument, HeroResponse } from "@/types/admin";

function toHeroResponse(doc: HeroDocument & { _id: import("mongodb").ObjectId }): HeroResponse {
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

export async function GET() {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  try {
    await ensureIndexes();
    const db = await getDb();
    const heroes = await db
      .collection<HeroDocument>(COLLECTIONS.heroes)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return apiSuccess(heroes.map((h) => toHeroResponse(h as HeroDocument & { _id: import("mongodb").ObjectId })));
  } catch (error) {
    console.error("List heroes error:", error);
    return apiError("Failed to load heroes", 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiError("Invalid request body", 400);

    const parsed = heroSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Please fix the errors below", 422, flattenZodError(parsed.error));
    }

    const { imageKey, imageUrl } = body as { imageKey?: string; imageUrl?: string };
    if (!imageKey || !imageUrl) {
      return apiError("A hero image is required", 422, { image: "Please upload an image" });
    }

    const now = new Date();
    const doc: HeroDocument = {
      title: parsed.data.title,
      subtitle: parsed.data.subtitle,
      badge: parsed.data.badge,
      cta: {
        buttonText: parsed.data.ctaButtonText,
        buttonUrl: parsed.data.ctaButtonUrl,
      },
      imageKey,
      imageUrl,
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDb();
    const result = await db.collection<HeroDocument>(COLLECTIONS.heroes).insertOne(doc);

    return apiSuccess(toHeroResponse({ ...doc, _id: result.insertedId }), 201);
  } catch (error) {
    console.error("Create hero error:", error);
    return apiError("Failed to create hero", 500);
  }
}
