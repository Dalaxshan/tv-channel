"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import type { GeneratedScheduleItem } from "@/types/admin";
import Link from "next/link";

function getSriLankaDay(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "Asia/Colombo",
  });
}

function getSriLankaMinutes(): number {
  const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" });
  const d = new Date(now);
  return d.getHours() * 60 + d.getMinutes();
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function LiveTvSection() {
  const [viewers, setViewers] = useState(48213);
  const [schedule, setSchedule] = useState<GeneratedScheduleItem[]>([]);
  const [displayedPrograms, setDisplayedPrograms] = useState<GeneratedScheduleItem[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [thumbnailMap, setThumbnailMap] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/schedule").then((r) => r.json()),
      fetch("/api/programs").then((r) => r.json()),
    ]).then(([scheduleJson, programsJson]) => {
      if (scheduleJson.success) setSchedule(scheduleJson.data);
      if (programsJson.success) {
        const map: Record<string, string> = {};
        for (const p of programsJson.data) map[p.id] = p.thumbnailUrl;
        setThumbnailMap(map);
      }
    });
  }, []);

  useEffect(() => {
    if (!schedule.length) return;

    function update() {
      const today = getSriLankaDay();
      const nowMinutes = getSriLankaMinutes();

      const todayItems = schedule
        .filter((item) => item.day === today)
        .sort(
          (a, b) =>
            timeToMinutes(a.startingTime) - timeToMinutes(b.startingTime),
        );

      let currentIndex = todayItems.findLastIndex(
        (item) => timeToMinutes(item.startingTime) <= nowMinutes,
      );
      if (currentIndex === -1) currentIndex = 0;

      setCurrentId(todayItems[currentIndex]?.id ?? null);

      const total = todayItems.length;
      let startIdx = 0;
      if (currentIndex === 0) startIdx = 0;
      else if (currentIndex === total - 1) startIdx = Math.max(0, total - 4);
      else startIdx = currentIndex - 1;

      setDisplayedPrograms(todayItems.slice(startIdx, startIdx + 4));
    }

    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, [schedule]);

  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 40 - 15));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const currentProgram = displayedPrograms.find((p) => p.id === currentId);
  const currentThumbnail = currentProgram ? thumbnailMap[currentProgram.programId] : null;

  return (
    <section className="container-page py-6 lg:py-4" id="watch">
      <SectionHeading
        eyebrow="Live Now"
        title="Live Program"
        description="Stream TV Channel's primary channel live - no sign-up required."
      />
      {/* right side image */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative aspect-video overflow-hidden rounded-2xl glass-card glow-primary">
          {currentThumbnail && (
            <Image
              src={currentThumbnail}
              alt={currentProgram?.title ?? "Live broadcast preview"}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <Badge variant="live">Live</Badge>
            <span className="flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs text-text-muted">
              <Users className="h-3 w-3" /> {viewers.toLocaleString()} watching
            </span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 h-full flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
              <h3 className="font-bold text-md text-text flex items-center gap-2">
                Today&apos;s Highlights
              </h3>
              <span className="text-xs text-text-muted font-semibold">
                Live Broadcast Schedule
              </span>
            </div>

            <ul className="space-y-3 text-sm">
              {displayedPrograms.map((program) => {
                const isCurrent = program.id === currentId;
                return (
                  <li
                    key={program.id}
                    className={`flex items-center justify-between p-2 rounded ${
                      isCurrent
                        ? "bg-primary/80 border-l-4 border-primary-light"
                        : "glass-soft border border-white/10"
                    }`}
                  >
                    <div>
                      <p className={`text-xs ${isCurrent ? "text-white font-bold" : "text-text-muted"}`}>
                        {program.startingTime}
                        {isCurrent && " (NOW)"}
                      </p>
                      <p className={`font-semibold ${isCurrent ? "text-white font-bold" : "text-text"}`}>
                        {program.title}
                      </p>
                    </div>
                    {isCurrent ? (
                      <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded font-bold">
                        ON AIR
                      </span>
                    ) : (
                      <span className="text-xs text-text-muted">
                        {program.category}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <Link href="/schedule">
            <button className="btn-glass w-full mt-4 text-xs py-2.5">
              Full TV Schedule &rarr;
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
