import { getArriving, money } from "@/app/data";
import { Panel } from "../panel/panel";


const ordinal = (d: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = d % 100;
  return d + (s[(v - 20) % 10] || s[v] || s[0]);
};

/**
 * Cash-flow timing, which the waterline can't show. Clearing the month
 * means nothing if everything lands on the 28th and rent is due on the 1st.
 */
export function MoneyArrivingPanel({ style }: { style?: React.CSSProperties }) {
  const items = getArriving();
  const total = items.reduce((sum, i) => sum + i.amount, 0);
  const today = new Date().getDate();

  return (
    <Panel plain style={style} className="flex flex-col">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-subtle">
          Money arriving
        </p>
        <p className="text-sm tabular-nums text-ink-muted">{money(total)}</p>
      </div>

      {items.length === 0 ? (
        <p className="py-4 text-sm text-ink-subtle">
          No billing dates recorded yet.
        </p>
      ) : (
        <ul className="flex flex-col">
          {items.map((item) => {
            const passed = item.day < today;
            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 border-b
                           border-paper-edge py-2.5 last:border-0"
              >
                {/* Dimmed once the date has passed -- the distinction that
                    matters is what's still coming, not what's on the list. */}
                <span
                  className={`truncate text-sm ${passed ? "text-ink-subtle" : "text-ink"}`}
                >
                  {item.client}
                </span>
                <span className="shrink-0 text-sm tabular-nums text-ink-muted">
                  {ordinal(item.day)} · {money(item.amount)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}