import "server-only";

/**
 * Server-only feature flags — never exposed to the client bundle.
 * Only import this from API routes, Route Handlers, or Server Components.
 */
export const SERVER_FLAGS = {
  backendDriver: (process.env.RSVP_BACKEND_DRIVER ?? "mock") as
    "mock" | "supabase" | "airtable" | "google_sheets",
};
