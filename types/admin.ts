import { ObjectId } from "mongodb";
import type { ScheduleDay, ScheduleBlock } from "@/lib/schedule-block";

/** Document stored in the `admins` collection. */
export interface AdminDocument {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Safe admin shape returned to the client (never includes passwordHash). */
export interface AdminSession {
  id: string;
  email: string;
  name: string;
}

export interface HeroCta {
  buttonText: string;
  buttonUrl: string;
}

/** Document stored in the `heroes` collection. */
export interface HeroDocument {
  _id?: ObjectId;
  title: string;
  subtitle: string;
  badge: string;
  cta: HeroCta;
  imageKey: string; // Cloudflare R2 object key
  imageUrl: string; // Public/derived URL for display
  createdAt: Date;
  updatedAt: Date;
}

export interface HeroResponse {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  cta: HeroCta;
  imageKey: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const PROGRAM_CATEGORIES = [
  "Teledrama",
  "News",
  "Lifestyle",
  "Interactive",
  "Kids",
  "Religious",
  "Entertainment",
  "Talk Show",
  "Sports",
  "Gaming",
  "Reality",
  "Arts",
  "Movie",
] as const;
export type ProgramCategory = (typeof PROGRAM_CATEGORIES)[number];

/** A single recurring airing slot for a program, e.g. Monday 19:00–20:00. */
export interface ProgramScheduleEntry {
  day: ScheduleDay;
  startingTime: string; // 24hr "HH:MM"
  endTime: string; // 24hr "HH:MM"
}

export interface ProgramDocument {
  _id?: ObjectId;
  title: string;
  slug: string;
  thumbnailKey: string;
  thumbnailUrl: string;
  category: ProgramCategory;
  schedule: ProgramScheduleEntry[];
  effectiveFrom: Date;
  effectiveEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramResponse {
  id: string;
  title: string;
  slug: string;
  thumbnailKey: string;
  thumbnailUrl: string;
  category: ProgramCategory;
  schedule: ProgramScheduleEntry[];
  effectiveFrom: string; // ISO datetime
  effectiveEnd: string; // ISO datetime
  createdAt: string;
  updatedAt: string;
}

/**
 * A single generated schedule row — produced on the fly from the `schedule`
 * array of every currently-active program. Never persisted separately.
 */
export interface GeneratedScheduleItem {
  id: string; // deterministic: `${programId}:${day}:${startingTime}`
  programId: string;
  title: string;
  category: ProgramCategory;
  day: ScheduleDay;
  startingTime: string;
  endTime: string;
  block: ScheduleBlock;
}

/** Consistent API envelope used by every admin API route. */
export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: string; fieldErrors?: Record<string, string> };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
