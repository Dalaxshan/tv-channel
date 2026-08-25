import type { Metadata } from "next";
import { ScheduleTimeline } from "@/components/home/schedule-timeline";

export const metadata: Metadata = {
  title: "TV Schedule",
  description:
    "The full daily and weekly TV Channel schedule - morning, afternoon, evening and night programming blocks.",
  alternates: { canonical: "/schedule" },
};

export default function SchedulePage() {
  return <ScheduleTimeline />;
}
