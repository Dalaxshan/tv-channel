"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Episode } from "@/types";

export default function ProgramGrid({ episodes }: { episodes: Episode[] }) {
  const [selectedVideo, setSelectedVideo] = useState<Episode | null>(null);

  if (episodes.length === 0) {
    return (
      <p className="mt-6 text-sm text-text-muted">No episodes available yet.</p>
    );
  }

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {episodes.map((ep) => (
          <button
            key={ep.slug}
            onClick={() => setSelectedVideo(ep)}
            className="group overflow-hidden rounded-xl bg-surface text-left"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={ep.image}
                alt={ep.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="260px"
              />
            </div>
            <div className="p-3">
              <h3 className="truncate text-sm font-medium">{ep.title}</h3>
              <p className="mt-1 text-[11px] text-text-glass" >
                {formatDate(ep.publishDate)}
                {ep.duration ? ` · ${ep.duration}` : ""}
              </p>
            </div>
          </button>
        ))}
      </div>

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
                {"showTitle" in selectedVideo && selectedVideo.showTitle && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-light">
                    {selectedVideo.showTitle}
                  </p>
                )}
                <h2 className="mt-2 font-display text-2xl font-bold">
                  {selectedVideo.title}
                </h2>
                <div className="mt-3 flex items-center gap-4 text-sm text-text-muted">
                  {selectedVideo.duration && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> {selectedVideo.duration}
                    </span>
                  )}
                  <span>{formatDate(selectedVideo.publishDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}