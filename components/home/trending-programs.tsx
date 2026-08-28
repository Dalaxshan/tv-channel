"use client";

import { useState } from "react";
import { shows } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProgramCard } from "@/components/home/program-card";
import { cn } from "@/lib/utils";

const genres = ["All", "Reality", "Music", "Drama", "News", "Sports", "Lifestyle", "Kids", "Religious", "Entertainment"] as const;

export function TrendingPrograms() {
  const [genre, setGenre] = useState<(typeof genres)[number]>("All");

  const filtered = shows.filter((s) => genre === "All" || s.category === genre);

  return (
    <section className="container-page py-6 lg:py-4">
      <SectionHeading
        eyebrow="What's Hot"
        title="Trending Programs"
        description="The shows the whole country is watching right now."
      />
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((show) => (
          <ProgramCard key={show.slug} show={show} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-text-muted">No trending shows in this genre right now.</p>
        )}
      </div>
    </section>
  );
}
