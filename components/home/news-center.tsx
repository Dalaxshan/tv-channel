import Image from "next/image";
import Link from "next/link";
import { news } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { NewsTicker } from "@/components/home/news-ticker";

export function NewsCenter() {
  const [featured, ...rest] = news;

  return (
    <section className="bg-surface/40 py-16 lg:py-24">
      <NewsTicker />
      <div className="container-page mt-12">
        <SectionHeading
          eyebrow="News Center"
          title="Latest News"
          description="Politics, business, sport, technology and international coverage - updated around the clock."
          action={{ label: "All news", href: "/news" }}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <Link
            href={`/news/${featured.slug}`}
            className="group relative col-span-1 overflow-hidden rounded-2xl lg:col-span-2"
          >
            <div className="relative aspect-16/10 lg:aspect-16/9">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width:1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="flex gap-2">
                {featured.breaking && <Badge variant="live">Breaking</Badge>}
                <Badge variant="outline">{featured.category}</Badge>
              </div>
              <h3 className="mt-3 font-display text-xl font-bold leading-snug sm:text-2xl">
                {featured.title}
              </h3>
              <p className="mt-2 max-w-xl text-sm text-text-muted">{featured.excerpt}</p>
              <p className="mt-3 text-xs text-text-muted">
                {featured.author} · {formatDate(featured.date)} · {featured.readingTime}
              </p>
            </div>
          </Link>

          <div className="flex flex-col gap-5">
            {rest.slice(0, 3).map((article) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="group flex gap-4 rounded-xl p-2 hover:bg-white/5"
              >
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                  <Image src={article.image} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="112px" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-light">
                    {article.category}
                  </p>
                  <h4 className="mt-0.5 text-sm font-medium leading-snug line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-text-muted">
                    {formatDate(article.date)} · {article.readingTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
