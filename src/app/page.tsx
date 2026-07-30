import Link from "next/link";
import { ArrowRight, Sparkles, ArrowUpRight } from "lucide-react";
import { navGroups } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/reveal";

const stats = [
  { value: "1M", label: "Product records analysed" },
  { value: "20", label: "Attributes per record" },
  { value: "7", label: "ML models benchmarked" },
  { value: "4", label: "Prediction targets" },
];

export default function Home() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-aurora pointer-events-none absolute inset-0 -z-10" />
        <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />

        <div className="container-page pb-20 pt-20 md:pb-28 md:pt-28">
          <Reveal>
            <Link href="/research">
              <Badge variant="default" className="mb-6 py-1.5 pl-1.5 pr-3">
                <span className="grid size-5 place-items-center rounded-full bg-steel-600 text-white">
                  <Sparkles className="size-3" />
                </span>
                From MSc research to a working platform
              </Badge>
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="max-w-4xl text-[2.6rem] font-semibold leading-[1.04] tracking-tight text-ink-900 sm:text-6xl md:text-[4.2rem]">
              Turn fashion product data into{" "}
              <span className="font-display italic text-steel-600">
                strategic decisions
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600 md:text-xl">
              RetailIQ is an AI-powered retail intelligence platform that
              transforms raw product and customer data into executive dashboards,
              deep analytics, association rules and interactive predictions —
              grounded in rigorous data science.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/dashboard">
                <Button size="lg" variant="brand">
                  Open the dashboard
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/research">
                <Button size="lg" variant="secondary">
                  Explore the research
                </Button>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-16 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-8 border-t border-ink-200/70 pt-10 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-sm text-ink-500">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ Modules */}
      <section className="container-page py-8 md:py-14">
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow mb-3">The platform</p>
            <h2 className="text-3xl font-semibold tracking-tight text-ink-900 md:text-4xl">
              Ten connected surfaces, one source of truth
            </h2>
            <p className="mt-4 text-lg text-ink-600">
              Every module reads from the same analysed dataset — from the
              executive overview down to the individual association rule.
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col gap-12">
          {navGroups.map((group, gi) => (
            <div key={group.label}>
              <Reveal>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-400">
                  {group.label}
                </p>
              </Reveal>
              <div className="grid gap-4 md:grid-cols-3">
                {group.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Reveal key={item.href} delay={gi * 0.03 + i * 0.05}>
                      <Link href={item.href} className="group block h-full">
                        <div className="flex h-full flex-col rounded-2xl border border-ink-200/80 bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-steel-200 hover:shadow-lift">
                          <div className="flex items-center justify-between">
                            <span className="grid size-11 place-items-center rounded-xl bg-steel-50 text-steel-600 transition-colors group-hover:bg-steel-600 group-hover:text-white">
                              <Icon className="size-5" />
                            </span>
                            <ArrowUpRight className="size-5 text-ink-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-steel-600" />
                          </div>
                          <h3 className="mt-5 text-lg font-semibold text-ink-900">
                            {item.label}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-ink-500">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- Research band */}
      <section className="container-page py-14 md:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-ink-200/70 bg-ink-950 px-8 py-14 text-white md:px-16 md:py-20">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(60% 80% at 85% 20%, rgba(108,151,201,0.45), transparent 60%), radial-gradient(50% 60% at 0% 100%, rgba(53,96,143,0.5), transparent 60%)",
              }}
            />
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-steel-300">
                Grounded in real research
              </p>
              <p className="mt-5 text-2xl font-medium leading-snug text-white md:text-3xl">
                Originally developed as an MSc dissertation and expanded into an
                AI-powered retail intelligence platform — with the methodology,
                metrics and limitations shown openly.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/methodology">
                  <Button size="lg" variant="brand">
                    See the methodology
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/machine-learning">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/25 text-white hover:border-white/50 hover:bg-white/10"
                  >
                    Model results
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
