"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ProgramResponse } from "@/types/admin";
import { useEffect, useRef, useState } from "react";
import { ProgramCard2 } from "./program-card2";
import { ProgramListSkeleton } from "@/components/ui/programlist-skeleton";

export function RealityShows() {
  const [program,setProgram] = useState<ProgramResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  useEffect(() => {
    fetch("/api/programs?category=Reality")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setProgram(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="container-page py-6 lg:py-4">
      <div className="mb-6 flex justify-between">
        <SectionHeading
          eyebrow="Fresh Off Air"
          title="TV Reality Shows"
          description="Catch up on everything that aired this week, on demand."
        />

        <div className="mt-6 mb-6  hidden gap-2 sm:flex">
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

      {loading ? (
        <ProgramListSkeleton />
      ) : (
        <div className="relative">
          <div
            ref={scroller}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {program.length === 0 && (
              <p className="col-span-full text-sm text-text-muted">
                No programs available.
              </p>
            )}
            {program.map((ep) => (
              <div key={ep.slug} className="w-65 shrink-0 sm:w-75">
                <ProgramCard2 key={ep.slug} program={ep} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
