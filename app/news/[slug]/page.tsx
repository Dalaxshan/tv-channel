import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Play, Clock, Calendar } from "lucide-react";
import { episodes, podcasts } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return [...episodes.map((e) => ({ slug: e.slug })), ...podcasts.map((p) => ({ slug: p.slug }))];
}

function findVideo(slug: string) {
  const ep = episodes.find((e) => e.slug === slug);
  if (ep) return { type: "episode" as const, ...ep };
  const pod = podcasts.find((p) => p.slug === slug);
  if (pod) return { type: "podcast" as const, ...pod };
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const video = findVideo(slug);
  if (!video) return {};
  return {
    title: video.title,
    alternates: { canonical: `/videos/${slug}` },
    openGraph: { images: [{ url: video.image }] },
  };
}

export default async function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = findVideo(slug);
  if (!video) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    thumbnailUrl: video.image,
    uploadDate: video.type === "episode" ? video.publishDate : video.date,
    duration: video.duration,
  };

  return (
    <div className="container-page pb-24 pt-32 lg:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-4xl">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-surface glow-primary">
          <Image src={video.image} alt={video.title} fill className="object-cover opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button aria-label="Play video" className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/30">
              <Play className="h-6 w-6 translate-x-0.5" fill="white" />
            </button>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-light">
            {video.type === "episode" ? video.showTitle : video.guest}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{video.title}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {video.duration}</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {formatDate(video.type === "episode" ? video.publishDate : video.date)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
