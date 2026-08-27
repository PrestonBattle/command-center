import { z } from "zod";

/**
 * Deliberately minimal -- NOT registrationSchema.
 *
 * Login checks that the fields are filled in; the server decides whether
 * they're correct. Reusing the registration schema would enforce min(8)
 * and the org/name fields here, locking out anyone whose password predates
 * that rule or who signed up before a field existed. Your own validation
 * shouldn't be able to lock out a valid account.
 *
 * No .email() either -- a malformed address is a failed login, not a
 * different outcome, and flagging the format tells an attacker which
 * inputs got as far as the auth call.
 */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "Enter your email."),
  password: z.string().min(1, "Enter your password."),
});

export type LoginInput = z.input<typeof loginSchema>;