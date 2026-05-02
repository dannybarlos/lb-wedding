import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

// We need to control the target date independently of SITE_CONFIG,
// so we expose calcCountdown as a named export for testing.
// The hook itself is tested through a wrapper that accepts a target date.

vi.mock("@/config/site.config", () => ({
  SITE_CONFIG: {
    wedding: { date: "2030-01-01T00:00:00" },
    animations: { durations: { fast: 0.15, normal: 0.4, slow: 0.7 }, easings: { enter: [0, 0, 0, 0], exit: [0, 0, 0, 0] }, enabled: true, reducedMotion: "auto" },
    rsvp: { mealOptions: ["Chicken", "Fish", "Vegetarian"] },
  },
}));

// Import AFTER mocking so the module sees our date
import { useCountdown } from "@/hooks/useCountdown";

// Target: 2030-01-01T00:00:00 in local time
const TARGET_MS = new Date("2030-01-01T00:00:00").getTime();

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("computes correct days/hours/minutes/seconds", () => {
    // Set "now" to exactly 5 days + 3 hours + 7 minutes + 12 seconds before target
    const fiveD = 5 * 86400 + 3 * 3600 + 7 * 60 + 12;
    vi.setSystemTime(TARGET_MS - fiveD * 1000);

    const { result } = renderHook(() => useCountdown());

    expect(result.current.days).toBe(5);
    expect(result.current.hours).toBe(3);
    expect(result.current.minutes).toBe(7);
    expect(result.current.seconds).toBe(12);
    expect(result.current.isExpired).toBe(false);
  });

  it("returns isExpired=false when exactly 1 second remains", () => {
    vi.setSystemTime(TARGET_MS - 1000);
    const { result } = renderHook(() => useCountdown());
    expect(result.current.isExpired).toBe(false);
    expect(result.current.seconds).toBe(1);
  });

  it("returns isExpired=true when target is in the past", () => {
    vi.setSystemTime(TARGET_MS + 1000);
    const { result } = renderHook(() => useCountdown());
    expect(result.current.isExpired).toBe(true);
    expect(result.current.days).toBe(0);
  });

  it("returns isExpired=true and all zeros when target is now", () => {
    vi.setSystemTime(TARGET_MS);
    const { result } = renderHook(() => useCountdown());
    expect(result.current.isExpired).toBe(true);
    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(0);
  });

  it("ticks every second", () => {
    vi.setSystemTime(TARGET_MS - 5000);
    const { result } = renderHook(() => useCountdown());

    expect(result.current.seconds).toBe(5);

    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current.seconds).toBe(4);

    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current.seconds).toBe(3);
  });

  it("clears the interval on unmount (no memory leak)", () => {
    const clearSpy = vi.spyOn(globalThis, "clearInterval");
    vi.setSystemTime(TARGET_MS - 10000);

    const { unmount } = renderHook(() => useCountdown());
    unmount();

    expect(clearSpy).toHaveBeenCalledTimes(1);
    clearSpy.mockRestore();
  });
});
