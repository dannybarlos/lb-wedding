import { NextRequest, NextResponse } from "next/server";
import { FLAGS } from "@/config/flags";
import { RSVPSchema } from "@/lib/rsvpSchema";
import { submitRSVP } from "@/lib/rsvp";

// Force Node.js runtime so the module-level Map persists across requests
// within the same serverless instance.
export const runtime = "nodejs";

/**
 * Simple in-memory rate limiter: 3 submissions per IP per hour.
 *
 * PER-INSTANCE WARNING: This Map lives in Node.js module memory. Each
 * serverless instance has its own copy, so a user could bypass the limit
 * by hitting different instances. Acceptable for a low-traffic wedding site.
 * For multi-instance / multi-region production, replace with Vercel KV:
 * https://vercel.com/docs/storage/vercel-kv
 */
const RATE_LIMIT = { max: 3, windowMs: 60 * 60 * 1000 };
const ipHits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Prune expired entries to prevent unbounded memory growth.
  for (const [key, rec] of ipHits) {
    if (now > rec.resetAt) ipHits.delete(key);
  }

  const record = ipHits.get(ip);
  if (!record || now > record.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return false;
  }
  if (record.count >= RATE_LIMIT.max) return true;
  record.count++;
  return false;
}

export async function POST(req: NextRequest) {
  if (!FLAGS.rsvpOpen) {
    return NextResponse.json({ error: "RSVP is closed" }, { status: 423 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RSVPSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await submitRSVP(parsed.data);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
