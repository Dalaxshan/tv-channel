"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ProgramResponse } from "@/types/admin";
import { ProgramCard2 } from "./program-card2";
import { ProgramListSkeleton } from "../ui/programlist-skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Entertainments() {
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  useEffect(() => {
    fetch("/api/programs?category=Entertainment")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setPrograms(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="container-page py-6 lg:py-14">
      <div className="mb-6 flex justify-between">
        <SectionHeading
          eyebrow="On Demand"
          title="Entertainment"
          description="Catch the latest entertainment news, celebrity stories, movies, music, and trending highlights."
          // action={{ label: "Browse Library", href: "/programs?category=Entertainment" }}
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
        <>
          {programs.length === 0 && (
            <p className="text-sm text-text-muted">
              No entertainment programs available.
            </p>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {programs.map((p) => (
              <ProgramCard2 key={p.slug} program={p} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
