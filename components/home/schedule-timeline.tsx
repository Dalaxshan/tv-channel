"use client";

import { useState } from "react";
import { schedule } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const filters = ["Today", "Tomorrow", "This Week"];
const blocks: { name: "Morning" | "Afternoon" | "Evening" | "Night"; time: string }[] = [
  { name: "Morning", time: "6AM – 12PM" },
  { name: "Afternoon", time: "12PM – 5PM" },
  { name: "Evening", time: "5PM – 10PM" },
  { name: "Night", time: "10PM – 6AM" },
];

export function ScheduleTimeline() {
  const [filter, setFilter] = useState("Today");

  return (
    <section className="container-page py-16 lg:py-24">
      <SectionHeading
        eyebrow="Programming"
        title="TV Schedule"
        description="Plan your viewing across the day, beautifully laid out block by block."
        action={{ label: "Full schedule", href: "/schedule" }}
      />

      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Schedule range">
        {filters.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              filter === f ? "bg-primary text-white" : "bg-white/5 text-text-muted hover:bg-white/10"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {blocks.map((block) => (
          <div key={block.name} className="rounded-2xl glass p-5">
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="font-display text-lg font-semibold">{block.name}</h3>
              <span className="text-xs text-text-muted">{block.time}</span>
            </div>
            <ol className="space-y-4">
              {schedule
                .filter((item) => item.block === block.name)
                .map((item) => (
                  <li key={`${item.time}-${item.title}`} className="relative border-l border-white/10 pl-4">
                    <span className="absolute -left-1.25 top-1.5 h-2.5 w-2.5 rounded-full bg-primary-light" />
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-accent">{item.time}</span>
                      {item.live && <Badge variant="live">Live</Badge>}
                    </div>
                    <p className="mt-1 text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-text-muted">
                      {item.category}
                      {item.host ? ` · ${item.host}` : ""}
                    </p>
                  </li>
                ))}
              {schedule.filter((item) => item.block === block.name).length === 0 && (
                <p className="text-sm text-text-muted">No listings yet.</p>
              )}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
