import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-steel-500",
        className,
      )}
      aria-label="RetailIQ home"
    >
      <span className="relative grid size-8 place-items-center rounded-[0.6rem] bg-gradient-to-br from-steel-500 to-steel-700 shadow-soft">
        <svg
          viewBox="0 0 24 24"
          className="size-4.5 text-white"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 18V9m5 9V5m5 13v-6m5 6V8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-[1.05rem] font-semibold tracking-tight text-ink-900">
        Retail<span className="text-steel-600">IQ</span>
      </span>
    </Link>
  );
}
