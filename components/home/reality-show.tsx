"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ProgramResponse } from "@/types/admin";
import { groupSchedule } from "@/lib/utils";
import { ProgramCard2 } from "./program-card2";

export function RealityShows() {
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);

  useEffect(() => {
    fetch("/api/programs?category=Reality")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setPrograms(json.data);
      });
  }, []);

  return (
    <section className="bg-surface/40 py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Conversations"
          title="Reality Shows"
          description="Stay informed with the latest local, national, international, business, sports, and breaking news."
          // action={{
          //   label: "All Reality Shows",
          //   href: "/programs?category=Reality",
          // }}
        />
        {programs.length === 0 && (
          <p className="text-sm text-text-muted">No reality shows available.</p>
        )}
        <div className="grid gap-6 sm:grid-cols-4">
          {programs.map((p) => (
          <ProgramCard2 key={p.slug} program={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
