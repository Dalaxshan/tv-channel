"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Radio, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroResponse } from "@/types/admin";
import { HeroSkeleton } from "../ui/hero-skeleton";
import { SocialIcons } from "./social-icon";

export function HeroCarousel({ onReady }: { onReady?: () => void }) {
  const [index, setIndex] = useState(0);
  const [heroes, setHeroes] = useState<HeroResponse[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const next = useCallback(() => {
    if (!heroes) return;
    setIndex((i) => (i + 1) % heroes.length);
  }, [heroes]);
  const prev = () => {
    if (!heroes) return;
    setIndex((i) => (i - 1 + heroes.length) % heroes.length);
  };

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);

  const slide = heroes?.[index];

  // get all hero slides
  async function loadHeroes() {
    try {
      const res = await fetch("/api/admin/heroes");
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to load heroes");
      setHeroes(json.data);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load heroes",
      );
      onReady?.();
    }
  }

  useEffect(() => {
    loadHeroes();
  }, []);

  if (!slide) {
    return (
      <section className="relative h-[92svh] min-h-150 w-full overflow-hidden">
        {/* Skeleton background */}
        <div className="absolute inset-0 animate-pulse bg-slate-900" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/5 to-background/1" />
        <div className="absolute inset-0 bg-linear-to-r from-background/80 via-background/20 to-transparent" />

        {loadError ? (
          <div className="relative z-10 flex h-full items-center justify-center">
            <p className="text-destructive">{loadError}</p>
          </div>
        ) : (
          <HeroSkeleton />
        )}
      </section>
    );
  }

  return (
    <section
      className="relative h-[92svh] min-h-screen w-full overflow-hidden"
      aria-roledescription="carousel"
    >
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
            src={slide.imageUrl}
            alt=""
            fill
            priority={index === 0}
            onLoad={index === 0 ? onReady : undefined}
            className="object-cover object-right md:object-center lg:object-top"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays — dark: deep fade / light: warm bright fade */}
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/5 to-background/1" />
      <div className="absolute inset-0 bg-linear-to-r from-background/100 via-background/20 to-transparent " />
      <div className="absolute inset-0 animate-glow bg-[radial-gradient(circle_at_20%_30%,rgba(229,9,20,0.25),transparent_55%)] " />

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
              <Badge
                className="bg-primary/10 border-primary/30"
                variant={slide.badge === "Breaking News" ? "live" : "outline"}
              >
                {slide.badge}
              </Badge>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="mt-3 text-base font-medium text-accent">
                {" "}
                {slide.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="btn-glass w-full sm:w-auto"
                >
                  <Link href={slide.cta.buttonUrl}>
                    <Radio className="h-4 w-4" /> Watch Now
                  </Link>
                </Button>
                <Button asChild variant="glass" className="w-full sm:w-auto" size="lg">
                  <Link href={slide.imageUrl}>
                    <Play className="h-4 w-4" /> Explore Shows
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full glass hover:text-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {heroes?.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-8 bg-primary-light"
                      : "w-3 bg-white/25 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full glass hover:text-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <SocialIcons />
    </section>
  );
}
