import { defineConfig } from "vitest/config";
import path from "node:path";

/** Unit tests for pure helpers (money, dates, billing). No DOM, no database. */
export default defineConfig({
  test: { include: ["src/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
