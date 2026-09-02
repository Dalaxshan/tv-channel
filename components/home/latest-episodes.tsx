"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ProgramResponse } from "@/types/admin";
import { useEffect, useRef, useState } from "react";
import { ProgramCard2 } from "./program-card2";

export function LatestEpisodes() {
  const [teledramas, setTeledramas] = useState<ProgramResponse[]>([]);

  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  useEffect(() => {
    fetch("/api/programs?category=Teledrama")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setTeledramas(json.data);
      });
  }, []);

  return (
    <section className="container-page py-6 lg:py-4">
      <SectionHeading
        eyebrow="Fresh Off Air"
        title="TV TeleDrama"
        description="Catch up on everything that aired this week, on demand."
        // action={{ label: "All TeleDramas", href: "/videos" }}
      />
      <div className="relative">
        <div
          ref={scroller}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {" "}
          {teledramas.length === 0 && (
            <p className="col-span-full text-sm text-text-muted">
              No teledramas available.
            </p>
          )}
          {teledramas.map((ep) => (
            <div key={ep.slug} className="w-65 shrink-0 sm:w-75">
              <ProgramCard2 key={ep.slug} program={ep} />
            </div>
          ))}
        </div>

        {/* scrollable controls */}
        <div className="mt-6 mb-6 hidden justify-end gap-2 container-page sm:flex">
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
            className="flex h-10 w-10 items-center justify-center rounded-full glass hover:text-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll right"
            className="flex h-10 w-10 items-center justify-center rounded-full glass hover:text-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
