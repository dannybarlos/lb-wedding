import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useRef } from "react";

// ─── Module mocks ─────────────────────────────────────────────────────────────

const mockFlags = vi.hoisted(() => ({ countdownConfetti: true }));
vi.mock("@/config/flags", () => ({ FLAGS: mockFlags }));

vi.mock("@/config/site.config", () => ({
  SITE_CONFIG: {
    confetti: {
      particleCount: 60,
      spread: 120,
      origin: { x: 0.5, y: 0.4 },
      colors: ["#c9a96e"],
      scalar: 0.9,
      ticks: 180,
      gravity: 0.6,
      drift: 0.1,
      shapes: ["circle"],
      fireOnce: true,
    },
    animations: {
      durations: { fast: 0.15, normal: 0.4, slow: 0.7 },
      easings: { enter: [0, 0, 0, 0], exit: [0, 0, 0, 0] },
      enabled: false,
      reducedMotion: "always",
    },
    wedding: { date: "2030-01-01T00:00:00" },
    rsvp: { mealOptions: [] },
  },
}));

// Track whether confetti() was called
const mockConfetti = vi.fn();
vi.mock("canvas-confetti", () => ({ default: mockConfetti }));

// Control useInView return value
const mockIsInView = vi.hoisted(() => ({ value: false }));
vi.mock("framer-motion", () => ({
  useInView: () => mockIsInView.value,
  useReducedMotion: () => true,
}));

import { useConfetti } from "@/hooks/useConfetti";

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useConfetti", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFlags.countdownConfetti = true;
    mockIsInView.value = false;
  });

  it("does not fire when element is not in view", () => {
    mockIsInView.value = false;
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useConfetti(ref);
    });
    expect(mockConfetti).not.toHaveBeenCalled();
  });

  it("does not fire when countdownConfetti flag is false", () => {
    mockFlags.countdownConfetti = false;
    mockIsInView.value = true;
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useConfetti(ref);
    });
    expect(mockConfetti).not.toHaveBeenCalled();
  });

  it("fires confetti when element enters view with flag enabled", async () => {
    mockIsInView.value = true;
    renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useConfetti(ref);
    });
    await waitFor(() => expect(mockConfetti).toHaveBeenCalledTimes(1));
  });

  it("does not fire a second time after fireOnce is set", async () => {
    mockIsInView.value = true;
    const { rerender } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      useConfetti(ref);
    });
    await waitFor(() => expect(mockConfetti).toHaveBeenCalledTimes(1));
    rerender();
    // Ensure no second call after fireOnce guard
    await new Promise((r) => setTimeout(r, 50));
    expect(mockConfetti).toHaveBeenCalledTimes(1);
  });
});
