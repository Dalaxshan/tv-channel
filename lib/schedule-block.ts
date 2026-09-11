export type ScheduleDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export type ScheduleBlock = "Morning" | "Afternoon" | "Evening" | "Night";

export const SCHEDULE_DAYS: ScheduleDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** Short labels for compact tab UI; data/comparisons always use full day names. */
export const SCHEDULE_DAY_SHORT: Record<ScheduleDay, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidTime(time: string): boolean {
  return TIME_PATTERN.test(time);
}

/**
 * Derives which programming block a 24-hour "HH:MM" time falls into, purely
 * for grouping display into the four columns rendered by the schedule UI.
 *   Morning:   00:00–11:59
 *   Afternoon: 12:00–16:59
 *   Evening:   17:00–20:59
 *   Night:     21:00–23:59
 */
export function computeBlock(time: string): ScheduleBlock {
  const [hoursStr] = time.split(":");
  const hours = Number(hoursStr);
  if (hours < 12) return "Morning";
  if (hours < 16) return "Afternoon";
  if (hours < 18) return "Evening";
  return "Night";
}

/** Converts "HH:MM" to minutes since midnight, for chronological sorting. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export type SummarizedScheduleGroup = {
  key: string;
  label: string; // e.g. "Mon–Fri" or "Mon, Wed, Fri" or "Mon"
  days: ScheduleDay[];
  startingTime: string;
  endTime: string;
};

function formatDayRangeLabel(days: ScheduleDay[]): string {
  if (days.length === 0) return "";
  if (days.length === 1) return SCHEDULE_DAY_SHORT[days[0]];

  const indices = days.map((d) => SCHEDULE_DAYS.indexOf(d));
  const isContiguousRun = indices.every((idx, i) => i === 0 || idx === indices[i - 1] + 1);

  return isContiguousRun
    ? `${SCHEDULE_DAY_SHORT[days[0]]}–${SCHEDULE_DAY_SHORT[days[days.length - 1]]}`
    : days.map((d) => SCHEDULE_DAY_SHORT[d]).join(", ");
}


export function summarizeScheduleEntries(
  entries: { day: ScheduleDay; startingTime: string; endTime: string }[]
): SummarizedScheduleGroup[] {
  const byTime = new Map<string, ScheduleDay[]>();
  for (const entry of entries) {
    const timeKey = `${entry.startingTime}|${entry.endTime}`;
    const days = byTime.get(timeKey) ?? [];
    if (!days.includes(entry.day)) days.push(entry.day);
    byTime.set(timeKey, days);
  }

  const groups: SummarizedScheduleGroup[] = Array.from(byTime.entries()).map(([timeKey, days]) => {
    const [startingTime, endTime] = timeKey.split("|");
    const orderedDays = SCHEDULE_DAYS.filter((d) => days.includes(d));
    return {
      key: timeKey,
      label: formatDayRangeLabel(orderedDays),
      days: orderedDays,
      startingTime,
      endTime,
    };
  });

  groups.sort((a, b) => {
    const dayDiff = SCHEDULE_DAYS.indexOf(a.days[0]) - SCHEDULE_DAYS.indexOf(b.days[0]);
    if (dayDiff !== 0) return dayDiff;
    return timeToMinutes(a.startingTime) - timeToMinutes(b.startingTime);
  });

  return groups;
}
