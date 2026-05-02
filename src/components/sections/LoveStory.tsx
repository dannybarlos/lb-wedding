"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SITE_CONFIG } from "@/config/site.config";
import { FLAGS } from "@/config/flags";
import PolaroidStack from "@/components/ui/PolaroidStack";
import { useShouldAnimate, motionProps } from "@/lib/motion";

type Stage = typeof SITE_CONFIG.loveStory.stages[number];

interface StageRowProps {
  stage: Stage;
  direction: "ltr" | "rtl";
  index: number;
}

function StageRow({ stage, direction, index }: StageRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const animate = useShouldAnimate();
  const xOffset = direction === "ltr" ? -40 : 40;

  const textBlock = (
    <div className="flex flex-col justify-center space-y-3">
      <span className="text-xs tracking-widest uppercase text-neutral-400">
        {stage.label}
      </span>
      <p className="text-base md:text-lg leading-relaxed text-neutral-700">
        {stage.body}
      </p>
    </div>
  );

  const photoBlock = (
    <div className="flex items-center justify-center py-8">
      <PolaroidStack photos={stage.photos} />
    </div>
  );

  return (
    <motion.div
      ref={ref}
      {...motionProps(animate, {
        initial: { opacity: 0, x: xOffset },
        animate: isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: xOffset },
        transition: {
          duration: SITE_CONFIG.animations.durations.normal,
          delay: index * 0.05,
          ease: SITE_CONFIG.animations.easings.enter,
        },
      })}
      className="mb-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {direction === "ltr" ? (
          <>{textBlock}{photoBlock}</>
        ) : (
          <>{photoBlock}{textBlock}</>
        )}
      </div>
    </motion.div>
  );
}

export default function LoveStory() {
  const { loveStory } = SITE_CONFIG;

  if (!FLAGS.loveStoryVisible) return null;

  return (
    <section className="relative py-24 px-6 md:px-16 max-w-5xl mx-auto">
      <h2
        className="font-serif text-4xl md:text-6xl font-bold text-center mb-20 sticky top-20 z-10 py-2"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        {loveStory.heading}
      </h2>

      {loveStory.stages.map((stage, i) => (
        <StageRow
          key={stage.id}
          stage={stage}
          direction={i % 2 === 0 ? "ltr" : "rtl"}
          index={i}
        />
      ))}
    </section>
  );
}
