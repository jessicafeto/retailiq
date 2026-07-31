/**
 * Presentational, dependency-free chart primitives (all server components).
 * Every figure is pure CSS/SVG so pages stay static and fast — no client
 * hydration, no charting library. Colours come from the design tokens.
 */
import { cn } from "@/lib/utils";

// ------------------------------------------------------------------ BarList
export interface BarItem {
  label: string;
  value: string;
  /** 0–1, drives bar width. */
  fraction: number;
  highlight?: boolean;
}

export function BarList({
  items,
  accent = "bg-steel-400",
  labelWidth = "8rem",
}: {
  items: BarItem[];
  accent?: string;
  labelWidth?: string;
}) {
  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((it) => (
        <li
          key={it.label}
          className="grid items-center gap-4"
          style={{ gridTemplateColumns: `${labelWidth} 1fr auto` }}
        >
          <span className="truncate text-sm font-medium text-ink-700">{it.label}</span>
          <span className="relative h-2.5 overflow-hidden rounded-full bg-ink-100">
            <span
              className={cn("absolute inset-y-0 left-0 rounded-full", it.highlight ? "bg-steel-600" : accent)}
              style={{ width: `${Math.max(it.fraction * 100, 1.5)}%` }}
            />
          </span>
          <span className="w-24 text-right text-sm tabular-nums text-ink-500">{it.value}</span>
        </li>
      ))}
    </ul>
  );
}

// ----------------------------------------------------------------- Histogram
export function Histogram({
  bins,
  height = 150,
  xLabels,
  accent = "bg-steel-300",
}: {
  bins: { center: number; count: number }[];
  height?: number;
  xLabels?: [string, string];
  accent?: string;
}) {
  const max = Math.max(...bins.map((b) => b.count)) || 1;
  return (
    <div>
      <div className="flex items-end gap-[2px]" style={{ height }}>
        {bins.map((b, i) => (
          <div
            key={i}
            className={cn("flex-1 rounded-t-[3px] transition-colors", accent)}
            style={{ height: `${Math.max((b.count / max) * 100, 2)}%` }}
          />
        ))}
      </div>
      {xLabels && (
        <div className="mt-2 flex justify-between text-xs tabular-nums text-ink-400">
          <span>{xLabels[0]}</span>
          <span>{xLabels[1]}</span>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------- Heatmap
export function Heatmap({
  rowLabels,
  colLabels,
  matrix,
  format = (v) => v.toFixed(2),
  emphasiseFrom,
}: {
  rowLabels: string[];
  colLabels: string[];
  matrix: (number | null)[][];
  format?: (v: number) => string;
  /** Values >= this (or the overall max) render with white text. */
  emphasiseFrom?: number;
}) {
  const flat = matrix.flat().filter((v): v is number => v !== null);
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const span = max - min || 1;
  const threshold = emphasiseFrom ?? min + span * 0.62;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 bg-surface" />
            {colLabels.map((c) => (
              <th key={c} className="px-1 pb-1 text-center font-medium text-ink-400">
                <span className="inline-block max-w-[4.5rem] truncate align-bottom">{c}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowLabels.map((r, ri) => (
            <tr key={r}>
              <th className="sticky left-0 bg-surface pr-2 text-right font-medium text-ink-500 whitespace-nowrap">
                {r}
              </th>
              {matrix[ri].map((v, ci) => {
                if (v === null) {
                  return (
                    <td key={ci} className="rounded-md bg-ink-50 p-2 text-center text-ink-300">
                      –
                    </td>
                  );
                }
                const t = (v - min) / span; // 0..1
                const alpha = 0.1 + t * 0.85;
                const white = v >= threshold;
                return (
                  <td
                    key={ci}
                    className={cn(
                      "rounded-md p-2 text-center tabular-nums",
                      white ? "text-white" : "text-ink-700",
                    )}
                    style={{ backgroundColor: `rgba(53, 96, 143, ${alpha.toFixed(3)})` }}
                  >
                    {format(v)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --------------------------------------------------------------------- Figure
/** Titled card wrapper for a chart with an optional caption. */
export function Figure({
  title,
  caption,
  aside,
  children,
  className,
}: {
  title: string;
  caption?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-ink-200/80 bg-surface p-6 shadow-card md:p-7", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-ink-900">{title}</h3>
          {caption && <p className="mt-1 text-sm text-ink-500">{caption}</p>}
        </div>
        {aside}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
