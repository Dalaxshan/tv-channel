"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { ProgramResponse } from "@/types/admin";
import { groupSchedule } from "@/lib/utils";

export function ProgramCard2({ program }: { program: ProgramResponse }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Link
        href={`/programs/${program.slug}`}
        className="group block overflow-hidden rounded-2xl bg-surface"
      >
        <div className="relative aspect-16/10 overflow-hidden">
          <Image
            src={program.thumbnailUrl}
            alt={program.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 80vw, 320px"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <Play className="h-4 w-4 translate-x-0.5" fill="white" />
            </span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-light">
            {program.title}
          </p>
          {groupSchedule(program.schedule).map((g, i) => (
            <p key={i} className="mt-1 text-[13px] text-text-muted">
              {g.dayLabel} • {g.timeLabel}
            </p>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
