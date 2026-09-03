import { NextRequest } from "next/server";
import { getDb, COLLECTIONS, ensureIndexes } from "@/lib/db/mongodb";
import { toProgramResponse } from "@/lib/program-serializer";
import { apiSuccess, apiError } from "@/lib/api-response";
import type { ProgramDocument } from "@/types/admin";
import type { ObjectId } from "mongodb";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  try {
    await ensureIndexes();
    const db = await getDb();
    const program = await db
      .collection<ProgramDocument>(COLLECTIONS.programs)
      .findOne({ slug: decoded });

    if (!program) return apiError("Program not found", 404);

    return apiSuccess(toProgramResponse(program as ProgramDocument & { _id: ObjectId }));
  } catch (error) {
    console.error("Public program fetch error:", error);
    return apiError("Failed to load program", 500);
  }
}
