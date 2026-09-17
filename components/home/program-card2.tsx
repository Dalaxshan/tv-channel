"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { ProgramResponse } from "@/types/admin";

export function ProgramCard2({ program }: { program: ProgramResponse }) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Link
        href={`/programs/${program.slug}`}
        className="group block overflow-hidden rounded-2xl bg-surface"
      >
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={program.thumbnailUrl}
            alt={program.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 80vw, 320px"
          />
          {/* Dark gradient on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/1 via-black/2 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <Play className="h-4 w-4 translate-x-0.5" fill="white" />
            </span>
          </div>
          {/* Glass CTA — appears on hover */}
          <div className="absolute inset-x-3 bottom-3 z-20 translate-y-2 rounded-xl border border-white/2 bg-black/10 p-3.5 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-sm font-semibold uppercase tracking-wide text-white">
              {program.title}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
