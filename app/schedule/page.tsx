import type { Metadata } from "next";
import { ScheduleTimeline } from "@/components/home/schedule-timeline";

export const metadata: Metadata = {
  title: "TV Schedule",
  description: "The full daily and weekly TV Channel schedule — morning, afternoon, evening and night programming blocks.",
  alternates: { canonical: "/schedule" },
};

const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SchedulePage() {
  return (
    <div className="pb-24 pt-32 lg:pt-40">
      <div className="container-page mb-6 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Programming</span>
        <h1 className="mt-2 font-display text-4xl font-bold">TV Schedule</h1>
        <p className="mt-3 text-text-muted">
          Plan your week around TV Channel — every show, every time slot, in one place.
        </p>
      </div>
      <div className="container-page mb-4 flex gap-2 overflow-x-auto pb-2">
        {week.map((d, i) => (
          <button
            key={d}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              i === 0 ? "bg-primary text-white" : "bg-white/5 text-text-muted hover:bg-white/10"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
      <ScheduleTimeline />
    </div>
  );
}
