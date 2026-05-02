"use client";

import { useState, useEffect } from "react";
import { SITE_CONFIG } from "@/config/site.config";

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calcCountdown(target: Date): CountdownResult {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days:    Math.floor(totalSeconds / 86400),
    hours:   Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isExpired: false,
  };
}

export function useCountdown(): CountdownResult {
  const target = new Date(SITE_CONFIG.wedding.date);
  const [result, setResult] = useState<CountdownResult>(() => calcCountdown(target));

  useEffect(() => {
    const id = setInterval(() => setResult(calcCountdown(target)), 1000);
    return () => clearInterval(id);
    // target is derived from static config — no dep needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return result;
}
