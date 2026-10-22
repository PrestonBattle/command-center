import { describe, expect, it } from "vitest";
import { OFFLINE_MESSAGE, safeAction, thrownActionMessage, UNREACHABLE_MESSAGE } from "./safe-action";

describe("safeAction", () => {
  it("passes a result through", async () => {
    expect(await safeAction(async () => ({ ok: true }))).toEqual({ ok: true });
    expect(await safeAction(async () => ({ ok: false, formError: "Nope" }))).toEqual({ ok: false, formError: "Nope" });
  });

  it("passes undefined through (the action redirected)", async () => {
    expect(await safeAction(async () => undefined)).toBeUndefined();
  });

  it("turns a thrown error into a failed result", async () => {
    const result = await safeAction(async () => {
      throw new Error("An unexpected response was received from the server.");
    });
    expect(result).toEqual({ ok: false, formError: UNREACHABLE_MESSAGE });
  });

  it("rethrows Next's redirect", async () => {
    const redirect = Object.assign(new Error("NEXT_REDIRECT"), { digest: "NEXT_REDIRECT;replace;/auth/login;307;" });
    await expect(
      safeAction(async () => {
        throw redirect;
      }),
    ).rejects.toBe(redirect);
  });
});

describe("thrownActionMessage", () => {
  it("says offline when offline", () => {
    expect(thrownActionMessage(false)).toBe(OFFLINE_MESSAGE);
    expect(thrownActionMessage(true)).toBe(UNREACHABLE_MESSAGE);
  });
});
