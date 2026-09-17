"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

interface AhasaTVLoaderProps {
  onComplete?: () => void;
  forceReducedMotion?: boolean;
  /** Keep true while page assets are loading. Flip to false to trigger exit. */
  isLoading?: boolean;
}

export default function AhasaTVLoader({
  onComplete,
  forceReducedMotion,
  isLoading = true,
}: AhasaTVLoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const logoGroupRef = useRef<HTMLDivElement>(null);
  const ahasaRef = useRef<HTMLImageElement>(null);
  const tvRef = useRef<HTMLImageElement>(null);
  const dot1Ref = useRef<HTMLSpanElement>(null);
  const dot2Ref = useRef<HTMLSpanElement>(null);
  const dot3Ref = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  const hasRun = useRef(false);
  const assemblyDone = useRef(false);
  const exitStarted = useRef(false);
  const bounceTl = useRef<gsap.core.Timeline | null>(null);
  const isLoadingRef = useRef(isLoading);

  const [mounted, setMounted] = useState(true);

  // Stable exit function
  const exit = useRef(() => {
    if (exitStarted.current) return;
    exitStarted.current = true;

    // Stop bouncing dots
    bounceTl.current?.kill();
    gsap.to(dotsRef.current, { opacity: 0, duration: 0.2 });

    // Zoom logo then slide overlay away
    gsap.timeline({
      onComplete: () => { setMounted(false); onComplete?.(); },
    })
      .to(logoGroupRef.current, { scale: 1.3, duration: 0.5, ease: "power2.inOut" }, 0)
      .to(overlayRef.current, { opacity: 0, duration: 0.35, ease: "power2.in" }, 0.25)
      .to(overlayRef.current, { yPercent: -100, duration: 0.55, ease: "power3.inOut" }, 0.3);
  });

  // Watch isLoading — trigger exit as soon as assembly is done
  useEffect(() => {
    isLoadingRef.current = isLoading;
    if (!isLoading && assemblyDone.current && !exitStarted.current) {
      exit.current();
    }
  }, [isLoading]);

  // Assembly — runs exactly once
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const prefersReduced =
      forceReducedMotion ??
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (prefersReduced) {
      gsap.timeline()
        .set([ahasaRef.current, tvRef.current], { opacity: 0 })
        .to([ahasaRef.current, tvRef.current], { opacity: 1, duration: 0.35, ease: "power1.out" })
        .call(() => {
          assemblyDone.current = true;
          if (!isLoadingRef.current) exit.current();
        });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        assemblyDone.current = true;

        // Start bouncing dots
        gsap.set(dotsRef.current, { opacity: 1 });
        const bounce = gsap.timeline({ repeat: -1 });
        [dot1Ref.current, dot2Ref.current, dot3Ref.current].forEach((dot, i) => {
          bounce
            .to(dot, { y: -9, duration: 0.3, ease: "power2.out" }, i * 0.13)
            .to(dot, { y: 0,  duration: 0.3, ease: "power2.in"  }, i * 0.13 + 0.3);
        });
        bounceTl.current = bounce;

        // If loading already finished before assembly completed, exit now
        if (!isLoadingRef.current) exit.current();
      },
    });

    tl.set(ahasaRef.current,  { xPercent: -220, opacity: 0, scale: 0.82 })
      .set(tvRef.current,     { xPercent:  220, opacity: 0, scale: 0.82 })
      .set(logoGroupRef.current, { rotate: 0, scale: 1, filter: "brightness(1)" })
      .set(sweepRef.current,  { xPercent: -140, opacity: 0 })
      .set(glowRef.current,   { opacity: 0, scale: 0.6 })
      .set(dotsRef.current,   { opacity: 0 });

    // Slide in both parts simultaneously
    tl.to(ahasaRef.current, { xPercent: 0, opacity: 1, scale: 1, duration: 1.1, ease: "expo.out" }, 0.15)
      .to(tvRef.current,    { xPercent: 0, opacity: 1, scale: 1, duration: 1.1, ease: "expo.out" }, 0.15);

    // Sweep flash
    tl.to(sweepRef.current, { opacity: 0.5, duration: 0.35, ease: "sine.out"   }, 0.55)
      .to(sweepRef.current, { xPercent: 140, opacity: 0, duration: 0.7, ease: "sine.inOut" }, 0.65);
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-[#05050f]"
      aria-hidden="true"
    >
      <Image
        src="https://pub-626e990ccc2e4de986e8dd86852d93f3.r2.dev/loader-bg.jpg"
        alt="" fill priority unoptimized
        className="object-cover opacity-90"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(15,15,111,0.16) 0%, rgba(5,6,8,0) 55%), radial-gradient(ellipse at center, rgba(5,6,8,0) 0%, rgba(0,0,0,0.65) 100%)",
        }}
      />
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-[38vh] w-[38vh] max-h-[420px] max-w-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(31,31,150,0.55) 0%, rgba(31,31,150,0) 70%)",
          filter: "blur(18px)",
        }}
      />

      <div className="relative flex w-full flex-col items-center justify-center gap-6 px-6">
        {/* Logo */}
        <div
          ref={logoGroupRef}
          className="relative flex items-center"
          style={{ willChange: "transform, filter" }}
        >
          <div ref={sweepRef} className="pointer-events-none absolute inset-y-0 left-0 w-1/3" />
          <div className="flex items-center" style={{ gap: "clamp(10px, 3vh, 26px)" }}>
            <Image
              ref={ahasaRef}
              src="/tv-part.png"
              alt="Ahasa"
              width={200} height={80}
              draggable={false}
              className="h-[9vh] w-auto min-h-[34px] max-h-[92px] select-none sm:h-[10vh]"
              style={{ willChange: "transform, opacity" }}
            />
            <Image
              ref={tvRef}
              src="/channel-part.png"
              alt="TV"
              width={200} height={80}
              draggable={false}
              className="h-[9vh] w-auto min-h-[34px] max-h-[92px] select-none sm:h-[10vh]"
              style={{ willChange: "transform, opacity" }}
            />
          </div>
        </div>

        {/* Bouncing dots — visible while loading */}
        <div
          ref={dotsRef}
          className="flex items-center gap-[6px] opacity-0"
          style={{ willChange: "opacity" }}
        >
          <span ref={dot1Ref} className="block h-[7px] w-[7px] rounded-full bg-white/70" />
          <span ref={dot2Ref} className="block h-[7px] w-[7px] rounded-full bg-white/70" />
          <span ref={dot3Ref} className="block h-[7px] w-[7px] rounded-full bg-white/70" />
        </div>
      </div>
    </div>
  );
}
