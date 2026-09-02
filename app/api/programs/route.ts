import { NextRequest } from "next/server";
import { getDb, COLLECTIONS, ensureIndexes } from "@/lib/db/mongodb";
import { toProgramResponse } from "@/lib/program-serializer";
import { apiSuccess, apiError } from "@/lib/api-response";
import type { ProgramDocument } from "@/types/admin";
import type { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    await ensureIndexes();
    const db = await getDb();
    const category = req.nextUrl.searchParams.get("category");

    const filter = category ? { category } : {};
    const programs = await db
      .collection<ProgramDocument>(COLLECTIONS.programs)
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return apiSuccess(programs.map((p) => toProgramResponse(p as ProgramDocument & { _id: ObjectId })));
  } catch (error) {
    console.error("Public programs fetch error:", error);
    return apiError("Failed to load programs", 500);
  }
}
