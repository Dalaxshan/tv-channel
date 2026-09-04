"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProgramCard } from "@/components/home/program-card";
import { Show } from "@/types";

export function FeaturedShows({ shows }: { shows: Show[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section className="py-16 lg:py-4">
      <div className="container-page">
        <SectionHeading
          eyebrow="Don't Miss"
          title="Featured Shows"
          description="Handpicked programs leading this week's lineup."
          action={{ label: "See all programs", href: "/programs" }}
        />
      </div>
      <div className="relative">
        <div
          ref={scroller}
          className="container-page flex gap-5 overflow-x-auto pb-4 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {shows.map((show) => (
            <div key={show.slug} className="w-65 shrink-0 sm:w-75">
              <ProgramCard show={show} />
            </div>
          ))}
        </div>

        <div className="mt-6 hidden justify-end gap-2 container-page sm:flex">
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
