"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

interface AhasaTVLoaderProps {
  onComplete?: () => void;
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
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const prefersReduced =
      forceReducedMotion ??
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const ctx = gsap.context(() => {
      const exit = () => {
        gsap.to(overlayRef.current, {
          yPercent: -100,
          duration: 0.75,
          ease: "power3.inOut",
          onComplete: () => {
            setMounted(false);
            onComplete?.();
          },
        });
      };

      if (prefersReduced) {
        gsap
          .timeline()
          .set([ahasaRef.current, tvRef.current], { x: 0, opacity: 0 })
          .to([ahasaRef.current, tvRef.current], { opacity: 1, duration: 0.35, ease: "power1.out" })
          .to({}, { duration: 0.25 })
          .to(overlayRef.current, { opacity: 0, duration: 0.4, ease: "power1.inOut", onComplete: () => { setMounted(false); onComplete?.(); } });
        return;
      }

      // ── Phase 1: assembly (runs once) ──────────────────────────────────────
      const assembly = gsap.timeline({
        onComplete: () => {
          // ── Phase 2: continuous spin until loading is "done" ───────────────
          const spin = gsap.to(logoGroupRef.current, {
            rotate: "+=360",
            duration: 3.5,
            ease: "none",
            repeat: -1,
          });

          // ── Phase 3: after hold, snap to nearest full rotation then exit ───
          // 2.5 s hold while spinning, then finish the current rotation cleanly
          gsap.delayedCall(2.5, () => {
            // How far through the current 360 are we?
            const currentRotation = gsap.getProperty(logoGroupRef.current, "rotation") as number;
            const remainder = 360 - (((currentRotation % 360) + 360) % 360);
            const snapDuration = (remainder / 360) * 3.5;

            spin.kill();

            gsap.to(logoGroupRef.current, {
              rotate: `+=${remainder}`,
              duration: snapDuration < 0.05 ? 0 : snapDuration,
              ease: "none",
              onComplete: exit,
            });
          });
        },
      });

      assembly
        .set(ahasaRef.current, { xPercent: -220, opacity: 0, scale: 0.82 })
        .set(tvRef.current, { xPercent: 220, opacity: 0, scale: 0.82 })
        .set(logoGroupRef.current, { rotate: 0, scale: 1, filter: "brightness(1)" })
        .set(sweepRef.current, { xPercent: -140, opacity: 0 })
        .set(glowRef.current, { opacity: 0, scale: 0.6 });

      assembly
        .to(ahasaRef.current, { xPercent: 0, opacity: 1, scale: 1, duration: 1.1, ease: "expo.out" }, 0.15)
        .to(tvRef.current, { xPercent: 0, opacity: 1, scale: 1, duration: 1.1, ease: "expo.out" }, 0.15);

      assembly
        .to(sweepRef.current, { opacity: 0.5, duration: 0.35, ease: "sine.out" }, 0.55)
        .to(sweepRef.current, { xPercent: 140, opacity: 0, duration: 0.7, ease: "sine.inOut" }, 0.65);

      assembly
        .to(logoGroupRef.current, { scale: 1.03, duration: 0.12, ease: "power2.out" }, 1.15)
        .to(logoGroupRef.current, { scale: 1, duration: 0.22, ease: "power2.inOut" }, 1.27);
    }, overlayRef);

  }, [onComplete, forceReducedMotion]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-[#05050f]"
      aria-hidden="true"
    >
      <Image
        src="https://pub-626e990ccc2e4de986e8dd86852d93f3.r2.dev/loader-bg.jpg"
        alt=""
        fill
        priority
        unoptimized
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
      <div className="relative flex w-full items-center justify-center px-6">
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
