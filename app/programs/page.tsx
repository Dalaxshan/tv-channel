import type { Metadata } from "next";
import { Suspense } from "react";
import { getDb, COLLECTIONS, ensureIndexes } from "@/lib/db/mongodb";
import { toProgramResponse } from "@/lib/program-serializer";
import { ProgramsBrowser } from "@/components/programs/programs-browser";
import type { ProgramDocument, ProgramResponse } from "@/types/admin";
import type { ObjectId } from "mongodb";

export const metadata: Metadata = {
  title: "Programs",
  description: "Browse every TV Channel original show by genre - drama, news, music, sport, lifestyle, kids and more.",
  alternates: { canonical: "/programs" },
};

async function getPrograms(): Promise<ProgramResponse[]> {
  try {
    await ensureIndexes();
    const db = await getDb();
    const docs = await db
      .collection<ProgramDocument>(COLLECTIONS.programs)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return docs.map((d) => toProgramResponse(d as ProgramDocument & { _id: ObjectId }));
  } catch {
    return [];
  }
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="container-page pb-24 pt-22 lg:pt-30">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Catalogue</span>
        <h1 className="mt-2 font-display text-4xl font-bold">Programs</h1>
        <p className="mt-3 text-text-muted">
          {programs.length} original shows across every genre - search, filter and find your next watch.
        </p>
      </div>
      <Suspense fallback={null}>
        <ProgramsBrowser programs={programs} />
      </Suspense>
    </div>
  );
}