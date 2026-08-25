import type { Metadata } from "next";
import { podcasts } from "@/lib/data";
import { getYouTubeEpisodes } from "@/lib/youtube";
import { NewsBrowser } from "@/components/news/news-browser";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news and updates from the TV Channel.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const episodes = await getYouTubeEpisodes();

  return (
    <div className="container-page pb-24 pt-32 lg:pt-40">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">On Demand</span>
        <h1 className="mt-2 font-display text-4xl font-bold">News</h1>
        <p className="mt-3 text-text-muted">Recently added and most viewed - all in one searchable library.</p>
      </div>
      <NewsBrowser episodes={episodes} podcasts={podcasts} />
    </div>
  );
}