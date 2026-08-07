import type { Metadata } from "next";
import { Suspense } from "react";
import { news } from "@/lib/data";
import { NewsTicker } from "@/components/home/news-ticker";
import { NewsBrowser } from "@/components/news/news-browser";

export const metadata: Metadata = {
  title: "News",
  description: "Breaking news, politics, business, sport, technology, international and entertainment coverage from TV Channel.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return (
    <div className="pb-24 pt-32 lg:pt-40">
      <NewsTicker />
      <div className="container-page mt-10 mb-6 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">News Center</span>
        <h1 className="mt-2 font-display text-4xl font-bold">Latest News</h1>
        <p className="mt-3 text-text-muted">Search and filter TV Channel&apos;s newsroom coverage.</p>
      </div>
      <div className="container-page">
        <Suspense fallback={null}>
          <NewsBrowser articles={news} />
        </Suspense>
      </div>
    </div>
  );
}
