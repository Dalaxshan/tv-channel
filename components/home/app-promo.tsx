"use client";

import { useState } from "react";
import {
  Bell,
  Bookmark,
  WifiOff,
  QrCode,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

const features = [
  { icon: Bell, label: "Live episode & schedule alerts" },
  { icon: Bookmark, label: "Bookmark shows to watch later" },
  { icon: WifiOff, label: "Download and watch offline" },
];

const screenshots = [
  { src: "/app/ss0.png", alt: "Home screen" },
  { src: "/app/ss1.png", alt: "Live schedule" },
  { src: "/app/ss2.png", alt: "Offline downloads" },
];

export function AppPromo() {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const next = () => setIndex((i) => (i + 1) % screenshots.length);
  const prev = () =>
    setIndex((i) => (i - 1 + screenshots.length) % screenshots.length);

  return (
    <section id="app-promo" className="container-page lg:py-14">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-secondary to-background p-6 sm:p-10 lg:p-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/25 blur-[110px]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
              TV Channel, Everywhere
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Take our TV channel with you
            </h2>
            <p className="mt-3 max-w-lg text-sm text-text-muted sm:text-base">
              Download the TV Channel app for a full-screen streaming
              experience, tailored recommendations and instant breaking news
              alerts.
            </p>
            <ul className="mt-6 space-y-3">
              {features.map((f) => (
                <li
                  key={f.label}
                  className="flex items-center gap-3 text-sm text-text-muted"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-accent">
                    <f.icon className="h-4 w-4" />
                  </span>
                  {f.label}
                </li>
              ))}
            </ul>

            {/* Store buttons + QR badge - wraps to its own row on small screens */}
            <div className="mt-6 flex flex-col gap-2">
              {/* Row 1: Store buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a href="#" className="flex items-center text-sm font-medium">
                  <Image
                    src="/app-store.svg"
                    alt="App Store"
                    width={280}
                    height={54}
                    className="h-24 w-auto sm:h-36"
                  />
                </a>
                <a href="#" className="flex items-center text-sm font-medium">
                  <Image
                    src="/google-play.svg"
                    alt="Google Play"
                    width={280}
                    height={54}
                    className="h-24 w-auto sm:h-36"
                  />
                </a>
              </div>

              {/* Row 2: QR badge - always on its own row */}
              <div className="flex w-fit items-center gap-1 rounded-xl bg-white/90 p-3 shadow-lg backdrop-blur-sm sm:p-4">
                <QrCode
                  className="h-20 w-20 shrink-0 text-black sm:h-28 sm:w-28"
                  strokeWidth={1}
                />
                <span className="pr-1 text-sm font-medium leading-tight text-black sm:text-base">
                  Scan to
                  <br />
                  download
                </span>
              </div>
            </div>
          </div>

          {/* Image slider - vertically aligned with the feature column */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="group relative w-full max-w-[320px] sm:max-w-xs overflow-hidden rounded-2xl glass">
              <button
                type="button"
                onClick={() => setZoomed(true)}
                className="relative block aspect-[9/16] w-full cursor-zoom-in"
                aria-label="Zoom image"
              >
                <Image
                  src={screenshots[index].src}
                  alt={screenshots[index].alt}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </button>

              <button
                type="button"
                onClick={prev}
                className="absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 sm:h-8 sm:w-8"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60 sm:h-8 sm:w-8"
                aria-label="Next image"
              >
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {screenshots.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-accent" : "w-1.5 bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen zoom */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-sm"
          onClick={() => setZoomed(false)}
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6 sm:top-6"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev/next inside zoom too, for mobile browsing */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            className="relative h-[70vh] w-full max-w-sm sm:h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={screenshots[index].src}
              alt={screenshots[index].alt}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
