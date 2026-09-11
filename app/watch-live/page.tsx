import type { Metadata } from "next";
import Image from "next/image";
import { Play, Share2, Maximize2, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Watch Live",
  description: "Stream TV Channel live, including our alternative regional channel, plus the current on-air schedule.",
  alternates: { canonical: "/watch-live" },
};

export default function WatchLivePage() {
  return (
    <div className="container-page pb-24 pt-32 lg:pt-40">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Live</span>
        <h1 className="mt-2 font-display text-4xl font-bold">Watch Live</h1>
        <p className="mt-3 text-text-muted">
          Stream TV Channel&apos;s main channel and our alternative regional feed - free, live, no sign-in required.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-surface glow-primary">
            <Image src="https://picsum.photos/seed/watch-live-main/1200/675" alt="TV Channel main channel" fill className="object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button aria-label="Play" className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/30">
                <Play className="h-6 w-6 translate-x-0.5" fill="white" />
              </button>
            </div>
            <div className="absolute left-4 top-4"><Badge variant="live">Main Channel · Live</Badge></div>
            <div className="absolute right-4 top-4 flex gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full glass" aria-label="Share"><Share2 className="h-4 w-4" /></button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full glass" aria-label="Fullscreen"><Maximize2 className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold">Alternative Stream</h2>
            <p className="mt-1 text-sm text-text-muted">Regional feed with local-language programming.</p>
            <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl bg-surface">
              <Image src="https://picsum.photos/seed/watch-live-alt/1200/675" alt="TV Channel alternative channel" fill className="object-cover opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button aria-label="Play alternative stream" className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/30">
                  <Play className="h-5 w-5 translate-x-0.5" fill="white" />
                </button>
              </div>
              <div className="absolute left-4 top-4"><Badge variant="live">Regional · Live</Badge></div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl glass p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <MessageCircle className="h-4 w-4 text-accent" /> Live Chat
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              Sign in to join the conversation with other viewers while the show is live.
            </p>
          </div>
        </div>

        <aside className="rounded-2xl glass p-6">
          <h2 className="font-display text-lg font-semibold">Current Schedule</h2>
          {/* <ol className="mt-4 space-y-4">
            {schedule.map((item) => (
              <li key={`${item.time}-${item.title}`} className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-text-muted">{item.category}{item.host ? ` · ${item.host}` : ""}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono text-xs text-accent">{item.time}</span>
                  {item.live && <Badge variant="live">Live</Badge>}
                </div>
              </li>
            ))}
          </ol> */}
        </aside>
      </div>
    </div>
  );
}
