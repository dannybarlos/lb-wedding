import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";

// Helpers to manipulate window.scrollY (read-only by default)
function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", { value, writable: true, configurable: true });
}

function fireScroll() {
  window.dispatchEvent(new Event("scroll"));
}

describe("useScrollNavbar", () => {
  beforeEach(() => {
    setScrollY(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts as false when scrollY is 0", () => {
    const { result } = renderHook(() => useScrollNavbar());
    expect(result.current.scrolled).toBe(false);
  });

  it("returns false at 79px (below threshold)", () => {
    setScrollY(79);
    const { result } = renderHook(() => useScrollNavbar());
    act(() => fireScroll());
    expect(result.current.scrolled).toBe(false);
  });

  it("returns false at exactly 80px (threshold is strictly greater)", () => {
    setScrollY(80);
    const { result } = renderHook(() => useScrollNavbar());
    act(() => fireScroll());
    expect(result.current.scrolled).toBe(false);
  });

  it("returns true at 81px (above threshold)", () => {
    setScrollY(81);
    const { result } = renderHook(() => useScrollNavbar());
    act(() => fireScroll());
    expect(result.current.scrolled).toBe(true);
  });

  it("toggles back to false when scrolled back up", () => {
    setScrollY(200);
    const { result } = renderHook(() => useScrollNavbar());
    act(() => fireScroll());
    expect(result.current.scrolled).toBe(true);

    setScrollY(0);
    act(() => fireScroll());
    expect(result.current.scrolled).toBe(false);
  });

  it("respects a custom threshold", () => {
    setScrollY(150);
    const { result } = renderHook(() => useScrollNavbar(200));
    act(() => fireScroll());
    expect(result.current.scrolled).toBe(false);

    setScrollY(201);
    act(() => fireScroll());
    expect(result.current.scrolled).toBe(true);
  });

  it("removes the scroll listener on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScrollNavbar());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
