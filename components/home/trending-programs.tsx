"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { ProgramResponse } from "@/types/admin";
import { ProgramCard2 } from "./program-card2";
import { ChevronLeft, ChevronRight } from "lucide-react";

const genres = ["All", "Reality", "Music", "Teledrama", "News", "Sports", "Lifestyle", "Kids", "Religious", "Entertainment"] as const;

function ProgramListSkeleton() {
  return (
    <div className="flex gap-5 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-56 w-64 shrink-0 animate-pulse rounded-xl bg-white/5 sm:w-72" />
      ))}
    </div>
  );
}

export function TrendingPrograms() {
  const [genre, setGenre] = useState<(typeof genres)[number]>("All");
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  useEffect(() => {
    fetch("/api/programs")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setPrograms(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = programs.filter((s) => genre === "All" || s.category === genre);

  return (
    <section className="container-page py-6 lg:py-14">
      <SectionHeading
        eyebrow="What's Hot"
        title="Trending Programs"
        description="The shows the whole country is watching right now."
      />

        <div className="mb-6 flex justify-between">
      <div className="mb-8 flex flex-wrap gap-2">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
              genre === g ? "bg-accent text-secondary" : "bg-white/5 text-text-muted hover:bg-white/10"
            )}
          >
            {g}
          </button>
        ))}
      </div>
        <div className="mt-4 hidden gap-2 sm:flex fle">
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
      ) : filtered.length === 0 ? (
        <p className="text-sm text-text-muted">No trending shows in this genre right now.</p>
      ) : (
        <div className="relative">
          <div
            ref={scroller}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filtered.map((show) => (
              <div key={show.slug} className="w-64 shrink-0 sm:w-72">
                <ProgramCard2 program={show} />
              </div>
            ))}
          </div>

        
        </div>
      )}
    </section>
  );
}