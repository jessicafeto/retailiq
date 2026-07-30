"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { navGroups, aboutItem } from "@/lib/nav";
import { Logo } from "@/components/site/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-ink-200/70 bg-paper/80 backdrop-blur-xl"
          : "border-b border-transparent bg-paper/0",
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navGroups.map((group) => (
            <div key={group.label} className="group relative">
              <button
                className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900 group-focus-within:text-ink-900"
                aria-haspopup="true"
              >
                {group.label}
                <ChevronDown className="size-3.5 text-ink-400 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
              </button>

              <div className="invisible absolute left-1/2 top-full w-[20rem] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="overflow-hidden rounded-2xl border border-ink-200/80 bg-surface p-2 shadow-lift">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-start gap-3 rounded-xl p-3 transition-colors",
                          active ? "bg-steel-50" : "hover:bg-ink-50",
                        )}
                      >
                        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-steel-50 text-steel-600">
                          <Icon className="size-4.5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-ink-900">
                            {item.label}
                          </span>
                          <span className="block text-xs leading-snug text-ink-500">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          <Link
            href={aboutItem.href}
            className={cn(
              "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
              pathname === aboutItem.href
                ? "text-ink-900"
                : "text-ink-600 hover:text-ink-900",
            )}
          >
            {aboutItem.label}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="hidden sm:block">
            <Button size="sm" variant="brand">
              Open Dashboard
            </Button>
          </Link>

          {/* Mobile toggle */}
          <button
            className="grid size-10 place-items-center rounded-full text-ink-700 hover:bg-ink-100 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink-200/70 bg-paper/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-page flex flex-col gap-6 py-6">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-ink-400">
                    {group.label}
                  </p>
                  <div className="flex flex-col">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 rounded-xl px-1 py-2.5 text-sm font-medium text-ink-800 hover:text-steel-600"
                        >
                          <Icon className="size-4.5 text-steel-500" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-3 border-t border-ink-200/70 pt-5">
                <Link href={aboutItem.href} className="px-1 text-sm font-medium text-ink-800">
                  {aboutItem.label}
                </Link>
                <Link href="/dashboard">
                  <Button variant="brand" className="w-full">
                    Open Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
