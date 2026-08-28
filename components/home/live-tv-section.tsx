"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";

// Fetch actual Sri Lanka time from World Time API
async function getSriLankaTime(): Promise<Date> {
  try {
    const response = await fetch('https://time.now/developer/api/timezone/Asia/Colombo');
    const data = await response.json();
    return new Date(data.datetime);
  } catch (error) {
    // Fallback: use browser time converted to Sri Lanka timezone
    console.warn('Failed to fetch Sri Lanka time, using fallback', error);
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
  }
}

// Example schedule data
const SCHEDULE_DATA = [
  { id: 1, title: "Paththare Wisthare", category: "Documentary", airTime: "2026-08-25T06:30:00" },
  { id: 2, title: "Hiru News", category: "News", airTime: "2026-08-25T10:55:00" },
  { id: 3, title: "Paata Kurullo", category: "Teledrama", airTime: "2026-08-25T11:21:00" },
  { id: 4, title: "Ron Soya", category: "Teledrama", airTime: "2026-08-25T12:30:00" },
  { id: 5, title: "Nightly News", category: "News", airTime: "2026-08-25T14:00:00" },
  { id: 6, title: "Art News", category: "News", airTime: "2026-08-25T16:00:00" },
  { id: 7, title: "Sudu", category: "Teledrama", airTime: "2026-08-25T20:00:00" },
  { id: 8, title: "Atapattama", category: "Entertainment", airTime: "2026-08-25T22:00:00" },
  { id: 9, title: "Movie", category: "Movie", airTime: "2026-08-25T23:00:00" },
];

type Program = (typeof SCHEDULE_DATA)[number];

function useRemainingMinutes(endTime: string) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const calc = async () => {
      // Get actual current time in Sri Lanka from API
      const now = await getSriLankaTime();
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

function useLiveSchedule(schedule: Program[]) {
  const [displayedPrograms, setDisplayedPrograms] = useState<Program[]>([]);
  const [currentId, setCurrentId] = useState<number | null>(null);

  useEffect(() => {
    const updateSchedule = async () => {
      // Get actual current time in Sri Lanka from API
      const now = await getSriLankaTime();

      // 1. Sort schedule chronologically
      const sorted = [...schedule].sort(
        (a, b) => new Date(a.airTime).getTime() - new Date(b.airTime).getTime(),
      );

      // 2. Find current program index (latest item where airTime <= current time)
      let currentIndex = sorted.findLastIndex(
        (item) => new Date(item.airTime).getTime() <= now.getTime(),
      );
      if (currentIndex === -1) currentIndex = 0;

      setCurrentId(sorted[currentIndex]?.id ?? null);

      // 3. Slice window based on positional rules
      const total = sorted.length;
      let startIdx = 0;

      if (currentIndex === 0) {
        // No previous programs -> Current is 1st, next 3 follow
        startIdx = 0;
      } else if (currentIndex === total - 1) {
        // No next programs -> Current is 4th, previous 3 come before
        startIdx = Math.max(0, total - 4);
      } else {
        // Previous exists -> Previous is 1st, Current is 2nd, next 2 follow
        startIdx = currentIndex - 1;
      }

      setDisplayedPrograms(sorted.slice(startIdx, startIdx + 4));
    };

    updateSchedule();
    const interval = setInterval(updateSchedule, 30000); // Auto-update every 30s

    return () => clearInterval(interval);
  }, [schedule]);

  return { displayedPrograms, currentId };
}

export function LiveTvSection() {
  const [viewers, setViewers] = useState(48213);
  const { displayedPrograms, currentId } = useLiveSchedule(SCHEDULE_DATA);

  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 40 - 15));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="container-page py-6 lg:py-4" id="watch">
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
          <div className="absolute inset-0 flex items-center justify-center" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <Badge variant="live">Live</Badge>
            <span className="flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs text-text-muted">
              <Users className="h-3 w-3" /> {viewers.toLocaleString()} watching
            </span>
          </div>
          {/* <div className="absolute right-4 top-4 flex gap-2">
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
          </div> */}
        </div>

        {/* current program */}
        <div className="bg-hirugray dark:bg-hirugray rounded-xl p-5 border border-zinc-300 dark:border-zinc-800 h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-zinc-300 dark:border-zinc-800 pb-3 mb-4">
              <h3 className="font-bold text-md text-text flex items-center gap-2">
                Today&apos;s Highlights
              </h3>
              <span className="text-xs text-zinc-400 font-semibold">Live Broadcast Schedule</span>
            </div>

            {/* change color */}
            <ul className="space-y-3 text-sm">
              {displayedPrograms.map((program) => {
                const isCurrent = program.id === currentId;

                return (
                  <li
                    key={program.id}
                    className={`flex items-center justify-between p-2 rounded ${isCurrent
                        ? "bg-blue-600 dark:bg-blue-600 border-l-4 border-hirured"
                        : "bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800"
                      }`}
                  >
                    <div>
                      <p
                        className={`text-xs ${isCurrent ? "text-white font-bold" : "text-zinc-600"
                          }`}
                      >
                        {new Date(program.airTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Asia/Colombo",
                        })}
                        {isCurrent && " (NOW)"}
                      </p>
                      <p
                        className={`font-semibold ${isCurrent ? "text-white font-bold" : "text-black"
                          }`}
                      >
                        {program.title}
                      </p>
                    </div>
                    {isCurrent ? (
                      <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-bold">
                        ON AIR
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-600 dark:text-zinc-500">{program.category}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <button className="w-full mt-4 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs py-2.5 rounded font-semibold transition border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white">
            Full TV Schedule &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}