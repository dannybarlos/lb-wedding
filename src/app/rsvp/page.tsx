"use client";

import { useState } from "react";
import { SITE_CONFIG } from "@/config/site.config";
import { FLAGS } from "@/config/flags";
import { RSVPSchema, validateField } from "@/lib/rsvpSchema";
import type { RSVPFormData } from "@/lib/rsvpSchema";

export const dynamic = "force-static";

type FormState = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<Record<keyof RSVPFormData, string>>;

const EMPTY: RSVPFormData = {
  fullName:     "",
  email:        "",
  attending:    "yes",
  guestCount:   1,
  mealChoice:   SITE_CONFIG.rsvp.mealOptions[0],
  dietaryNotes: "",
  songRequest:  "",
};

export default function RSVPPage() {
  const { rsvp } = SITE_CONFIG;
  const [form, setForm]           = useState<RSVPFormData>(EMPTY);
  const [errors, setErrors]       = useState<FieldErrors>({});
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg]   = useState("");

  const set = <K extends keyof RSVPFormData>(key: K, value: RSVPFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleBlur = (field: keyof RSVPFormData) => {
    const msg = validateField(field, form);
    setErrors((prev) => {
      if (!msg) { const n = { ...prev }; delete n[field]; return n; }
      return { ...prev, [field]: msg };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = RSVPSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof RSVPFormData;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setFormState("loading");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (res.status === 423) { setFormState("error"); setErrorMsg("RSVP is now closed."); return; }
      if (res.status === 429) { setFormState("error"); setErrorMsg("Too many attempts. Please try again later."); return; }
      if (!res.ok) throw new Error("server error");
      setFormState("success");
    } catch {
      setFormState("error");
      setErrorMsg(rsvp.errorMessage);
    }
  };

  if (!FLAGS.rsvpOpen && formState === "idle") {
    return (
      <main className="min-h-screen pt-28 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="font-serif text-4xl font-bold mb-4">RSVP is now closed</h1>
        <p className="text-neutral-500">
          The deadline was {rsvp.deadline}. Please contact us directly if you have questions.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 max-w-xl mx-auto">
      <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 text-center">
        {rsvp.heading}
      </h1>
      <p className="text-center text-neutral-500 mb-10">
        Please respond by {rsvp.deadline}
      </p>

      {formState === "success" ? (
        <div className="font-serif text-center text-2xl py-16">{rsvp.successMessage}</div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          {formState === "error" && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {errorMsg || rsvp.errorMessage}
            </div>
          )}

          <Field label="Full Name *">
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              disabled={formState === "loading"}
              className={inputCls(!!errors.fullName)}
              placeholder="Jane Smith"
            />
            {errors.fullName && <FieldError msg={errors.fullName} />}
          </Field>

          <Field label="Email *">
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              disabled={formState === "loading"}
              className={inputCls(!!errors.email)}
              placeholder="you@example.com"
            />
            {errors.email && <FieldError msg={errors.email} />}
          </Field>

          <Field label="Will you be attending?">
            <div className="flex gap-6">
              {(["yes", "no"] as const).map((val) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="attending"
                    value={val}
                    checked={form.attending === val}
                    onChange={() => set("attending", val)}
                    disabled={formState === "loading"}
                    className="accent-black"
                  />
                  <span>{val === "yes" ? "Joyfully accepts" : "Regretfully declines"}</span>
                </label>
              ))}
            </div>
          </Field>

          {form.attending === "yes" && (
            <>
              <Field label="Number of guests (including yourself)">
                <select
                  value={form.guestCount}
                  onChange={(e) => set("guestCount", Number(e.target.value))}
                  disabled={formState === "loading"}
                  className={inputCls(false)}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </Field>

              <Field label="Meal preference">
                <select
                  value={form.mealChoice}
                  onChange={(e) => set("mealChoice", e.target.value)}
                  disabled={formState === "loading"}
                  className={inputCls(false)}
                >
                  {rsvp.mealOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </Field>
            </>
          )}

          <Field label="Dietary notes (optional)">
            <textarea
              value={form.dietaryNotes}
              onChange={(e) => set("dietaryNotes", e.target.value)}
              disabled={formState === "loading"}
              className={`${inputCls(false)} resize-none`}
              rows={2}
              placeholder="Allergies, dietary restrictions…"
            />
          </Field>

          <Field label="Song request (optional — guaranteed to be played 🎶)">
            <input
              type="text"
              value={form.songRequest}
              onChange={(e) => set("songRequest", e.target.value)}
              disabled={formState === "loading"}
              className={inputCls(false)}
              placeholder="Dancing Queen, ABBA"
            />
          </Field>

          <button
            type="submit"
            disabled={formState === "loading"}
            className="mt-2 px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {formState === "loading" ? <><Spinner /> Sending…</> : rsvp.submitLabel}
          </button>
        </form>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      {children}
    </div>
  );
}

function FieldError({ msg }: { msg: string }) {
  return <p className="text-xs text-red-600 mt-0.5">{msg}</p>;
}

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
    "focus:ring-2 focus:ring-black/20",
    hasError ? "border-red-400 bg-red-50" : "border-neutral-300 bg-white",
  ].join(" ");
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
