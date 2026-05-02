/**
 * Shared SITE_CONFIG stub for Vitest tests.
 * Pure data — no project module imports — so it's safe to use inside vi.mock factories.
 */
export const TEST_ANIMATIONS = {
  durations: { fast: 0.15, normal: 0.4, slow: 0.7 },
  easings: { enter: [0, 0, 0, 0] as [number, number, number, number], exit: [0, 0, 0, 0] as [number, number, number, number] },
  enabled: false,
  reducedMotion: "always" as const,
};

export const TEST_RSVP = {
  heading: "will you join us?",
  deadline: "June 1, 2027",
  mealOptions: ["Chicken", "Fish", "Vegetarian"],
  submitLabel: "Send RSVP",
  successMessage: "We can't wait to celebrate with you! 🎉",
  errorMessage: "Something went wrong. Please try again or email us directly.",
};

export const TEST_COUPLE = {
  name1: "Laurice",
  name2: "Bernie",
  monogram: "L & B",
  hashtag: "",
};

export const TEST_WEDDING = {
  date: "2030-01-01T00:00:00",
};
