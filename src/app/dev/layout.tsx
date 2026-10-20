import { notFound } from "next/navigation";

/**
 * /dev is the component showcase. The proxy lets it through without login
 * in development only; this makes sure it doesn't exist at all in
 * production, even if the proxy rule changes.
 */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV !== "development") notFound();
  return <div className="relative z-10 mx-auto max-w-6xl p-4 sm:p-8">{children}</div>;
}
