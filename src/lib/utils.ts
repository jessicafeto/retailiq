import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number with locale grouping (e.g. 1,000,000). */
export function formatNumber(value: number, opts?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-GB", opts).format(value);
}

/** Format a 0–1 or 0–100 value as a percentage string. */
export function formatPercent(value: number, fractionDigits = 1) {
  const pct = value <= 1 ? value * 100 : value;
  return `${pct.toFixed(fractionDigits)}%`;
}
