"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/config/site.config";
import { useShouldAnimate } from "@/lib/motion";

interface PolaroidStackProps {
  photos: readonly { src: string; caption: string }[];
  baseRotations?: number[];
}

const DEFAULT_ROTATIONS = [-4, -1, 3, 1];

export default function PolaroidStack({
  photos,
  baseRotations = DEFAULT_ROTATIONS,
}: PolaroidStackProps) {
  const [fanned, setFanned] = useState(false);
  const animate = useShouldAnimate();
  const dur = SITE_CONFIG.animations.durations.normal;

  const getRotation = (i: number) => baseRotations[i % baseRotations.length] ?? 0;

  return (
    <div
      className="relative w-48 h-56 cursor-pointer select-none"
      onMouseEnter={() => setFanned(true)}
      onMouseLeave={() => setFanned(false)}
      onClick={() => setFanned((f) => !f)}
      aria-label="Photo stack — hover to fan"
    >
      {photos.map((photo, i) => {
        const baseRotate = getRotation(i);
        const rotate = animate && fanned ? baseRotate * 1.8 : baseRotate;
        const offsetX = animate && fanned ? (i - (photos.length - 1) / 2) * 24 : 0;
        const offsetY = animate && fanned ? Math.abs(i - (photos.length - 1) / 2) * 8 : 0;

        return (
          <motion.div
            key={i}
            animate={{ rotate, x: offsetX, y: offsetY }}
            transition={{ duration: dur, ease: "easeOut" }}
            className="absolute inset-0"
            style={{ zIndex: i }}
          >
            <div className="bg-white p-3 pb-8 shadow-md w-full h-full flex flex-col">
              <div className="flex-1 overflow-hidden bg-neutral-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.style.display = "none";
                    const parent = img.parentElement;
                    if (parent) parent.style.backgroundColor = "#d4c9b0";
                  }}
                />
              </div>
              <p className="font-handwriting mt-1 text-center text-neutral-600 absolute bottom-2 left-0 right-0 px-2 truncate text-base">
                {photo.caption}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
