import type { Metadata } from "next";
import { Suspense } from "react";
import { shows } from "@/lib/data";
import { ProgramsBrowser } from "@/components/programs/programs-browser";

export const metadata: Metadata = {
  title: "Programs",
  description: "Browse every TV Channel original show by genre - drama, news, music, sport, lifestyle, kids and more.",
  alternates: { canonical: "/programs" },
};

export default function ProgramsPage() {
  return (
    <div className="container-page pb-24 pt-22 lg:pt-30">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Catalogue</span>
        <h1 className="mt-2 font-display text-4xl font-bold">Programs</h1>
        <p className="mt-3 text-text-muted">
          {shows.length} original shows across every genre - search, filter and find your next watch.
        </p>
      </div>
      <Suspense fallback={null}>
        <ProgramsBrowser shows={shows} />
      </Suspense>
    </div>
  );
}
