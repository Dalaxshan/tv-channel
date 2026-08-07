import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, User } from "lucide-react";
import { news } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: { images: [{ url: article.image }] },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);
  if (!article) notFound();

  const related = news.filter((n) => n.category === article.category && n.slug !== article.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.date,
    author: { "@type": "Person", name: article.author },
    image: article.image,
  };

  return (
    <article className="pb-24 pt-32 lg:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-page max-w-3xl">
        <div className="flex gap-2">
          {article.breaking && <Badge variant="live">Breaking</Badge>}
          <Badge variant="outline">{article.category}</Badge>
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">{article.title}</h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {article.author}</span>
          <span>{formatDate(article.date)}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {article.readingTime}</span>
        </div>
        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl">
          <Image src={article.image} alt={article.title} fill className="object-cover" priority />
        </div>
        <div className="prose prose-invert mt-8 max-w-none text-text-muted">
          <p className="text-lg text-text">{article.excerpt}</p>
          <p>
            This is placeholder body copy for the article — in production this section renders
            rich content delivered from your CMS (headings, images, embeds, quotes and links),
            following the same editorial structure used across the newsroom.
          </p>
          <p>
            TV Channel&apos;s newsroom will continue to update this story as more information becomes
            available. Check back for the latest developments, or watch full coverage on
            Frontline Report.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container-page mt-16 max-w-3xl border-t border-white/10 pt-10">
          <h2 className="font-display text-xl font-semibold">More in {article.category}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/news/${r.slug}`} className="group">
                <div className="relative aspect-16/10 overflow-hidden rounded-xl">
                  <Image src={r.image} alt={r.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="260px" />
                </div>
                <h3 className="mt-2 text-sm font-medium leading-snug line-clamp-2">{r.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
