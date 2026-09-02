"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { SCHEDULE_DAYS, SCHEDULE_DAY_SHORT } from "@/lib/schedule-block";
import type { GeneratedScheduleItem } from "@/types/admin";

const blocks: { name: "Morning" | "Afternoon" | "Evening" | "Night"; time: string }[] = [
   { name: "Morning", time: "4AM – 12PM" },
  { name: "Afternoon", time: "12PM – 4PM" },
  { name: "Evening", time: "4PM – 6PM" },
  { name: "Night", time: "6PM – 12AM" },
];

export function ScheduleTimeline() {
  const [schedule, setSchedule] = useState<GeneratedScheduleItem[]>([]);
  const [activeDay, setActiveDay] = useState(SCHEDULE_DAYS[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((json) => { if (json.success) setSchedule(json.data); })
      .finally(() => setLoading(false));
  }, []);

  const dayItems = schedule.filter((item) => item.day === activeDay);

  return (
    <section className="container-page py-16 lg:py-24">
      <SectionHeading
        eyebrow="Programming"
        title="TV Schedule"
        description="Plan your viewing across the day, beautifully laid out block by block."
        action={{ label: "Full schedule", href: "/schedule" }}
      />

      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Day selector">
        {SCHEDULE_DAYS.map((d) => (
          <button
            key={d}
            role="tab"
            aria-selected={activeDay === d}
            onClick={() => setActiveDay(d)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeDay === d ? "bg-primary text-white" : "bg-accent/5 text-text-muted hover:bg-accent/10"
            )}
          >
            {SCHEDULE_DAY_SHORT[d]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-text-muted">Loading schedule…</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-4">
          {blocks.map((block) => {
            const items = dayItems.filter((item) => item.block === block.name);
            return (
              <div key={block.name} className="rounded-2xl glass p-5">
                <div className="mb-4 flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold">{block.name}</h3>
                  <span className="text-xs text-text-muted">{block.time}</span>
                </div>
                <ol className="space-y-4">
                  {items.length === 0 ? (
                    <p className="text-sm text-text-muted">No listings.</p>
                  ) : (
                    items.map((item) => (
                      <li key={item.id} className="relative border-l border-white/10 pl-4">
                        <span className="absolute -left-1.25 top-1.5 h-2.5 w-2.5 rounded-full bg-primary-light" />
                        <span className="font-mono text-xs text-accent">
                          {item.startingTime} – {item.endTime}
                        </span>
                        <p className="mt-1 text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-text-muted">{item.category}</p>
                      </li>
                    ))
                  )}
                </ol>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
