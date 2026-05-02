import { SERVER_FLAGS } from "@/config/flags.server";
import type { RSVPFormData } from "@/lib/rsvpSchema";

export type { RSVPFormData };

export async function submitRSVP(data: RSVPFormData): Promise<void> {
  const driver = SERVER_FLAGS.backendDriver;

  if (driver === "mock") {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("[mock RSVP]", data);
    return;
  }

  if (driver === "supabase") {
    // To enable: npm install @supabase/supabase-js, then replace this stub
    // with: const { createClient } = await import("@supabase/supabase-js");
    // Env vars required: SUPABASE_URL, SUPABASE_ANON_KEY
    throw new Error(
      "Supabase driver is not installed. Run: npm install @supabase/supabase-js"
    );
  }

  if (driver === "airtable") {
    // Env vars: AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME
    const res = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: data }),
      }
    );
    if (!res.ok) throw new Error(`Airtable error: ${res.status}`);
    return;
  }

  if (driver === "google_sheets") {
    // Env var: GOOGLE_SHEETS_WEBHOOK_URL
    const res = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Google Sheets error: ${res.status}`);
    return;
  }

  throw new Error(`Unknown RSVP driver: ${driver}`);
}
