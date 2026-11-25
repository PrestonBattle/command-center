import type { Instrumentation } from "next";

/**
 * Next calls this for every error it catches on the server: a server
 * component that threw, a route handler, a server action that crashed. The
 * person sees the error page with a "Reference" digest; this writes the
 * full error under the same digest, so the two can be matched up.
 *
 * Imported lazily: this file loads in every runtime, and the logger is
 * server-only.
 */
export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const { logError } = await import("@/global/lib/log/log");
  logError("request", error, {
    method: request.method,
    // The path only: query strings can carry search text.
    path: request.path.split("?")[0],
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: "renderSource" in context ? context.renderSource : undefined,
  });
};
