import { getDb, COLLECTIONS, ensureIndexes } from "@/lib/db/mongodb";
import { timeToMinutes, SCHEDULE_DAYS } from "@/lib/schedule-block";
import { apiSuccess, apiError } from "@/lib/api-response";
import type { ScheduleDocument, ScheduleResponse } from "@/types/admin";
import type { ObjectId } from "mongodb";

/**
 * Public, unauthenticated endpoint for the website's schedule timeline.
 * Intentionally outside /api/admin so it isn't gated by the admin session
 * middleware. Read-only — creation/editing/deletion stays under
 * /api/admin/schedules, which requires an authenticated admin.
 */

function toScheduleResponse(doc: ScheduleDocument & { _id: ObjectId }): ScheduleResponse {
  return {
    id: doc._id.toString(),
    day: doc.day,
    time: doc.time,
    block: doc.block,
    title: doc.title,
    category: doc.category,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function GET() {
  try {
    await ensureIndexes();
    const db = await getDb();
    const schedules = await db.collection<ScheduleDocument>(COLLECTIONS.schedules).find({}).toArray();

    const dayIndex = new Map(SCHEDULE_DAYS.map((d, i) => [d, i]));
    schedules.sort((a, b) => {
      const dayDiff = (dayIndex.get(a.day) ?? 0) - (dayIndex.get(b.day) ?? 0);
      if (dayDiff !== 0) return dayDiff;
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });

    return apiSuccess(schedules.map((s) => toScheduleResponse(s as ScheduleDocument & { _id: ObjectId })));
  } catch (error) {
    console.error("Public schedule fetch error:", error);
    return apiError("Failed to load schedule", 500);
  }
}
