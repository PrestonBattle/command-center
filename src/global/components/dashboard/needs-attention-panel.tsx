import Link from "next/link";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconCheck,
  IconReceiptTax,
} from "@tabler/icons-react";
import { Panel } from "../panel/panel";
import { AttentionItem, getAttention, getTaxStatus, money } from "@/app/data";


const SEVERITY = {
  good: { bar: "bg-positive", icon: "text-positive" },
  caution: { bar: "bg-caution", icon: "text-caution" },
  urgent: { bar: "bg-negative", icon: "text-negative" },
} as const;

/** Four rows: tax, then the three most urgent of everything else. */
const VISIBLE_OTHERS = 3;

export function NeedsAttentionPanel({ style }: { style?: React.CSSProperties }) {
  const tax = getTaxStatus();
  const others = getAttention();

  // Tax is pinned, permanently, in green or otherwise. A warning that only
  // shows up when things are bad teaches people to skim the panel when
  // things are fine -- which is exactly when the reserve quietly stops
  // happening.
  const taxRow: AttentionItem = tax.shortfall <= 0
    ? {
        id: "tax",
        severity: "good",
        title: `${money(tax.needed)} set aside for taxes`,
        detail: "Fully funded this month",
      }
    : {
        id: "tax",
        severity: tax.covered === 0 ? "urgent" : "caution",
        title: `${money(tax.shortfall)} short on your tax reserve`,
        detail:
          tax.covered === 0
            ? "Nothing is going aside this month"
            : `${money(tax.covered)} of ${money(tax.needed)} covered`,
      };

  const rank = { urgent: 0, caution: 1, good: 2 };
  const ranked = [...others].sort(
    (a, b) => rank[a.severity] - rank[b.severity]
  );
  const shown = ranked.slice(0, VISIBLE_OTHERS);
  const hidden = ranked.length - shown.length;

  return (
    <Panel plain style={style} className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-subtle">
          Needs attention
        </p>
        {hidden > 0 && (
          <Link
            href="/attention"
            className="flex items-center gap-1 text-xs text-ink-muted
                       transition-colors hover:text-ink"
          >
            {hidden} more
            <IconArrowRight size={13} stroke={1.6} />
          </Link>
        )}
      </div>

      <ul className="flex flex-col">
        <Row item={taxRow} isTax />
        {shown.map((item) => (
          <Row key={item.id} item={item} />
        ))}
      </ul>
    </Panel>
  );
}

function Row({ item, isTax = false }: { item: AttentionItem; isTax?: boolean }) {
  const tone = SEVERITY[item.severity];
  const Icon = isTax
    ? item.severity === "good"
      ? IconCheck
      : IconReceiptTax
    : IconAlertTriangle;

  const body = (
    <div className="flex gap-3 py-2.5">
      {/* A hairline rather than a filled badge -- four colored chips in a
          column would shout, which is the thing this panel shouldn't do. */}
      <span className={`mt-1 h-4 w-0.5 shrink-0 rounded-full ${tone.bar}`} />
      <Icon size={16} stroke={1.6} className={`mt-0.5 shrink-0 ${tone.icon}`} />
      <div className="min-w-0">
        <p className="text-sm text-ink">{item.title}</p>
        {item.detail && (
          <p className="mt-0.5 text-xs text-ink-subtle">{item.detail}</p>
        )}
      </div>
    </div>
  );

  return (
    <li className="border-b border-paper-edge last:border-0">
      {item.href ? (
        <Link
          href={item.href}
          className="-mx-2 block rounded-lg px-2 transition-colors hover:bg-paper-dim"
        >
          {body}
        </Link>
      ) : (
        body
      )}
    </li>
  );
}