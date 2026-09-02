import { ProgramResponse } from "@/types/admin";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function minutesUntil(targetTime: string) {
  const now = new Date();
  const [h, m] = targetTime.split(":").map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target.getTime() < now.getTime()) target.setDate(target.getDate() + 1);
  return Math.max(0, Math.round((target.getTime() - now.getTime()) / 60000));
}

export const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DAY_ABBR: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

/** "19:30" -> "7:30 PM" */
export function formatTime12(time: string): string {
  const [hStr, mStr] = time.split(":");
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${mStr} ${period}`;
}

/** ["Monday",...,"Friday"] -> "Mon-Fri" · ["Saturday","Sunday"] -> "Sat-Sun" · ["Monday"] -> "Mon" */
export function formatDayRange(days: string[]): string {
  const sorted = [...new Set(days)].sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
  );
  const indices = sorted.map((d) => DAY_ORDER.indexOf(d));

  const ranges: string[] = [];
  let runStart = indices[0];
  let prev = indices[0];

  for (let i = 1; i <= indices.length; i++) {
    const curr = indices[i];
    if (curr === prev + 1) {
      prev = curr;
      continue;
    }
    ranges.push(
      runStart === prev
        ? DAY_ABBR[DAY_ORDER[runStart]]
        : `${DAY_ABBR[DAY_ORDER[runStart]]}-${DAY_ABBR[DAY_ORDER[prev]]}`
    );
    runStart = curr;
    prev = curr;
  }

  return ranges.join(", ");
} 

/** Groups schedule entries that share the same start/end time and collapses their days. */
export function groupSchedule(schedule: ProgramResponse["schedule"]) {
  const map = new Map<string, string[]>();

  schedule.forEach((s) => {
    const key = `${s.startingTime}-${s.endTime}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s.day);
  });

  return Array.from(map.entries()).map(([key, days]) => {
    const [start, end] = key.split("-");
    return {
      dayLabel: formatDayRange(days),
      timeLabel: `${formatTime12(start)} - ${formatTime12(end)}`,
    };
  });
}
