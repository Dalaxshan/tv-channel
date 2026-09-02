"use client";

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { Spinner } from "@/components/admin/ui/form-controls";
import { EmptyState } from "@/components/admin/ui/empty-state";
import { SCHEDULE_DAYS, SCHEDULE_DAY_SHORT, type ScheduleBlock } from "@/lib/schedule-block";
import type { GeneratedScheduleItem } from "@/types/admin";
import { cn } from "@/lib/utils";

// Mirrors the four columns rendered by components/home/schedule-timeline.tsx
const BLOCKS: { name: ScheduleBlock; time: string }[] = [
  { name: "Morning", time: "4AM – 12PM" },
  { name: "Afternoon", time: "12PM – 4PM" },
  { name: "Evening", time: "4PM – 6PM" },
  { name: "Night", time: "6PM – 12AM" },
];

export default function ScheduleManagementPage() {
  const [schedule, setSchedule] = useState<GeneratedScheduleItem[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [activeDay, setActiveDay] = useState<string>(SCHEDULE_DAYS[0]);

  async function loadSchedule() {
    try {
      const res = await fetch("/api/schedule");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to load schedule");
      setSchedule(json.data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load schedule");
    }
  }

  useEffect(() => {
    loadSchedule();
  }, []);

  const dayItems = schedule?.filter((item) => item.day === activeDay) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">TV Schedule</h1>
        <p className="mt-1 text-sm text-slate-500">
          Automatically generated from active programs in Program Management. To change what airs, edit a
          program&apos;s schedule there — this view updates on its own.
        </p>
      </div>

      {schedule === null && !loadError && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {loadError && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {loadError}
        </div>
      )}

      {schedule && (
        <>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Day selector">
            {SCHEDULE_DAYS.map((d) => (
              <button
                key={d}
                role="tab"
                aria-selected={activeDay === d}
                onClick={() => setActiveDay(d)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  activeDay === d
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                )}
              >
                {SCHEDULE_DAY_SHORT[d]}
              </button>
            ))}
          </div>

          {schedule.length === 0 ? (
            <EmptyState
              icon={<CalendarClock className="h-6 w-6" />}
              title="No active programs scheduled"
              description="Add a program with a schedule and an active Effective From / Effective End period in Program Management, and it will appear here automatically."
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-4">
              {BLOCKS.map((block) => {
                const items = dayItems.filter((item) => item.block === block.name);
                return (
                  <div key={block.name} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                    <div className="mb-4 flex items-baseline justify-between">
                      <h3 className="text-lg font-semibold text-white">{block.name}</h3>
                      <span className="text-xs text-slate-500">{block.time}</span>
                    </div>
                    <ol className="space-y-3">
                      {items.length === 0 ? (
                        <p className="text-sm text-slate-500">No listings.</p>
                      ) : (
                        items.map((item) => (
                          <li key={item.id} className="relative border-l border-slate-700 pl-4">
                            <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500" />
                            <span className="font-mono text-xs text-indigo-400">
                              {item.startingTime} – {item.endTime}
                            </span>
                            <p className="mt-1 truncate text-sm font-medium text-slate-100">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.category}</p>
                          </li>
                        ))
                      )}
                    </ol>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
