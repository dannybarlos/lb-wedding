"use client";

import { AnimatePresence, motion } from "framer-motion";

interface CountdownUnitProps {
  value: number;
  label: string;
}

export default function CountdownUnit({ value, label }: CountdownUnitProps) {
  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-2 min-w-[64px]">
      <div className="relative overflow-hidden h-16 md:h-20 flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="font-serif text-5xl md:text-6xl font-bold tabular-nums leading-none"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs tracking-widest text-neutral-500 uppercase">
        {label}
      </span>
    </div>
  );
}
