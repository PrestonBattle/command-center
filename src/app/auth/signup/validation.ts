import { z } from "zod";

/**
 * Registration input for the combined member + org signup.
 *
 * Member and org are created together for now. When invites land, this
 * splits into two schemas -- `memberSchema` (everything but orgName) and
 * `joinCodeSchema` -- sharing the field definitions below.
 */
export const registrationSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Email is required.")
      .max(254, "That email is too long.")
      .email("Enter a valid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      // bcrypt truncates at 72 BYTES. Without this cap, anything typed
      // past the limit is silently ignored -- so "hunter2...<73 chars>x"
      // and "...<73 chars>y" would both log in.
      .max(72, "Password must be 72 characters or fewer."),

    confirmPassword: z.string().min(1, "Confirm your password."),

    firstName: z
      .string()
      .trim()
      .min(1, "First name is required.")
      .max(50, "First name is too long."),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required.")
      .max(50, "Last name is too long."),

    phone: z
      .string()
      .trim()
      // Strip formatting so the DB stores digits only and duplicate
      // checks aren't defeated by "(904) 555-0100" vs "9045550100".
      .transform((v) => v.replace(/[^\d+]/g, ""))
      .pipe(
        z
          .string()
          .min(10, "Enter a valid phone number.")
          .max(16, "Enter a valid phone number.")
          .regex(/^\+?\d+$/, "Enter a valid phone number.")
      ),

    orgName: z
      .string()
      .trim()
      .min(1, "Business name is required.")
      .max(100, "Business name is too long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type MemberOrgRegistration = z.input<typeof registrationSchema>;
export type MemberOrgRegistrationParsed = z.output<typeof registrationSchema>;

/**
 * Flattens zod issues into `{ fieldName: "first message" }`.
 *
 * Safe to return to the client on SIGNUP -- every message describes input
 * the user just typed, so it leaks nothing. Do NOT do this on LOGIN, where
 * a specific error tells an attacker which emails are registered.
 */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}