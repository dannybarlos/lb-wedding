import { z } from "zod";
import { SITE_CONFIG } from "@/config/site.config";

const mealOptions = SITE_CONFIG.rsvp.mealOptions as readonly string[];

export const RSVPSchema = z.object({
  fullName:     z.string().trim().min(2, "Name must be at least 2 characters"),
  email:        z.string().email("Invalid email address"),
  attending:    z.enum(["yes", "no"]),
  guestCount:   z.number().int().min(1, "At least 1 guest required").max(5, "Maximum 5 guests"),
  mealChoice:   z.string().refine(
    (val) => val === "" || mealOptions.includes(val),
    `Meal must be one of: ${mealOptions.join(", ")}`
  ),
  dietaryNotes: z.string(),
  songRequest:  z.string(),
});

export type RSVPFormData = z.infer<typeof RSVPSchema>;

/** Partial validation for client-side field-level feedback */
export function validateField(
  field: keyof RSVPFormData,
  data: RSVPFormData
): string | undefined {
  const result = RSVPSchema.safeParse(data);
  if (result.success) return undefined;
  const issue = result.error.issues.find((i) => i.path[0] === field);
  return issue?.message;
}
