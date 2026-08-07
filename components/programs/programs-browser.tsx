"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { Show, Category } from "@/types";
import { ProgramCard } from "@/components/home/program-card";
import { cn } from "@/lib/utils";

const categories: Category[] = ["Reality", "Music", "Drama", "News", "Sports", "Lifestyle", "Kids", "Religious", "Entertainment"];

export function ProgramsBrowser({ shows }: { shows: Show[] }) {
  const params = useSearchParams();
  const initialCategory = (params.get("category") as Category) || "All";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">(initialCategory);
  const [sort, setSort] = useState<"title" | "duration">("title");

  const filtered = useMemo(() => {
    return shows
      .filter((s) => category === "All" || s.category === category)
      .filter((s) => s.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (sort === "title" ? a.title.localeCompare(b.title) : a.duration.localeCompare(b.duration)));
  }, [shows, category, query, sort]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search programs..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "title" | "duration")}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none"
        >
          <option value="title">Sort: A–Z</option>
          <option value="duration">Sort: Duration</option>
        </select>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("All")}
          className={cn("rounded-full px-4 py-1.5 text-xs font-medium", category === "All" ? "bg-accent text-secondary" : "bg-white/5 text-text-muted hover:bg-white/10")}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn("rounded-full px-4 py-1.5 text-xs font-medium", category === c ? "bg-accent text-secondary" : "bg-white/5 text-text-muted hover:bg-white/10")}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((show) => (
          <ProgramCard key={show.slug} show={show} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-text-muted">
            No programs match your search.
          </p>
        )}
      </div>
    </div>
  );
}
