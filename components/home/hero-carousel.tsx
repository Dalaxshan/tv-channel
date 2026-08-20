"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Radio, ChevronLeft, ChevronRight } from "lucide-react";
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

  const socials = [
    {
      name: "YouTube",
      href: "https://youtube.com/@yourchannel",
      color: "#FF0000",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/yourhandle",
      color: "#E4405F",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.668-.072-4.948C23.73 2.698 21.311.273 16.952.073 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://facebook.com/yourpage",
      color: "#1877F2",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://twitter.com/yourhandle",
      color: "#000000",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Threads",
      href: "https://threads.net/@yourhandle",
      color: "#000000",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.021c.028-3.573.879-6.428 2.523-8.482C5.845 1.203 8.6.024 12.185 0h.007c2.75.02 5.043.729 6.815 2.109 1.667 1.297 2.85 3.13 3.516 5.44l-2.006.575c-1.13-3.937-3.876-5.938-8.15-5.972-2.973.023-5.024.968-6.31 2.891-1.036 1.55-1.622 3.83-1.647 6.427.025 2.598.611 4.878 1.647 6.428 1.286 1.923 3.337 2.868 6.31 2.891 2.87-.021 4.708-.844 5.912-2.663.6-.907.938-1.964 1.07-3.185-.395-.16-.834-.29-1.312-.386-1.15-.234-2.435-.293-3.62-.11-.42.065-.815.16-1.176.284l-.582-1.887c.45-.14.94-.256 1.463-.336 1.395-.216 2.884-.146 4.238.136.463.096.905.216 1.32.361.005-.058.01-.117.013-.176.152-2.68-.55-4.77-2.032-6.038-1.34-1.147-3.294-1.75-5.65-1.746-2.66.005-4.7.87-5.897 2.503-1.05 1.434-1.598 3.552-1.598 6.13v.032c0 2.578.548 4.696 1.598 6.13 1.198 1.633 3.237 2.498 5.897 2.503 2.267-.004 3.973-.552 5.07-1.63.98-.964 1.53-2.313 1.634-4.01l2.006.005c-.13 2.19-.858 3.947-2.164 5.23-1.535 1.508-3.72 2.28-6.5 2.285z" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      href: "https://t.me/yourhandle",
      color: "#26A5E4",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212-.07-.062-.174-.041-.249-.024-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/yourprofile",
      color: "#0A66C2",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z" />
        </svg>
      ),
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
      <div className="container-page flex flex-wrap items-center justify-center gap-3">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:opacity-80 transition-opacity"
          style={{ backgroundColor: social.color }}
        >
          <span className="w-5 h-5">{social.svg}</span>
        </a>
      ))}
    </div>
   
    </section>
  );
}
