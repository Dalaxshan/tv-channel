import { ObjectId } from "mongodb";

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

/** Document stored in the `teledramas` collection. */
export interface TeledramaDocument {
  _id?: ObjectId;
  title: string;
  slug: string;
  duration: string;
  startingAt: string;
  thumbnailKey: string;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeledramaResponse {
  id: string;
  title: string;
  slug: string;
  thumbnailKey: string;
  thumbnailUrl: string;
  startingAt: string;
  duration: string;
  createdAt: string;
  updatedAt: string;
}

/** Consistent API envelope used by every admin API route. */
export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: string; fieldErrors?: Record<string, string> };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
