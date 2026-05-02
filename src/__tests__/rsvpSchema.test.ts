import { describe, it, expect, vi } from "vitest";

vi.mock("@/config/site.config", () => ({
  SITE_CONFIG: {
    rsvp: { mealOptions: ["Chicken", "Fish", "Vegetarian"] },
    animations: { durations: { fast: 0.15, normal: 0.4, slow: 0.7 }, easings: { enter: [0,0,0,0], exit: [0,0,0,0] }, enabled: true, reducedMotion: "auto" },
    wedding: { date: "2030-01-01T00:00:00" },
  },
}));

import { RSVPSchema, validateField } from "@/lib/rsvpSchema";

const VALID: Parameters<typeof RSVPSchema.parse>[0] = {
  fullName:     "Jane Smith",
  email:        "jane@example.com",
  attending:    "yes",
  guestCount:   2,
  mealChoice:   "Chicken",
  dietaryNotes: "",
  songRequest:  "",
};

describe("RSVPSchema", () => {
  // ─── fullName ─────────────────────────────────────────────────────────

  it("accepts a valid full name", () => {
    expect(RSVPSchema.safeParse(VALID).success).toBe(true);
  });

  it("rejects empty fullName", () => {
    const r = RSVPSchema.safeParse({ ...VALID, fullName: "" });
    expect(r.success).toBe(false);
  });

  it("rejects single-character fullName", () => {
    const r = RSVPSchema.safeParse({ ...VALID, fullName: "A" });
    expect(r.success).toBe(false);
  });

  it("rejects whitespace-only fullName (trim check)", () => {
    const r = RSVPSchema.safeParse({ ...VALID, fullName: "  " });
    expect(r.success).toBe(false);
  });

  it("accepts a 2-character name after trimming", () => {
    const r = RSVPSchema.safeParse({ ...VALID, fullName: " Jo " });
    expect(r.success).toBe(true);
  });

  // ─── email ───────────────────────────────────────────────────────────

  it("rejects 'foo' as email", () => {
    expect(RSVPSchema.safeParse({ ...VALID, email: "foo" }).success).toBe(false);
  });

  it("rejects 'foo@' as email", () => {
    expect(RSVPSchema.safeParse({ ...VALID, email: "foo@" }).success).toBe(false);
  });

  it("rejects '@bar.com' as email", () => {
    expect(RSVPSchema.safeParse({ ...VALID, email: "@bar.com" }).success).toBe(false);
  });

  it("accepts 'foo+tag@bar.com'", () => {
    expect(RSVPSchema.safeParse({ ...VALID, email: "foo+tag@bar.com" }).success).toBe(true);
  });

  it("accepts 'foo@bar.co.uk'", () => {
    expect(RSVPSchema.safeParse({ ...VALID, email: "foo@bar.co.uk" }).success).toBe(true);
  });

  // ─── guestCount ────────────────────────────────────────────────────────────

  it("rejects guestCount=0", () => {
    expect(RSVPSchema.safeParse({ ...VALID, guestCount: 0 }).success).toBe(false);
  });

  it("rejects guestCount=6", () => {
    expect(RSVPSchema.safeParse({ ...VALID, guestCount: 6 }).success).toBe(false);
  });

  it("accepts guestCount=5", () => {
    expect(RSVPSchema.safeParse({ ...VALID, guestCount: 5 }).success).toBe(true);
  });

  // ─── mealChoice ────────────────────────────────────────────────────────────

  it("accepts a valid meal option", () => {
    expect(RSVPSchema.safeParse({ ...VALID, mealChoice: "Fish" }).success).toBe(true);
  });

  it("rejects an invalid meal option", () => {
    expect(RSVPSchema.safeParse({ ...VALID, mealChoice: "Steak" }).success).toBe(false);
  });

  it("accepts empty mealChoice (for attending=no case)", () => {
    expect(RSVPSchema.safeParse({ ...VALID, attending: "no", mealChoice: "" }).success).toBe(true);
  });

  // ─── optional fields ──────────────────────────────────────────────────────────────

  it("accepts empty songRequest", () => {
    expect(RSVPSchema.safeParse({ ...VALID, songRequest: "" }).success).toBe(true);
  });

  it("accepts empty dietaryNotes", () => {
    expect(RSVPSchema.safeParse({ ...VALID, dietaryNotes: "" }).success).toBe(true);
  });
});

describe("validateField", () => {
  it("returns undefined for a valid field", () => {
    expect(validateField("fullName", VALID as never)).toBeUndefined();
  });

  it("returns an error message for an invalid field", () => {
    const msg = validateField("fullName", { ...VALID, fullName: "" } as never);
    expect(msg).toMatch(/at least 2 characters/i);
  });

  it("returns email error for bad email", () => {
    const msg = validateField("email", { ...VALID, email: "bad" } as never);
    expect(msg).toMatch(/invalid email/i);
  });
});
