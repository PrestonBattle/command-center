import { z } from "zod";
import { intervalMonths, optionalEmail, positiveMoney, requiredText } from "./fields";

/**
 * A client with one recurring service: the shape of an onboarding row, a
 * CSV row and the "Add client" form.
 */
export const clientRowSchema = z.object({
  name: requiredText(120),
  email: optionalEmail,
  /** One payment, in cents. */
  amount: positiveMoney,
  /** 1 = monthly, 3 = quarterly, 12 = yearly. */
  interval_months: intervalMonths,
});

export type ClientRowInput = z.input<typeof clientRowSchema>;
export type ClientRowValues = z.output<typeof clientRowSchema>;

/** Form values for one client row, as the inputs hold them. */
export type ClientRowFormValues = {
  name: string;
  email: string;
  amount: number | string;
  interval_months: string;
};

/** An empty row for "Add another client". */
export const EMPTY_CLIENT_ROW: ClientRowFormValues = {
  name: "",
  email: "",
  amount: "",
  interval_months: "1",
};
