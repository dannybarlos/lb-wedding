import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { TEST_ANIMATIONS, TEST_RSVP, TEST_WEDDING } from "../fixtures/site-config.mock";

// ─── Module mocks ─────────────────────────────────────────────────────────────

vi.mock("@/config/flags", () => ({
  FLAGS: {
    rsvpOpen: true,
  },
}));

vi.mock("@/config/flags.server", () => ({
  SERVER_FLAGS: {
    backendDriver: "mock",
  },
}));

vi.mock("@/config/site.config", () => ({
  SITE_CONFIG: {
    rsvp: TEST_RSVP,
    animations: TEST_ANIMATIONS,
    wedding: TEST_WEDDING,
  },
}));

vi.mock("@/lib/rsvp", () => ({
  submitRSVP: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "@/app/api/rsvp/route";
import { FLAGS } from "@/config/flags";
import { submitRSVP } from "@/lib/rsvp";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VALID_BODY = {
  fullName:     "Jane Smith",
  email:        "jane@example.com",
  attending:    "yes",
  guestCount:   2,
  mealChoice:   "Chicken",
  dietaryNotes: "",
  songRequest:  "Dancing Queen",
};

function makeRequest(body: unknown, ip = "1.2.3.4") {
  return new NextRequest("http://localhost/api/rsvp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

// Reset rate-limiter state between tests by re-importing the module
beforeEach(async () => {
  vi.resetModules();
  vi.mocked(submitRSVP).mockResolvedValue(undefined);
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("POST /api/rsvp", () => {
  it("returns 200 for a valid submission", async () => {
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it("calls submitRSVP with the parsed data", async () => {
    await POST(makeRequest(VALID_BODY));
    expect(submitRSVP).toHaveBeenCalledWith(expect.objectContaining({
      fullName: "Jane Smith",
      email:    "jane@example.com",
    }));
  });

  it("returns 423 when rsvpOpen is false", async () => {
    vi.mocked(FLAGS).rsvpOpen = false;
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(423);
    const json = await res.json();
    expect(json.error).toMatch(/closed/i);
    // restore
    vi.mocked(FLAGS).rsvpOpen = true;
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new NextRequest("http://localhost/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "9.9.9.9" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(makeRequest({ fullName: "Jo" }, "2.2.2.2")); // missing email, etc.
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/validation/i);
  });

  it("returns 400 when email is invalid", async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, email: "not-an-email" }, "3.3.3.3"));
    expect(res.status).toBe(400);
  });

  it("returns 400 when guestCount is out of range", async () => {
    const res = await POST(makeRequest({ ...VALID_BODY, guestCount: 10 }, "4.4.4.4"));
    expect(res.status).toBe(400);
  });

  it("returns 500 when submitRSVP throws", async () => {
    vi.mocked(submitRSVP).mockRejectedValueOnce(new Error("DB down"));
    const res = await POST(makeRequest(VALID_BODY, "5.5.5.5"));
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("DB down");
  });

  it("returns 429 after exceeding the rate limit from the same IP", async () => {
    // 3 allowed per hour; 4th should be rate-limited
    const ip = "6.6.6.6";
    await POST(makeRequest(VALID_BODY, ip));
    await POST(makeRequest(VALID_BODY, ip));
    await POST(makeRequest(VALID_BODY, ip));
    const res = await POST(makeRequest(VALID_BODY, ip));
    expect(res.status).toBe(429);
  });
});
