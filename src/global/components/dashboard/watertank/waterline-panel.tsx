import { Panel } from "../../panel/panel";
import { WaterLineTank } from "./water-tank";

type WaterLinePanelProps = {
  /** Monthly personal expenses — rent, food, car, savings. */
  personal: number;
  /** Monthly business costs — software, contractors, ads. */
  business: number;
  /** Combined self-employment + income tax, as a percent. 28 not 0.28. */
  taxRate: number;
  /** Monthly recurring revenue, normalized. */
  revenue: number;

  style: React.CSSProperties;
};

export function WaterLinePanel({
  personal,
  business,
  taxRate,
  revenue,
  style,
}: WaterLinePanelProps) {

  const rate = taxRate / 100;
  const floor = business + personal / (1 - rate);

  const gap = floor - revenue;
  const coverage = floor > 0 ? revenue / floor : 0;
  const short = gap > 0;

  return (
    
      <Panel plain style={style} className="grid grid-cols-1 gap-7 sm:grid-cols-[130px_minmax(0,1fr)]">
        <WaterLineTank coverage={coverage} />

        <div className="flex flex-col justify-center">
          <p className="text-sm text-ink-muted">Floor · ${Math.round(floor).toLocaleString()}</p>
          <div className="mb-3.5 mt-1 border-b border-paper-edge" />

          <p className="text-3xl font-medium leading-tight text-ink">
            ${Math.round(Math.abs(gap)).toLocaleString()} {short ? "short" : "clear"}
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Revenue is ${revenue.toLocaleString()} — {Math.round(coverage * 100)}% of what you need.
          </p>
        </div>
      </Panel>

  );
}