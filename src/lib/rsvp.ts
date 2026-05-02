import { FLAGS } from "@/config/flags";
import type { RSVPFormData } from "@/lib/rsvpSchema";

export type { RSVPFormData };

export async function submitRSVP(data: RSVPFormData): Promise<void> {
  const driver = FLAGS.backendDriver;

  if (driver === "mock") {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("[mock RSVP]", data);
    return;
  }

  if (driver === "supabase") {
    // Requires: npm install @supabase/supabase-js
    // Env vars: SUPABASE_URL, SUPABASE_ANON_KEY
    // Dynamic import via Function() to keep supabase out of the static bundle.
    // eslint-disable-next-line no-new-func
    const { createClient } = await new Function("pkg", "return import(pkg)")("@supabase/supabase-js");
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const { error } = await supabase.from("rsvps").insert([data]);
    if (error) throw new Error(error.message);
    return;
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
