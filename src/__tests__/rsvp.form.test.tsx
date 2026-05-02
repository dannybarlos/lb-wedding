import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/config/site.config", () => ({
  SITE_CONFIG: {
    rsvp: {
      heading: "will you join us?",
      deadline: "June 1, 2027",
      mealOptions: ["Chicken", "Fish", "Vegetarian"],
      submitLabel: "Send RSVP",
      successMessage: "We can't wait to celebrate with you! 🎉",
      errorMessage: "Something went wrong. Please try again or email us directly.",
    },
    animations: { durations: { fast: 0.15, normal: 0.4, slow: 0.7 }, easings: { enter: [0,0,0,0], exit: [0,0,0,0] }, enabled: false, reducedMotion: "always" },
    wedding: { date: "2030-01-01T00:00:00" },
    couple: { monogram: "L & B", name1: "Laurice", name2: "Bernie", hashtag: "" },
  },
}));

// vi.hoisted ensures this runs before vi.mock hoisting, making it available inside the factory
const mockFlags = vi.hoisted(() => ({ rsvpOpen: true, backendDriver: "mock" as const }));
vi.mock("@/config/flags", () => ({ FLAGS: mockFlags }));

// Stub framer-motion to avoid animation complexity in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) =>
      <div {...rest}>{children}</div>,
    p:   ({ children, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) =>
      <p {...rest}>{children}</p>,
    h1:  ({ children, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) =>
      <h1 {...rest}>{children}</h1>,
  },
  useReducedMotion: () => true,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import RSVPPage from "@/app/rsvp/page";

// ─── fetch mock ─────────────────────────────────────────────────────────────────────────────────

function mockFetch(status: number, body: object) {
  global.fetch = vi.fn().mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status })
  );
}

// ─── Tests ──────────────────────────────────────────────────────────────────────────────────

describe("RSVPPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the heading and deadline", () => {
    render(<RSVPPage />);
    expect(screen.getByText("will you join us?")).toBeInTheDocument();
    expect(screen.getByText(/June 1, 2027/)).toBeInTheDocument();
  });

  it("shows validation error for empty name on blur", async () => {
    const user = userEvent.setup();
    render(<RSVPPage />);
    const nameInput = screen.getByPlaceholderText("Jane Smith");
    await user.click(nameInput);
    await user.tab();
    expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument();
  });

  it("shows validation error for invalid email on blur", async () => {
    const user = userEvent.setup();
    render(<RSVPPage />);
    const emailInput = screen.getByPlaceholderText("you@example.com");
    await user.type(emailInput, "not-an-email");
    await user.tab();
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it("shows validation errors on submit with empty form", async () => {
    const user = userEvent.setup();
    render(<RSVPPage />);
    await user.click(screen.getByRole("button", { name: /send rsvp/i }));
    expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument();
  });

  it("hides guestCount and mealChoice when attending=no", async () => {
    const user = userEvent.setup();
    render(<RSVPPage />);
    await user.click(screen.getByLabelText(/regretfully declines/i));
    expect(screen.queryByText(/number of guests/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/meal preference/i)).not.toBeInTheDocument();
  });

  it("shows guestCount and mealChoice when attending=yes (default)", () => {
    render(<RSVPPage />);
    expect(screen.getByText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByText(/meal preference/i)).toBeInTheDocument();
  });

  it("shows success message after successful submission", async () => {
    mockFetch(200, { success: true });
    const user = userEvent.setup();
    render(<RSVPPage />);

    await user.type(screen.getByPlaceholderText("Jane Smith"), "Jane Smith");
    await user.type(screen.getByPlaceholderText("you@example.com"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /send rsvp/i }));

    await waitFor(() => {
      expect(screen.getByText(/can't wait to celebrate/i)).toBeInTheDocument();
    });
  });

  it("shows error banner on API 500", async () => {
    mockFetch(500, { error: "Server error" });
    const user = userEvent.setup();
    render(<RSVPPage />);

    await user.type(screen.getByPlaceholderText("Jane Smith"), "Jane Smith");
    await user.type(screen.getByPlaceholderText("you@example.com"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /send rsvp/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it("shows 'RSVP is now closed' message when rsvpOpen=false", () => {
    mockFlags.rsvpOpen = false;
    render(<RSVPPage />);
    expect(screen.getByText(/rsvp is now closed/i)).toBeInTheDocument();
    mockFlags.rsvpOpen = true; // restore for subsequent tests
  });

  it("shows '429 rate limit' error message on 429 response", async () => {
    mockFetch(429, { error: "Too many requests" });
    const user = userEvent.setup();
    render(<RSVPPage />);

    await user.type(screen.getByPlaceholderText("Jane Smith"), "Jane Smith");
    await user.type(screen.getByPlaceholderText("you@example.com"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: /send rsvp/i }));

    await waitFor(() => {
      expect(screen.getByText(/too many attempts/i)).toBeInTheDocument();
    });
  });

  it("song request field is optional (form submits without it)", async () => {
    mockFetch(200, { success: true });
    const user = userEvent.setup();
    render(<RSVPPage />);

    await user.type(screen.getByPlaceholderText("Jane Smith"), "Jane Smith");
    await user.type(screen.getByPlaceholderText("you@example.com"), "jane@example.com");
    // deliberately leave song request blank
    await user.click(screen.getByRole("button", { name: /send rsvp/i }));

    await waitFor(() => {
      expect(screen.getByText(/can't wait to celebrate/i)).toBeInTheDocument();
    });
  });
});
