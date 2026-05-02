"use client";

import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/config/site.config";
import { useShouldAnimate, motionProps, fadeInUp } from "@/lib/motion";

export default function Hero() {
  const { hero, couple, animations } = SITE_CONFIG;
  const animate = useShouldAnimate();

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-4 py-24"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Overlapping photo stack */}
      <div className="relative w-[560px] max-w-full h-[280px] mx-auto mb-12">
        {hero.photos.map((photo, i) => {
          const posClass = i === 0 ? "left-0 w-[260px]" : "right-0 w-[240px]";
          return (
            <motion.div
              key={i}
              {...motionProps(animate, {
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 },
                transition: {
                  delay: i * 0.15,
                  duration: animations.durations.slow,
                  ease: animations.easings.enter,
                },
              })}
              style={{ rotate: photo.rotate }}
              className={`absolute shadow-xl rounded-sm overflow-hidden h-full ${posClass}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.style.display = "none";
                  const parent = img.parentElement;
                  if (parent) parent.style.backgroundColor = "#d4c9b0";
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Tagline */}
      <motion.p
        {...motionProps(animate, fadeInUp(hero.photos.length * 0.15 + 0.4))}
        className="font-serif italic text-center text-lg md:text-xl max-w-lg leading-relaxed"
      >
        {hero.tagline}
      </motion.p>

      {/* Couple names */}
      <motion.h1
        {...motionProps(animate, fadeInUp(hero.photos.length * 0.15 + 0.7))}
        className="font-serif mt-4 text-5xl md:text-7xl font-bold text-center"
      >
        {couple.monogram}
      </motion.h1>
    </section>
  );
}
