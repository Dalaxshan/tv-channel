import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS, ensureIndexes } from "@/lib/db/mongodb";
import { getServerSession } from "@/lib/auth/session";
import { scheduleSchema, flattenZodError } from "@/lib/validation/admin";
import { computeBlock, timeToMinutes, SCHEDULE_DAYS } from "@/lib/schedule-block";
import { apiSuccess, apiError } from "@/lib/api-response";
import type { ScheduleDocument, ScheduleResponse } from "@/types/admin";

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
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  try {
    await ensureIndexes();
    const db = await getDb();
    const schedules = await db
      .collection<ScheduleDocument>(COLLECTIONS.schedules)
      .find({})
      .toArray();

    // Order by day-of-week, then chronologically within the day.
    const dayIndex = new Map(SCHEDULE_DAYS.map((d, i) => [d, i]));
    schedules.sort((a, b) => {
      const dayDiff = (dayIndex.get(a.day) ?? 0) - (dayIndex.get(b.day) ?? 0);
      if (dayDiff !== 0) return dayDiff;
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });

    return apiSuccess(schedules.map((s) => toScheduleResponse(s as ScheduleDocument & { _id: ObjectId })));
  } catch (error) {
    console.error("List schedules error:", error);
    return apiError("Failed to load schedule", 500);
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiError("Invalid request body", 400);

    const parsed = scheduleSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Please fix the errors below", 422, flattenZodError(parsed.error));
    }

    const now = new Date();
    const doc: ScheduleDocument = {
      day: parsed.data.day as ScheduleDocument["day"],
      time: parsed.data.time,
      block: computeBlock(parsed.data.time),
      title: parsed.data.title,
      category: parsed.data.category,
      createdAt: now,
      updatedAt: now,
    };

    const db = await getDb();
    const result = await db.collection<ScheduleDocument>(COLLECTIONS.schedules).insertOne(doc);

    return apiSuccess(toScheduleResponse({ ...doc, _id: result.insertedId }), 201);
  } catch (error) {
    console.error("Create schedule error:", error);
    return apiError("Failed to create schedule item", 500);
  }
}
