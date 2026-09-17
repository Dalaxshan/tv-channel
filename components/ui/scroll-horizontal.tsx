"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { AppPromo } from "../home/app-promo";
import { Show } from "@/types";
import { ProgramCard } from "../home/program-card";
import { SectionHeading } from "./section-heading";

const ITEM_WIDTH = 300;
const GAP = 30;

export default function ScrollHorizontal({ shows }: { shows: Show[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const totalDistance = (shows.length - 1) * (ITEM_WIDTH + GAP);
  const x = useTransform(scrollYProgress, (v) => {
    return -(v * totalDistance);
  });

  return (
    <div>
      <div className="container-page">
        <SectionHeading
          eyebrow="Don't Miss"
          title="Featured Shows"
          description="Handpicked programs leading this week's lineup."
        />
      </div>

      {/* scroll-container: tall enough to drive the animation */}
      <div ref={containerRef} style={{ height: "130vh", position: "relative", marginTop: "-3rem", marginBottom: "-3rem"}}>
        <div
          ref={wrapperRef}
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
          }}
        >
          <motion.div
            style={{
              x,
              display: "flex",
              gap: GAP,
              willChange: "transform",
              paddingLeft: "3rem",
            }}
          >
            {shows.map((show) => (
              <div
                key={show.slug}
                style={{
                  flexShrink: 0,
                  width: ITEM_WIDTH,
                  height: 400,
                  borderRadius: 12,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <ProgramCard show={show} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <AppPromo />
    </div>
  );
}
