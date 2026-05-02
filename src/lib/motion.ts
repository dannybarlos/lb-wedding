"use client";

import { useReducedMotion } from "framer-motion";
import { SITE_CONFIG } from "@/config/site.config";

const { durations, easings } = SITE_CONFIG.animations;

/**
 * SSR-safe hook that returns whether animations should play.
 * Respects the SITE_CONFIG.animations.reducedMotion setting and the
 * user's OS prefers-reduced-motion preference via Framer Motion's hook.
 *
 * useReducedMotion() returns null on the server (no window) and a boolean
 * on the client — null is treated as "animate" to match server output and
 * avoid hydration mismatches.
 */
export function useShouldAnimate(): boolean {
  const prefersReduced = useReducedMotion(); // null | boolean
  if (!SITE_CONFIG.animations.enabled) return false;
  const rm = SITE_CONFIG.animations.reducedMotion;
  if (rm === "never") return true;
  if (rm === "always") return false;
  // "auto": animate unless the user has explicitly requested reduced motion.
  // null (SSR) → animate, matching the server-rendered output.
  return prefersReduced !== true;
}

/**
 * Pure helper (not a hook) — safe to call inside .map() callbacks.
 * Returns the motion props when animations are enabled, empty object otherwise.
 * Components always use motion.* elements; this controls whether they animate.
 */
export function motionProps<T extends object>(
  animate: boolean,
  props: T
): T | Record<string, never> {
  return animate ? props : {};
}

export const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: durations.normal, ease: easings.enter },
});

export const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration: durations.normal, ease: easings.enter },
});

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.12 } },
};
