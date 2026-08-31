'use client'

import Image from "next/image";
import Link from "next/link";
import { Play, Clock } from "lucide-react";
import { episodes } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { TeledramaResponse } from "@/types/admin";
import { useEffect, useState } from "react";

export function LatestEpisodes() {
  const [teledramas, setTeledramas] = useState<TeledramaResponse[] | null>(null);
  const [loadError, setLoadError] = useState("");

  //get all teledramas
  async function loadTeledramas() {
    try {
      const res = await fetch("/api/admin/teledramas");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to load teledramas");
      setTeledramas(json.data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load teledramas");
    }
  }

  useEffect(() => {
    loadTeledramas();
  }, []);

  return (
    <section className="container-page py-6 lg:py-4">
      <SectionHeading
        eyebrow="Fresh Off Air"
        title="TV TeleDrama"
        description="Catch up on everything that aired this week, on demand."
        action={{ label: "All TeleDramas", href: "/videos" }}
      />
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {teledramas?.map((ep) => (
          <Link
            key={ep.slug}
            href={`/videos/${ep.slug}`}
            className="group overflow-hidden rounded-xl bg-surface"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={ep.thumbnailUrl}
                alt={ep.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width:768px) 45vw, 260px"
              />
              {/* <span className="absolute left-2 top-2 rounded-md bg-black/60 text-white/90 px-1.5 py-0.5 text-[10px] font-semibold">
                EP {ep.episodeNumber}
              </span> */}
              {/* <span className="absolute bottom-2 right-2 flex items-center gap-1 text-white/90 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px]">
                <Clock className="h-2.5 w-2.5" /> 30mins / per episode
              </span> */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-8 w-8" fill="white" />
              </div>
            </div>
            <div className="p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-light">
                {ep.title}
              </p>
              {/* <h3 className="mt-0.5 truncate text-sm font-medium">{ep.title}</h3> */}
              <p className="mt-1 text-[12px] text-text-muted">{ep.startingAt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
