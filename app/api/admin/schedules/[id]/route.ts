import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/db/mongodb";
import { getServerSession } from "@/lib/auth/session";
import { scheduleSchema, flattenZodError } from "@/lib/validation/admin";
import { computeBlock } from "@/lib/schedule-block";
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

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  const { id } = await params;
  if (!ObjectId.isValid(id)) return apiError("Invalid schedule id", 400);

  try {
    const body = await req.json().catch(() => null);
    if (!body) return apiError("Invalid request body", 400);

    const parsed = scheduleSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Please fix the errors below", 422, flattenZodError(parsed.error));
    }

    const db = await getDb();
    const collection = db.collection<ScheduleDocument>(COLLECTIONS.schedules);
    const existing = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing) return apiError("Schedule item not found", 404);

    const update: Partial<ScheduleDocument> = {
      day: parsed.data.day as ScheduleDocument["day"],
      time: parsed.data.time,
      block: computeBlock(parsed.data.time),
      title: parsed.data.title,
      category: parsed.data.category,
      updatedAt: new Date(),
    };

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: update });

    const updated = await collection.findOne({ _id: new ObjectId(id) });
    return apiSuccess(toScheduleResponse(updated as ScheduleDocument & { _id: ObjectId }));
  } catch (error) {
    console.error("Update schedule error:", error);
    return apiError("Failed to update schedule item", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession();
  if (!session) return apiError("Not authenticated", 401);

  const { id } = await params;
  if (!ObjectId.isValid(id)) return apiError("Invalid schedule id", 400);

  try {
    const db = await getDb();
    const collection = db.collection<ScheduleDocument>(COLLECTIONS.schedules);
    const existing = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing) return apiError("Schedule item not found", 404);

    await collection.deleteOne({ _id: new ObjectId(id) });

    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("Delete schedule error:", error);
    return apiError("Failed to delete schedule item", 500);
  }
}
