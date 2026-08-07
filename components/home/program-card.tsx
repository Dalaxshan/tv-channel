"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";
import type { Show } from "@/types";
import { Badge } from "@/components/ui/badge";

export function ProgramCard({ show }: { show: Show }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Link
        href={`/programs/${show.slug}`}
        className="group block overflow-hidden rounded-2xl bg-surface"
      >
        <div className="relative aspect-16/10 overflow-hidden">
          <Image
            src={show.image}
            alt={show.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 80vw, 320px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute left-3 top-3 flex gap-1.5">
            {show.isNewEpisode && <Badge variant="new">New</Badge>}
            {show.trending && <Badge variant="trending">Trending</Badge>}
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <Play className="h-4 w-4 translate-x-0.5" fill="white" />
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-light">
            {show.category}
          </p>
          <h3 className="mt-1 font-display text-base font-semibold leading-snug">
            {show.title}
          </h3>
          <div className="mt-2 flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {show.duration}
            </span>
            <span>{show.rating}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
