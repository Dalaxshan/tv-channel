import { SCHEDULE_DAYS, computeBlock, timeToMinutes } from "@/lib/schedule-block";
import type { ProgramResponse, GeneratedScheduleItem } from "@/types/admin";

/** A program is active if `now` falls within [effectiveFrom, effectiveEnd] inclusive (end of day). */
export function isProgramActive(program: ProgramResponse, now: Date): boolean {
  const from = new Date(program.effectiveFrom).getTime();
  const endDate = new Date(program.effectiveEnd);
  endDate.setHours(23, 59, 59, 999);
  const current = now.getTime();
  return current >= from && current <= endDate.getTime();
}

/**
 * Expands every schedule entry of every currently-active program into a
 * flat, chronologically-sorted list — Monday → Sunday, then by starting
 * time ascending (end time as a tie-breaker). This is the one place that
 * defines "the schedule"; nothing else stores or generates it independently,
 * so admin and public views always agree.
 */
export function generateSchedule(
  programs: ProgramResponse[],
  now: Date = new Date()
): GeneratedScheduleItem[] {
  const dayOrder = new Map(SCHEDULE_DAYS.map((d, i) => [d, i]));

  const items: GeneratedScheduleItem[] = programs
    .filter((program) => isProgramActive(program, now))
    .flatMap((program) =>
      program.schedule.map((entry) => ({
        id: `${program.id}:${entry.day}:${entry.startingTime}`,
        programId: program.id,
        title: program.title,
        category: program.category,
        day: entry.day,
        startingTime: entry.startingTime,
        endTime: entry.endTime,
        block: computeBlock(entry.startingTime),
      }))
    );

  items.sort((a, b) => {
    const dayDiff = (dayOrder.get(a.day) ?? 0) - (dayOrder.get(b.day) ?? 0);
    if (dayDiff !== 0) return dayDiff;
    const startDiff = timeToMinutes(a.startingTime) - timeToMinutes(b.startingTime);
    if (startDiff !== 0) return startDiff;
    return timeToMinutes(a.endTime) - timeToMinutes(b.endTime);
  });

  return items;
}
