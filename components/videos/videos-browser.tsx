"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Play, Clock } from "lucide-react";
import type { Episode, Podcast } from "@/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const tabs = ["Recently Added", "Most Viewed", "Featured"] as const;

export function VideosBrowser({ episodes, podcasts }: { episodes: Episode[]; podcasts: Podcast[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Recently Added");
  const [query, setQuery] = useState("");

  const sorted = useMemo(() => {
    const list = [...episodes];
    if (tab === "Recently Added") list.sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
    if (tab === "Most Viewed") list.reverse();
    return list.filter((e) => e.title.toLowerCase().includes(query.toLowerCase()));
  }, [episodes, tab, query]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn("rounded-full px-4 py-2 text-sm font-medium", tab === t ? "bg-primary text-white" : "bg-white/5 text-text-muted hover:bg-white/10")}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos..."
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((ep) => (
          <Link key={ep.slug} href={`/videos/${ep.slug}`} className="group overflow-hidden rounded-xl bg-surface">
            <div className="relative aspect-video overflow-hidden">
              <Image src={ep.image} alt={ep.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="260px" />
              <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold">EP {ep.episodeNumber}</span>
              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px]"><Clock className="h-2.5 w-2.5" /> {ep.duration}</span>
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-8 w-8" fill="white" />
              </div>
            </div>
            <div className="p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-light">{ep.showTitle}</p>
              <h3 className="mt-0.5 truncate text-sm font-medium">{ep.title}</h3>
              <p className="mt-1 text-[11px] text-text-muted">{formatDate(ep.publishDate)}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-14 font-display text-2xl font-bold">Podcasts &amp; Interviews</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {podcasts.map((p) => (
          <Link key={p.slug} href={`/videos/${p.slug}`} className="group overflow-hidden rounded-2xl bg-surface">
            <div className="relative aspect-video">
              <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="380px" />
            </div>
            <div className="p-4">
              <h3 className="font-display text-base font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-text-muted">{p.guest}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
