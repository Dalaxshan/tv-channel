import type { Metadata } from "next";
import { episodes, podcasts } from "@/lib/data";
import { VideosBrowser } from "@/components/videos/videos-browser";

export const metadata: Metadata = {
  title: "Video Library",
  description: "Search and stream every TV Channel episode, interview and podcast on demand.",
  alternates: { canonical: "/videos" },
};

export default function VideosPage() {
  return (
    <div className="container-page pb-24 pt-32 lg:pt-40">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">On Demand</span>
        <h1 className="mt-2 font-display text-4xl font-bold">Video Library</h1>
        <p className="mt-3 text-text-muted">Recently added, most viewed and featured — all in one searchable library.</p>
      </div>
      <VideosBrowser episodes={episodes} podcasts={podcasts} />
    </div>
  );
}
