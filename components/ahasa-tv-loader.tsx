"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

interface AhasaTVLoaderProps {
  /** Called once the intro sequence has fully finished and the overlay is gone. */
  onComplete?: () => void;
  /** Force-skip straight to the reduced-motion path, useful for testing. */
  forceReducedMotion?: boolean;
}

export default function AhasaTVLoader({
  onComplete,
  forceReducedMotion,
}: AhasaTVLoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const logoGroupRef = useRef<HTMLDivElement>(null);
  const ahasaRef = useRef<HTMLImageElement>(null);
  const tvRef = useRef<HTMLImageElement>(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const prefersReduced =
      forceReducedMotion ??
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const ctx = gsap.context(() => {
      const finish = () => {
        setMounted(false);
        onComplete?.();
      };

      if (prefersReduced) {
        // Simplified, fast path: no travel, no spin, just a clean fade.
        const tl = gsap.timeline({ onComplete: finish });
        tl.set([ahasaRef.current, tvRef.current], { x: 0, opacity: 0 })
          .to([ahasaRef.current, tvRef.current], {
            opacity: 1,
            duration: 0.35,
            ease: "power1.out",
          })
          .to({}, { duration: 0.25 })
          .to(overlayRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: "power1.inOut",
          });
        return;
      }

      const tl = gsap.timeline({ onComplete: finish });

      // 1) Initial state — pieces parked off-screen, faded and small.
      tl.set(ahasaRef.current, { xPercent: -220, opacity: 0, scale: 0.82 })
        .set(tvRef.current, { xPercent: 220, opacity: 0, scale: 0.82 })
        .set(logoGroupRef.current, { rotate: 0, scale: 1, filter: "brightness(1)" })
        .set(sweepRef.current, { xPercent: -140, opacity: 0 })
        .set(glowRef.current, { opacity: 0, scale: 0.6 });

      // 2) Assembly — the two halves travel in and lock into place.
      tl.to(
        ahasaRef.current,
        { xPercent: 0, opacity: 1, scale: 1, duration: 1.1, ease: "expo.out" },
        0.15
      ).to(
        tvRef.current,
        { xPercent: 0, opacity: 1, scale: 1, duration: 1.1, ease: "expo.out" },
        0.15
      );

      // a faint light sweep crosses behind the mark as it locks in
      tl.to(
        sweepRef.current,
        { opacity: 0.5, duration: 0.35, ease: "sine.out" },
        0.55
      )
        .to(
          sweepRef.current,
          { xPercent: 140, opacity: 0, duration: 0.7, ease: "sine.inOut" },
          0.65
        );

      // small settle "thud" on arrival
      tl.to(
        logoGroupRef.current,
        { scale: 1.03, duration: 0.12, ease: "power2.out" },
        1.15
      ).to(
        logoGroupRef.current,
        { scale: 1, duration: 0.22, ease: "power2.inOut" },
        1.27
      );

      // 3) Brief pause, then one full, deliberate rotation.
      tl.to({}, { duration: 0.4 });
      tl.to(logoGroupRef.current, {
        rotate: 360,
        duration: 1.05,
        ease: "power2.inOut",
      });

      // 4) Zoom — the assembled mark pushes forward with a soft glow.
      tl.to(glowRef.current, { opacity: 1, scale: 1.4, duration: 0.9, ease: "power2.out" }, ">-0.15")
        .to(
          logoGroupRef.current,
          {
            scale: 1.7,
            filter: "brightness(1.25)",
            duration: 0.9,
            ease: "power2.in",
          },
          "<"
        );

      // 5) Hold, then the overlay lifts away to reveal the site.
      tl.to({}, { duration: 0.2 });
      tl.to(overlayRef.current, {
        yPercent: -100,
        duration: 0.75,
        ease: "power3.inOut",
      });
    }, overlayRef);

    return () => ctx.revert();
  }, [onComplete, forceReducedMotion]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-[#fff]"
      aria-hidden="true"
    >
      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(15,15,111,0.16) 0%, rgba(5,6,8,0) 55%), radial-gradient(ellipse at center, rgba(5,6,8,0) 0%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* soft ambient glow behind the mark, revealed during the zoom */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute h-[38vh] w-[38vh] max-h-[420px] max-w-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(31,31,150,0.55) 0%, rgba(31,31,150,0) 70%)",
          filter: "blur(18px)",
        }}
      />

      {/* logo assembly */}
      <div className="relative flex w-full items-center justify-center px-6">
        <div
          ref={logoGroupRef}
          className="relative flex items-center"
          style={{ willChange: "transform, filter" }}
        >
          {/* light sweep */}
          <div
            ref={sweepRef}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
              mixBlendMode: "screen",
            }}
          />

          <div
            className="flex items-center"
            style={{ gap: "clamp(10px, 3vh, 26px)" }}
          >
            <Image
              ref={ahasaRef}
              src="/tv-part.png"
              alt="Ahasa"
              width={200}
              height={80}
              draggable={false}
              className="h-[9vh] w-auto min-h-[34px] max-h-[92px] select-none sm:h-[10vh]"
              style={{ willChange: "transform, opacity" }}
            />
            <Image
              ref={tvRef}
              src="/channel-part.png"
              alt="TV"
              width={200}
              height={80}
              draggable={false}
              className="h-[9vh] w-auto min-h-[34px] max-h-[92px] select-none sm:h-[10vh]"
              style={{ willChange: "transform, opacity" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
