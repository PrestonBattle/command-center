"use client";

import Link from "next/link";
import type { Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import type { ClientRow } from "@/global/types/supabase/types";
import { Panel } from "@/global/components/panel/panel";

type ClientsGridProps = {
  filtered: Signal<ClientRow[]>;
  isEmpty: Signal<boolean>;
  searchQuery: Signal<string>;
  /** False when the org has no clients at all — a different empty state
      from "your search matched nothing". */
  hasAny: boolean;
};

export function ClientsTable({
  filtered,
  isEmpty,
  searchQuery,
  hasAny,
}: ClientsGridProps) {
  useSignals();

  if (!hasAny) {
    return (
      <Panel plain>
        <p className="text-sm text-ink-muted">
          No clients yet. Add one and the dashboard can start telling you
          whether your revenue clears your floor.
        </p>
      </Panel>
    );
  }

  if (isEmpty.value) {
    return (
      <Panel plain>
        <p className="text-sm text-ink-muted">
          Nothing matches &ldquo;{searchQuery.value}&rdquo;.
        </p>
      </Panel>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {filtered.value.map((client) => (
        <li key={client.id}>
          <ClientCard client={client} />
        </li>
      ))}
    </ul>
  );
}

/*
 * "Stretched link" pattern: the card itself is NOT an <a>. The client name
 * is the real link, and its ::after pseudo-element stretches over the whole
 * card so clicking anywhere opens the client. The email/phone links sit
 * above that overlay (relative z-10), so they stay clickable on their own.
 * This avoids nesting <a> inside <a>, which is invalid HTML and breaks
 * hydration in Next.
 */
function ClientCard({ client }: { client: ClientRow }) {
  return (
    <Panel
      plain
      className="group relative flex h-full flex-col gap-4 transition-shadow
                 hover:shadow-md focus-within:shadow-md"
    >
      {/* Header: avatar + name */}
      <div className="flex items-center gap-3">
        <Avatar id={client.id} name={client.name} />
        <div className="min-w-0 flex-1">
          <Link
            href={`/clients/${client.id}`}
            className="block truncate text-base font-semibold text-ink
                       after:absolute after:inset-0 after:rounded-[inherit]
                       after:content-[''] focus-visible:outline-none
                       focus-visible:after:outline-2
                       focus-visible:after:outline-offset-2"
          >
            {client.name}
          </Link>
        </div>
        {/* TODO: status pill once `status` exists on clients */}
      </div>

      <div className="h-px bg-paper-edge" />

      {/* Body: key facts. Only fields that exist today are real. */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        

        <Fact label="Phone">
          {client.phone ? (
            <ContactLink href={`tel:${client.phone}`}>
              {formatPhone(client.phone)}
            </ContactLink>
          ) : (
            <span className="text-ink-subtle">—</span>
          )}
        </Fact>

        <Fact label="Email" className="col-span-2 min-w-0">
          {client.email ? (
            <ContactLink href={`mailto:${client.email}`}>
              {client.email}
            </ContactLink>
          ) : (
            <span className="text-ink-subtle">—</span>
          )}
        </Fact>

        <Fact label="Monthly">
          {/* TODO: sum of client_services once that table exists */}
          <span className="text-lg font-semibold tabular-nums">—</span>
        </Fact>

        {/* TODO: <Fact label="Services"> and <Fact label="Last contact"> */}
      </dl>

      {/* TODO: tag pills here (mt-auto keeps them pinned to the bottom) */}
    </Panel>
  );
}

/** Sits above the card's stretched link so it gets its own clicks. */
function ContactLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="relative z-10 block truncate text-ink underline-offset-2
                 hover:underline"
    >
      {children}
    </a>
  );
}

/** Display-only formatting. Store phones raw (ideally E.164, e.g.
    +19045551234) and format on the way out. */
function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  const local =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (local.length === 10) {
    return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
  }
  return raw;
}

function Fact({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <dt className="text-xs font-medium uppercase tracking-wider text-ink-subtle">
        {label}
      </dt>
      <dd className="text-sm text-ink">{children}</dd>
    </div>
  );
}

/* Deterministic color from the client id, so a client keeps the same
   avatar color across renders and sessions. Swap these for theme tokens. */
const AVATAR_COLORS = [
  "#3F3C8C",
  "#1F6F6B",
  "#7A3E8C",
  "#A04E1E",
  "#2E5E9E",
  "#5B6B3A",
];

function Avatar({ id, name }: { id: string; name: string }) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  const color = AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];

  return (
    <div
      aria-hidden
      className="flex size-11 shrink-0 items-center justify-center rounded-xl
                 text-sm font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {initials(name)}
    </div>
  );
}

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter((w) => w !== "&");
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase() || "?";
}