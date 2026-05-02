"use client";

import { useRef } from "react";
import { SITE_CONFIG } from "@/config/site.config";
import { FLAGS } from "@/config/flags";
import { useCountdown } from "@/hooks/useCountdown";
import { useConfetti } from "@/hooks/useConfetti";
import CountdownUnit from "@/components/ui/CountdownUnit";

export default function DateCountdown() {
  if (!FLAGS.countdownEnabled) return null;
  return <DateCountdownInner displayDate={SITE_CONFIG.wedding.displayDate} />;
}

function DateCountdownInner({ displayDate }: { displayDate: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { days, hours, minutes, seconds, isExpired } = useCountdown();
  useConfetti(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 text-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <p className="font-serif italic text-lg mb-2 text-neutral-600">
        so please join us...
      </p>
      <h2 className="font-serif text-5xl md:text-7xl font-bold mb-12">
        {displayDate}
      </h2>

      {isExpired ? (
        <p className="font-serif text-3xl md:text-4xl italic">
          Today is the day! 🎉
        </p>
      ) : (
        <div className="flex items-start justify-center gap-4 md:gap-8">
          <CountdownUnit value={days}    label="Days"    />
          <Separator />
          <CountdownUnit value={hours}   label="Hours"   />
          <Separator />
          <CountdownUnit value={minutes} label="Minutes" />
          <Separator />
          <CountdownUnit value={seconds} label="Seconds" />
        </div>
      )}
    </section>
  );
}

function Separator() {
  return (
    <span
      className="font-serif text-5xl md:text-6xl font-bold pb-4 text-neutral-400"
      aria-hidden
    >
      :
    </span>
  );
}
