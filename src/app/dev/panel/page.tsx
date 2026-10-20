import { GlassPanel } from "@/global/components/glass/glass-panel";

/* ---------- sample data (no database on /dev) ---------- */

const STATS = [
  { label: "This month vs floor", value: "$5,250", sub: "$650 above your $4,600 floor" },
  { label: "Collected so far", value: "$3,500", sub: "of $5,250 expected" },
  { label: "Overdue", value: "$1,500", sub: "Maple Physio · 6 days" },
];

const PAYMENTS = [
  { client: "Harbor Dental", due: "Oct 1", amount: "$2,500", status: "Paid" },
  { client: "Maple Physio", due: "Sep 28", amount: "$1,500", status: "Overdue" },
  { client: "Ridgeline Law", due: "Oct 15", amount: "$3,750", status: "Expected" },
];

const STATUS_STYLE: Record<string, string> = {
  Paid: "bg-[#047857]/10 text-[#047857]",
  Overdue: "bg-[#b91c1c]/10 text-[#b91c1c]",
  Expected: "bg-white/50 text-[var(--text-muted)]",
};

/* ---------- page ---------- */

export default function GlassShowcasePage() {
  return (
    <div className="flex flex-col gap-8 p-2">
      <header>
        <h1 className="font-display text-4xl font-bold">Glass panel</h1>
        <p className="text-[var(--text-muted)]">Every variant, with sample data.</p>
      </header>

      {/* 1. Padding sizes */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--text-muted)]">Padding</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <GlassPanel padding="sm">padding=&quot;sm&quot;</GlassPanel>
          <GlassPanel padding="md">padding=&quot;md&quot; (default)</GlassPanel>
          <GlassPanel padding="lg">padding=&quot;lg&quot;</GlassPanel>
        </div>
      </section>

      {/* 2. Stat tiles: no header, just content */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--text-muted)]">Stat tiles</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {STATS.map((s) => (
            <GlassPanel key={s.label}>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-[var(--text-muted)]">{s.label}</span>
                <span className="font-display text-4xl font-bold">{s.value}</span>
                <span className="text-sm text-[var(--text-faint)]">{s.sub}</span>
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* 3. Header with title, description and an actions slot */}
      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <GlassPanel
          title="Payments this month"
          description="What's in, what's late, what's coming."
          actions={
            <button
              type="button"
              className="h-10 rounded-xl bg-[var(--accent)] px-4 text-sm font-bold text-white"
            >
              + One-off payment
            </button>
          }
        >
          <ul className="flex flex-col">
            {PAYMENTS.map((p) => (
              <li
                key={p.client}
                className="flex items-center gap-4 border-t border-black/10 py-3"
              >
                <span className="flex-1 font-semibold">{p.client}</span>
                <span className="w-16 text-sm text-[var(--text-faint)]">{p.due}</span>
                <span className="w-20 text-right font-semibold">{p.amount}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[p.status]}`}>
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </GlassPanel>

        {/* actions slot used for a value instead of a button */}
        <GlassPanel
          title="Your floor"
          actions={<span className="font-display text-2xl font-bold">$4,600</span>}
        >
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Personal</dt><dd>$2,700</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Taxes (28%)</dt><dd>$1,050</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--text-muted)]">Business</dt><dd>$850</dd></div>
          </dl>
          <p className="rounded-2xl bg-white/40 p-4 text-sm">
            That&apos;s about <strong>$151 a day</strong>, whether or not you work.
          </p>
        </GlassPanel>
      </section>

      {/* 4. Form preview: how onboarding steps will look */}
      <GlassPanel padding="lg" title="Form preview" description="Plain inputs for now. MoneyInput comes next.">
        <div className="grid gap-4 sm:grid-cols-3">
          {["Housing", "Food & groceries", "Transportation"].map((label) => (
            <label key={label} className="flex flex-col gap-1.5 text-sm font-semibold">
              {label}
              <input
                type="text"
                placeholder="$0"
                className="h-11 rounded-xl border border-black/10 bg-white/55 px-3 text-base font-normal"
              />
            </label>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}