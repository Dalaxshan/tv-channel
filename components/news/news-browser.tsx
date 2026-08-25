"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { Search, Play, Clock, X } from "lucide-react";
import type { Episode, Podcast } from "@/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const tabs = ["Recently Added", "Most Viewed"] as const;

export function NewsBrowser({ episodes, podcasts }: { episodes: Episode[]; podcasts: Podcast[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Recently Added");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedVideo, setSelectedVideo] = useState<Episode | Podcast | null>(null);

  const sorted = useMemo(() => {
    let list = [...episodes];

    if (tab === "Recently Added") {
      list.sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
    } else if (tab === "Most Viewed") {
      list.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
    } else if (tab === "Featured") {
      list = list.filter((e) => e.featured);
    }

    if (query.trim()) {
      list = list.filter((e) => e.title.toLowerCase().includes(query.toLowerCase()));
    }

    return list;
  }, [episodes, tab, query]);

  const displayedVideos = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  // Reset visible count when tab or query changes
  useEffect(() => {
    setVisibleCount(8);
  }, [tab, query]);

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
        {displayedVideos.map((ep) => (
          <div
            key={ep.slug}
            onClick={() => setSelectedVideo(ep)}
            className="group cursor-pointer overflow-hidden rounded-xl bg-surface"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image src={ep.image} alt={ep.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="260px" />
              <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold">NS {ep.episodeNumber}</span>
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
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleShowMore}
            className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Show More
          </button>
        </div>
      )}

      {/* YouTube Video Player Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -right-4 -top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="overflow-hidden rounded-2xl bg-surface">
              {selectedVideo.slug ? (
                <div className="relative aspect-video bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo.slug}`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              ) : (
                <div className="relative aspect-video bg-black">
                  <Image
                    src={selectedVideo.image}
                    alt={selectedVideo.title}
                    fill
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/60">Video not available</p>
                  </div>
                </div>
              )}
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-light">
                  {"showTitle" in selectedVideo ? selectedVideo.showTitle : selectedVideo.guest}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold">{selectedVideo.title}</h2>
                <div className="mt-3 flex items-center gap-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {selectedVideo.duration}
                  </span>
                  <span>
                    {formatDate("publishDate" in selectedVideo ? selectedVideo.publishDate : selectedVideo.date)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="mt-14 font-display text-2xl font-bold">Podcasts &amp; Interviews</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {podcasts.map((p) => (
          <div
            key={p.slug}
            onClick={() => setSelectedVideo(p)}
            className="group cursor-pointer overflow-hidden rounded-2xl bg-surface"
          >
            <div className="relative aspect-video">
              <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="380px" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-12 w-12" fill="white" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-base font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-text-muted">{p.guest}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
