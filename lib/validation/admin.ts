import { z } from "zod";
import { SCHEDULE_DAYS, isValidTime } from "@/lib/schedule-block";
import { PROGRAM_CATEGORIES } from "@/types/admin";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const heroSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title is too long"),
  subtitle: z
    .string()
    .trim()
    .min(1, "Subtitle is required")
    .max(300, "Subtitle is too long"),
  badge: z
    .string()
    .trim()
    .min(1, "Badge is required")
    .max(40, "Badge is too long"),
  ctaButtonText: z
    .string()
    .trim()
    .min(1, "Button text is required")
    .max(40, "Button text is too long"),
  ctaButtonUrl: z
    .string()
    .trim()
    .min(1, "Button URL is required")
    .refine((val) => {
      try {
        // Allow relative paths ("/watch-live") or absolute URLs.
        if (val.startsWith("/")) return true;
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, "Enter a valid URL or relative path (e.g. /watch-live)"),
});
export type HeroInput = z.infer<typeof heroSchema>;

const isValidDateTime = (val: string) => !Number.isNaN(new Date(val).getTime());

const scheduleEntrySchema = z
  .object({
    day: z.enum(SCHEDULE_DAYS as [string, ...string[]], {
      message: "Select a valid day",
    }),
    startingTime: z
      .string()
      .trim()
      .refine(isValidTime, "Enter a valid starting time"),
    endTime: z.string().trim().refine(isValidTime, "Enter a valid end time"),
  })
  .refine((entry) => entry.endTime > entry.startingTime, {
    message: "End time must be later than starting time",
    path: ["endTime"],
  });

export const programSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(150, "Title is too long"),
    category: z.enum([...PROGRAM_CATEGORIES] as [string, ...string[]], {
      message: "Select a valid category",
    }),
    effectiveFrom: z
      .string()
      .trim()
      .min(1, "Effective From is required")
      .refine(isValidDateTime, "Enter a valid date and time"),
    effectiveEnd: z
      .string()
      .trim()
      .min(1, "Effective End is required")
      .refine(isValidDateTime, "Enter a valid date and time"),
    schedule: z
      .array(scheduleEntrySchema)
      .min(1, "Add at least one schedule entry"),
  })
  .refine(
    (data) => new Date(data.effectiveEnd) >= new Date(data.effectiveFrom),
    {
      message: "Effective End must not be earlier than Effective From",
      path: ["effectiveEnd"],
    },
  )
  .refine(
    (data) => {
      const seen = new Set<string>();
      for (const entry of data.schedule) {
        const key = `${entry.day}|${entry.startingTime}|${entry.endTime}`;
        if (seen.has(key)) return false;
        seen.add(key);
      }
      return true;
    },
    {
      message:
        "Remove duplicate schedule entries (same day, starting time, and end time)",
      path: ["schedule"],
    },
  );
export type ProgramInput = z.infer<typeof programSchema>;

/** Flattens a ZodError into a simple field -> message map for API responses. */
export function flattenZodError(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}
