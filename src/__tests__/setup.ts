import "@testing-library/jest-dom";
import { vi } from "vitest";

// server-only throws in non-server environments; stub it for all tests.
vi.mock("server-only", () => ({}));

// next/font/google returns CSS variable names; stub it so components import cleanly.
vi.mock("next/font/google", () => ({
  Playfair_Display: () => ({ variable: "--font-serif", className: "playfair" }),
  Caveat:           () => ({ variable: "--font-handwriting", className: "caveat" }),
}));

// next/navigation stubs
vi.mock("next/navigation", () => ({
  redirect:    vi.fn(),
  useRouter:   () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/",
}));

// Silence Next.js Image console warnings in tests
vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return Object.assign(document.createElement("img"), props);
  },
}));
