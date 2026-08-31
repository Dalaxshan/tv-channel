import { z } from "zod";
import { isValidTime, SCHEDULE_DAYS } from "../schedule-block";


export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const heroSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150, "Title is too long"),
  subtitle: z.string().trim().min(1, "Subtitle is required").max(300, "Subtitle is too long"),
  badge: z.string().trim().min(1, "Badge is required").max(40, "Badge is too long"),
  ctaButtonText: z.string().trim().min(1, "Button text is required").max(40, "Button text is too long"),
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

export const teledramaSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(150, "Title is too long"),
});
export type TeledramaInput = z.infer<typeof teledramaSchema>;

export const scheduleSchema = z.object({
  day: z.enum(SCHEDULE_DAYS as [string, ...string[]], {
    message: "Select a valid day",
  }),
  time: z
    .string()
    .trim()
    .refine(isValidTime, "Enter a valid 24-hour time (HH:MM)"),
  title: z.string().trim().min(1, "Title is required").max(150, "Title is too long"),
  category: z.string().trim().min(1, "Category is required").max(40, "Category is too long"),
});
export type ScheduleInput = z.infer<typeof scheduleSchema>;

/** Flattens a ZodError into a simple field -> message map for API responses. */
export function flattenZodError(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}
