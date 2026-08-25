"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Maximize2, Share2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const CURRENT_PROGRAM = {
  title: "Frontline Report",
  host: "Nadia Fernando",
  genre: "News",
  start: "19:00",
  end: "20:00",
};

function useRemainingMinutes(endTime: string) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const [h, m] = endTime.split(":").map(Number);
      const end = new Date(now);
      end.setHours(h, m, 0, 0);
      if (end.getTime() < now.getTime()) end.setDate(end.getDate() + 1);
      setRemaining(
        Math.max(0, Math.round((end.getTime() - now.getTime()) / 60000)),
      );
    };
    calc();
    const t = setInterval(calc, 30000);
    return () => clearInterval(t);
  }, [endTime]);
  return remaining;
}

export function LiveTvSection() {
  const remaining = useRemainingMinutes(CURRENT_PROGRAM.end);
  const [viewers, setViewers] = useState(48213);

  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 40 - 15));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="container-page py-16 lg:py-24" id="watch">
      <SectionHeading
        eyebrow="Live Now"
        title="Live TV"
        description="Stream TV Channel's primary channel live - no sign-up required."
        action={{ label: "Alternative stream", href: "/watch-live" }}
      />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-surface glow-primary">
          <Image
            src="https://picsum.photos/seed/live-player/1200/675"
            alt="Live broadcast preview"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* <button
              aria-label="Play live stream"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/30 transition-transform hover:scale-105"
            >
              <Play className="h-6 w-6 translate-x-0.5" fill="white" />
            </button> */}
          </div>
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <Badge variant="live">Live</Badge>
            <span className="flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs text-text-muted">
              <Users className="h-3 w-3" /> {viewers.toLocaleString()} watching
            </span>
          </div>
          <div className="absolute right-4 top-4 flex gap-2">
            <button
              aria-label="Share stream"
              className="flex h-9 w-9 items-center justify-center rounded-full glass hover:text-accent"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              aria-label="Watch fullscreen"
              className="flex h-9 w-9 items-center justify-center rounded-full glass hover:text-accent"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl glass p-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              On Air Now
            </span>
            <h3 className="mt-2 font-display text-2xl font-bold">
              {CURRENT_PROGRAM.title}
            </h3>
            <dl className="mt-4 space-y-2.5 text-sm">
              <Row label="Host" value={CURRENT_PROGRAM.host} />
              <Row label="Genre" value={CURRENT_PROGRAM.genre} />
              <Row label="Starts" value={CURRENT_PROGRAM.start} />
              <Row label="Ends" value={CURRENT_PROGRAM.end} />
            </dl>
            <p className="mt-4 text-sm text-accent">
              {remaining} min remaining
            </p>
          </div>
          <Button className="mt-6 w-full" variant="outline">
            View full program details
          </Button>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <dt className="text-text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
