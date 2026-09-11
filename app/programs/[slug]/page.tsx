import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getEpisodesByShowSlug } from "@/lib/youtube";
import { getDb, COLLECTIONS, ensureIndexes } from "@/lib/db/mongodb";
import { toProgramResponse } from "@/lib/program-serializer";
import { summarizeSchedule } from "@/lib/utils";
import type { ProgramDocument, ProgramResponse } from "@/types/admin";
import type { Category } from "@/types";
import type { ObjectId } from "mongodb";
import ProgramGrid from "@/components/programs/program-grid";

async function getProgramBySlug(slug: string): Promise<ProgramResponse | null> {
  try {
    await ensureIndexes();
    const db = await getDb();
    const decoded = decodeURIComponent(slug);
    const doc = await db
      .collection<ProgramDocument>(COLLECTIONS.programs)
      .findOne({ slug: decoded });
    if (!doc) return null;
    return toProgramResponse(doc as ProgramDocument & { _id: ObjectId });
  } catch {
    return null;
  }
}

async function getAllPrograms(): Promise<ProgramResponse[]> {
  try {
    await ensureIndexes();
    const db = await getDb();
    const docs = await db
      .collection<ProgramDocument>(COLLECTIONS.programs)
      .find({})
      .toArray();
    return docs.map((d) => toProgramResponse(d as ProgramDocument & { _id: ObjectId }));
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const programs = await getAllPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return {};
  return {
    title: program.title,
    alternates: { canonical: `/programs/${slug}` },
    openGraph: { images: [{ url: program.thumbnailUrl }] },
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  const episodes = await getEpisodesByShowSlug(
    slug,
    program.title,
    program.category as Category,
  );

  const sortedEpisodes = [...episodes].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );

  const heroImage = sortedEpisodes[0]?.image ?? program.thumbnailUrl;
  const scheduleInfo = summarizeSchedule(program.schedule);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: program.title,
    genre: program.category,
  };

  return (
    <div className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative h-[64vh] min-h-105 w-full overflow-hidden">
        <Image
          src={heroImage}
          alt={program.title}
          fill
          priority
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/5 to-background/1" />
        <div className="absolute inset-0 bg-linear-to-r from-background/80 via-background/20 to-transparent" />
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

        <div className="container-page relative flex h-full items-end pb-10">
          <div className="max-w-2xl">
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-primary">
                {program.category}
              </Badge>
              {sortedEpisodes.length > 0 && (
                <Badge variant="outline" className="text-text-muted">
                  {sortedEpisodes.length} episodes
                </Badge>
              )}
            </div>

            <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
              {program.title}
            </h1>

            {scheduleInfo && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs backdrop-blur-sm">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">{scheduleInfo.dayLabel}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">{scheduleInfo.timeLabel}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-page mt-14">
        <h2 className="font-display text-2xl font-bold">Episodes</h2>
        <ProgramGrid episodes={sortedEpisodes} />
      </div>
    </div>
  );
}
