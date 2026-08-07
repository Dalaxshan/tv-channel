"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Radio, CalendarDays, Newspaper, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const slides = [
  {
    kind: "Featured Show",
    title: "Crimson Hour",
    tagline: "Season 3 premieres tonight at 8:00 PM",
    description: "Power, family and betrayal collide in the capital's most talked-about drama.",
    image: "https://picsum.photos/seed/hero-crimson/1600/900",
    href: "/programs/crimson-hour",
  },
  {
    kind: "Breaking News",
    title: "Capital Budget.",
    tagline: "Full coverage on Frontline Report",
    description: "Lawmakers approved the amended finance bill after a late-night session.",
    image: "https://picsum.photos/seed/hero-news/1600/900",
    href: "/news/capital-budget-vote",
  },
  {
    kind: "Live Event",
    title: "National Music Awards",
    tagline: "Live this Saturday, 7:00 PM",
    description: "The island's biggest artists gather for one unforgettable night.",
    image: "https://picsum.photos/seed/hero-awards/1600/900",
    href: "/watch-live",
  },
  {
    kind: "Campaign",
    title: "Download the TV Channel App",
    tagline: "Live TV in your pocket",
    description: "Stream every channel, set reminders and never miss a premiere.",
    image: "https://picsum.photos/seed/hero-app/1600/900",
    href: "#app-promo",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), []);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[index];

  return (
    <section className="relative h-[92svh] min-h-150 w-full overflow-hidden" aria-roledescription="carousel">
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.title}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-background/10" />
      <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/20 to-transparent" />
      <div className="absolute inset-0 animate-glow bg-[radial-gradient(circle_at_20%_30%,rgba(229,9,20,0.25),transparent_55%)]" />

      <div className="relative z-10 flex h-full items-end">
        <div className="container-page w-full pb-20 lg:pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.75 }}
              className="max-w-2xl"
            >
              <Badge variant={slide.kind === "Breaking News" ? "live" : "outline"}>
                {slide.kind}
              </Badge>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="mt-3 text-base font-medium text-accent">{slide.tagline}</p>
              <p className="mt-3 max-w-lg text-sm text-text-muted sm:text-base">
                {slide.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/watch-live">
                    <Radio className="h-4 w-4" /> Watch Live
                  </Link>
                </Button>
                <Button asChild variant="glass" size="lg">
                  <Link href={slide.href}>
                    <Play className="h-4 w-4" /> Explore Shows
                  </Link>
                </Button> 
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center gap-4">
            <button onClick={prev} aria-label="Previous slide" className="flex h-10 w-10 items-center justify-center rounded-full glass hover:text-accent">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-primary-light" : "w-3 bg-white/25 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button onClick={next} aria-label="Next slide" className="flex h-10 w-10 items-center justify-center rounded-full glass hover:text-accent">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
