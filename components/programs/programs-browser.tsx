"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PROGRAM_CATEGORIES, type ProgramResponse } from "@/types/admin";
import { cn } from "@/lib/utils";

export function ProgramsBrowser({ programs }: { programs: ProgramResponse[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category") || "All";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"title" | "newest">("newest");

  function setCategory(cat: string) {
    const url =
      cat === "All"
        ? "/programs"
        : `/programs?category=${encodeURIComponent(cat)}`;
    router.push(url, { scroll: false });
  }

  const categories = useMemo(
    () => Array.from(new Set(programs.map((p) => p.category))).sort(),
    [programs],
  );

  const filtered = useMemo(() => {
    return programs
      .filter((p) => category === "All" || p.category === category)
      .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        if (sort === "title") return a.title.localeCompare(b.title);
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [programs, category, query, sort]);

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
        <div className="relative w-full sm:w-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "title" | "newest")}
            className="w-full appearance-none rounded-full border border-white/10 bg-white/5 py-2.5 pl-4 pr-10 text-sm outline-none focus:border-accent sm:w-auto"
          >
            <option value="newest" className="text-black">
              Sort: Newest
            </option>
            <option value="title" className="text-black">
              Sort: A–Z
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("All")}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium",
            category === "All"
              ? "bg-accent text-secondary"
              : "bg-white/5 text-text-muted hover:bg-white/10",
          )}
        >
          All
        </button>
        {PROGRAM_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium",
              category === c
                ? "bg-accent text-secondary"
                : "bg-accent/5 text-text-muted hover:bg-accent/10",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((program) => (
          <Link
            key={program.slug}
            href={`/programs/${program.slug}`}
            className="group block overflow-hidden rounded-2xl bg-surface"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={program.thumbnailUrl}
                alt={program.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 80vw, 320px"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-light">
                {program.category}
              </p>
              <h3 className="mt-1 font-display text-base font-semibold leading-snug">
                {program.title}
              </h3>
            </div>
          </Link>
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
