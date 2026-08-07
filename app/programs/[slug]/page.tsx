import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Clock, Star, CalendarDays } from "lucide-react";
import { shows, episodes } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return shows.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const show = shows.find((s) => s.slug === slug);
    if (!show) return {};
    return {
      title: show.title,
      description: show.synopsis,
      alternates: { canonical: `/programs/${show.slug}` },
      openGraph: { images: [{ url: show.image }] },
    };
  });
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const show = shows.find((s) => s.slug === slug);
  if (!show) notFound();

  const showEpisodes = episodes.filter((e) => e.showSlug === show.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: show.title,
    genre: show.category,
    description: show.synopsis,
  };

  return (
    <div className="pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="relative h-[56vh] min-h-95 w-full">
        <Image src={show.image} alt={show.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/70 to-background/10" />
        <div className="container-page relative flex h-full items-end pb-10">
          <div className="max-w-2xl">
            <div className="flex gap-2">
              <Badge variant="outline">{show.category}</Badge>
              {show.isNewEpisode && <Badge variant="new">New Episode</Badge>}
              {show.trending && <Badge variant="trending">Trending</Badge>}
            </div>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{show.title}</h1>
            <div className="mt-3 flex items-center gap-4 text-sm text-text-muted">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {show.duration}</span>
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> {show.rating}</span>
              {show.host && <span>Hosted by {show.host}</span>}
            </div>
            <p className="mt-4 text-text-muted">{show.synopsis}</p>
            <div className="mt-6 flex gap-3">
              <Button size="lg"><Play className="h-4 w-4" /> Watch Trailer</Button>
              <Button variant="glass" size="lg" asChild>
                <Link href="/schedule"><CalendarDays className="h-4 w-4" /> View in Schedule</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page mt-14">
        <h2 className="font-display text-2xl font-bold">Episodes</h2>
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {showEpisodes.length > 0 ? (
            showEpisodes.map((ep) => (
              <Link key={ep.slug} href={`/videos/${ep.slug}`} className="group overflow-hidden rounded-xl bg-surface">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={ep.image} alt={ep.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="260px" />
                  <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold">EP {ep.episodeNumber}</span>
                </div>
                <div className="p-3">
                  <h3 className="truncate text-sm font-medium">{ep.title}</h3>
                  <p className="mt-1 text-[11px] text-text-muted">{formatDate(ep.publishDate)} · {ep.duration}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-sm text-text-muted">No episodes published yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
