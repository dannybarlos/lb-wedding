/**
 * Runtime feature flags — driven by environment variables.
 *
 * Client-visible flags use NEXT_PUBLIC_ so Next.js inlines them at build time
 * for client components. Changing a flag requires a redeploy for static pages.
 *
 * Defaults: all flags are ON when the env var is absent.
 * To disable: set the env var to the string "false".
 *
 * Example .env.local:
 *   NEXT_PUBLIC_RSVP_OPEN=false
 *   RSVP_BACKEND_DRIVER=supabase
 */

export const FLAGS = {
  // ─── Client-accessible (NEXT_PUBLIC_) ────────────────────
  rsvpOpen:         process.env.NEXT_PUBLIC_RSVP_OPEN          !== "false",
  registryVisible:  process.env.NEXT_PUBLIC_REGISTRY_VISIBLE   !== "false",
  travelVisible:    process.env.NEXT_PUBLIC_TRAVEL_VISIBLE      !== "false",
  loveStoryVisible: process.env.NEXT_PUBLIC_LOVE_STORY_VISIBLE  !== "false",
  countdownEnabled:  process.env.NEXT_PUBLIC_COUNTDOWN_ENABLED   !== "false",
  countdownConfetti: process.env.NEXT_PUBLIC_COUNTDOWN_CONFETTI  !== "false",

  // Server-only flags live in src/config/flags.server.ts (imports "server-only").
};
