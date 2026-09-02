import type { ObjectId } from "mongodb";
import type { ProgramDocument, ProgramResponse } from "@/types/admin";

export function toProgramResponse(doc: ProgramDocument & { _id: ObjectId }): ProgramResponse {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    thumbnailKey: doc.thumbnailKey,
    thumbnailUrl: doc.thumbnailUrl,
    category: doc.category,
    schedule: doc.schedule,
    effectiveFrom: doc.effectiveFrom.toISOString(),
    effectiveEnd: doc.effectiveEnd.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
