import type { ClientRow } from "@/global/types/supabase/types";

type Props = { client: Pick<ClientRow, "website" | "notes"> };

/** The client's website and notes under the header. Renders nothing when both are blank. */
export function ClientAbout({ client }: Props) {
  if (!client.website && !client.notes) return null;
  // Only http(s) links: a value saved some other way (an import, the API)
  // could be "javascript:…", which must never become an href.
  const href = client.website && /^https?:\/\//i.test(client.website) ? client.website : `https://${client.website}`;
  return (
    <div className="flex flex-col gap-1">
      {client.website && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start text-[var(--text-muted)] underline-offset-2 hover:underline focus-visible:underline"
        >
          {client.website.replace(/^https?:\/\//i, "")}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
      {client.notes && <p className="max-w-prose whitespace-pre-line text-[var(--text-muted)]">{client.notes}</p>}
    </div>
  );
}
