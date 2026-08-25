import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and videos from TV Channel events, shoots and behind-the-scenes moments.",
  alternates: { canonical: "/gallery" },
};

const albums = [
  { title: "Awards Night 2026", count: 24, image: "https://picsum.photos/seed/gallery-awards/700/500" },
  { title: "Crimson Hour - Behind the Scenes", count: 18, image: "https://picsum.photos/seed/gallery-crimson/700/500" },
  { title: "Island Beats Live", count: 32, image: "https://picsum.photos/seed/gallery-beats/700/500" },
  { title: "Newsroom Tour", count: 12, image: "https://picsum.photos/seed/gallery-newsroom/700/500" },
  { title: "National Sports Gala", count: 27, image: "https://picsum.photos/seed/gallery-sports/700/500" },
  { title: "Studio Renovation", count: 9, image: "https://picsum.photos/seed/gallery-studio/700/500" },
];

export default function GalleryPage() {
  return (
    <div className="container-page pb-24 pt-32 lg:pt-40">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Behind The Scenes</span>
        <h1 className="mt-2 font-display text-4xl font-bold">Gallery</h1>
        <p className="mt-3 text-text-muted">Photos and videos from our studios, events and productions.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((a) => (
          <div key={a.title} className="group relative aspect-7/5 overflow-hidden rounded-2xl">
            <Image src={a.image} alt={a.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 90vw, 380px" />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="font-display text-base font-semibold">{a.title}</h3>
              <p className="text-xs text-text-muted">{a.count} items</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
