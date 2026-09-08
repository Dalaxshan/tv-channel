import { getDb, COLLECTIONS, ensureIndexes } from "@/lib/db/mongodb";
import { generateSchedule } from "@/lib/generate-schedule";
import { toProgramResponse } from "@/lib/program-serializer";
import { apiSuccess, apiError } from "@/lib/api-response";
import type { ProgramDocument } from "@/types/admin";
import type { ObjectId } from "mongodb";

/**
 * Read-only endpoint. There is no POST/PUT/DELETE here — schedules are never
 * created or edited directly, only derived from Program Management data.
 * Intentionally public (outside /api/admin) since the generated schedule
 * isn't sensitive and both the site and the admin's view-only Schedule
 * Management page need the exact same data.
 */
export async function GET() {
  try {
    await ensureIndexes();
    const db = await getDb();
    const programs = await db.collection<ProgramDocument>(COLLECTIONS.programs).find({}).toArray();

    const programResponses = programs.map((p) =>
      toProgramResponse(p as ProgramDocument & { _id: ObjectId })
    );

    const schedule = generateSchedule(programResponses);

    return apiSuccess(schedule);
  } catch (error) {
    console.error("Generated schedule fetch error:", error);
    return apiError("Failed to load schedule", 500);
  }
}
