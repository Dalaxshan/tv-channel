"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import type { NewsArticle } from "@/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories: NewsArticle["category"][] = ["Politics", "Business", "Sports", "Technology", "International", "Entertainment"];

export function NewsBrowser({ articles }: { articles: NewsArticle[] }) {
  const params = useSearchParams();
  const initial = (params.get("category") as NewsArticle["category"]) || "All";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<NewsArticle["category"] | "All">(initial);

  const filtered = useMemo(
    () =>
      articles
        .filter((a) => category === "All" || a.category === category)
        .filter((a) => a.title.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [articles, category, query]
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>
      <div className="mb-8 flex flex-wrap gap-2">
        <button onClick={() => setCategory("All")} className={cn("rounded-full px-4 py-1.5 text-xs font-medium", category === "All" ? "bg-accent text-secondary" : "bg-white/5 text-text-muted hover:bg-white/10")}>
          All
        </button>
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={cn("rounded-full px-4 py-1.5 text-xs font-medium", category === c ? "bg-accent text-secondary" : "bg-white/5 text-text-muted hover:bg-white/10")}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => (
          <Link key={a.slug} href={`/news/${a.slug}`} className="group overflow-hidden rounded-2xl bg-surface">
            <div className="relative aspect-16/10 overflow-hidden">
              <Image src={a.image} alt={a.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 90vw, 380px" />
              {a.breaking && <div className="absolute left-3 top-3"><Badge variant="live">Breaking</Badge></div>}
            </div>
            <div className="p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-light">{a.category}</p>
              <h3 className="mt-1 font-display text-base font-semibold leading-snug line-clamp-2">{a.title}</h3>
              <p className="mt-2 text-xs text-text-muted">{a.author} · {formatDate(a.date)} · {a.readingTime}</p>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <p className="col-span-full py-12 text-center text-sm text-text-muted">No articles match your search.</p>}
      </div>
    </div>
  );
}
