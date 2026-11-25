/*
 * The shape of one log line, built the same way on the server and for
 * errors the browser reports. Pure, so it can be tested and so the browser
 * and server can't disagree about the fields.
 */

/** How bad it is. "error" is something that broke for someone. */
export type LogLevel = "error" | "warn" | "info";

/** Extra facts about where it happened: a path, an id, a digest. Never passwords or tokens. */
export type LogContext = Record<string, string | number | boolean | null | undefined>;

/** One structured log line. */
export type LogEntry = {
  level: LogLevel;
  time: string;
  /** Where in the app: "clients:update", "request", "client:section". */
  label: string;
  message: string;
  name?: string;
  stack?: string;
  /** Next's id for a server error, shown to the person as "Reference". */
  digest?: string;
} & LogContext;

/** Long stacks and messages are cut, so one runaway error can't flood the logs. */
export const MAX_MESSAGE = 1_000;
export const MAX_STACK = 4_000;

/** Cuts text to a length, marking that it was cut. */
export function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

/** Turns anything thrown (an Error, a string, an object) into a log entry. */
export function toLogEntry(level: LogLevel, label: string, error: unknown, context: LogContext = {}, now = new Date()): LogEntry {
  const err = error instanceof Error ? error : null;
  const digest = err && "digest" in err && typeof err.digest === "string" ? err.digest : undefined;
  const message = err ? err.message : typeof error === "string" ? error : safeStringify(error);
  return {
    ...context,
    level,
    time: now.toISOString(),
    label,
    message: clip(message, MAX_MESSAGE),
    ...(err && { name: err.name }),
    ...(err?.stack && { stack: clip(err.stack, MAX_STACK) }),
    ...(digest && { digest }),
  };
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}
