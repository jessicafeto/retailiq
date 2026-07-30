import Link from "next/link";
import { navGroups, aboutItem } from "@/lib/nav";
import { Logo } from "@/components/site/logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-200/70 bg-surface/60">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              AI-powered retail intelligence that turns fashion product data into
              strategic business decisions. Built on an MSc dissertation and
              expanded into a decision-support platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                  {group.label}
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-ink-600 transition-colors hover:text-steel-600"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  {group.label === "Research" && (
                    <li>
                      <Link
                        href={aboutItem.href}
                        className="text-sm text-ink-600 transition-colors hover:text-steel-600"
                      >
                        {aboutItem.label}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ink-200/70 pt-8 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RetailIQ. Research &amp; demonstration project.</p>
          <p className="max-w-md sm:text-right">
            Built on a simulated fashion retail dataset. Figures are for
            methodological demonstration, not real market data.
          </p>
        </div>
      </div>
    </footer>
  );
}
