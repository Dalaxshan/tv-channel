"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { ProgramResponse } from "@/types/admin";
import { ProgramCard2 } from "./program-card2";

export function Entertainments() {
  const [programs, setPrograms] = useState<ProgramResponse[]>([]);

  useEffect(() => {
    fetch("/api/programs?category=Entertainment")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setPrograms(json.data);
      });
  }, []);

  return (
    <section className="container-page py-6 lg:py-4">
      <SectionHeading
        eyebrow="On Demand"
        title="Entertainment"
        description="Catch the latest entertainment news, celebrity stories, movies, music, and trending highlights."
        // action={{ label: "Browse Library", href: "/programs?category=Entertainment" }}
      />
      {programs.length === 0 && (
        <p className="text-sm text-text-muted">
          No entertainment programs available.
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {programs.map((p) => (
       <ProgramCard2 key={p.slug} program={p} />
        ))}
      </div>
    </section>
  );
}
