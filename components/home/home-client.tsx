"use client";

import { useState } from "react";
import AhasaTVLoader from "@/components/ahasa-tv-loader";
import { HeroCarousel } from "@/components/home/hero-carousel";

export default function HomeClient() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [heroReady, setHeroReady] = useState(false);

  const bothReady = loaderDone && heroReady;

  return (
    <>
      {!bothReady && (
        <AhasaTVLoader onComplete={() => setLoaderDone(true)} />
      )}
      <HeroCarousel onReady={() => setHeroReady(true)} />
    </>
  );
}
