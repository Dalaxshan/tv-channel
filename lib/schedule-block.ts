export type ScheduleDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type ScheduleBlock = "Morning" | "Afternoon" | "Evening" | "Night";

export const SCHEDULE_DAYS: ScheduleDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidTime(time: string): boolean {
  return TIME_PATTERN.test(time);
}

/**
 * Derives which programming block a 24-hour "HH:MM" time falls into, so
 * admins only need to enter a time and the block is computed consistently
 * everywhere (matches the four columns rendered by schedule-timeline.tsx).
 *   Morning:   00:00–11:59
 *   Afternoon: 12:00–16:59
 *   Evening:   17:00–20:59
 *   Night:     21:00–23:59
 */
export function computeBlock(time: string): ScheduleBlock {
  const [hoursStr] = time.split(":");
  const hours = Number(hoursStr);
  if (hours < 12) return "Morning";
  if (hours < 17) return "Afternoon";
  if (hours < 21) return "Evening";
  return "Night";
}

/** Converts "HH:MM" to minutes since midnight, for chronological sorting. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
