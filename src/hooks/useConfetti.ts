"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { SITE_CONFIG } from "@/config/site.config";
import { FLAGS } from "@/config/flags";

export function useConfetti(ref: React.RefObject<Element | null>) {
  const hasFired = useRef(false);
  const isInView = useInView(ref, { amount: 0.3, once: true });

  useEffect(() => {
    if (!isInView) return;
    if (!FLAGS.countdownConfetti) return;
    if (hasFired.current) return;
    if (SITE_CONFIG.confetti.fireOnce) hasFired.current = true;

    import("canvas-confetti").then(({ default: confetti }) => {
      const { particleCount, spread, origin, colors, scalar, ticks, gravity, drift, shapes } =
        SITE_CONFIG.confetti;
      confetti({
        particleCount, spread, origin, scalar, ticks, gravity, drift,
        colors: [...colors],
        shapes: [...shapes],
      });
    });
  }, [isInView]);
}
