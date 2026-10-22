import type { NextConfig } from "next";

/**
 * Sent with every response. Each one closes a door the app never uses:
 * - no other site may show the app in a frame (stops clickjacking: a hidden
 *   frame tricking someone into clicking "Delete" or "Mark paid"). The CSP
 *   line is the modern rule; X-Frame-Options covers older browsers.
 * - browsers must not guess file types (a text upload can't run as script)
 * - other sites see only our domain in the referrer, never a path like
 *   /clients/<id>
 * - camera, mic, location and ad-topic tracking are off
 *
 * A full Content-Security-Policy (which scripts and styles may run) is R14;
 * it needs care around Mantine's inline styles. HSTS is set by the host,
 * which knows whether the domain is HTTPS-only.
 */
const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Don't announce the framework (and so its version's known holes).
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
