import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Boxes, Tag, Star, PoundSterling, Layers,
  ShieldCheck, ScanSearch, Users, Info,
} from "lucide-react";
import { pageMeta } from "@/lib/pages";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { overview, products } from "@/lib/artifacts";
import { formatNumber } from "@/lib/utils";

const meta = pageMeta["/dashboard"];
export const metadata: Metadata = { title: meta.title, description: meta.description };

const num = overview.numeric;

const kpis = [
  {
    icon: Boxes,
    label: "Catalogue records",
    value: formatNumber(overview.generatedRows),
    sub: `${overview.columns} attributes each`,
  },
  {
    icon: Tag,
    label: "Brands",
    value: String(overview.cardinality.brands),
    sub: `${overview.cardinality.categories} categories · ${overview.cardinality.styles} styles`,
  },
  {
    icon: PoundSterling,
    label: "Average price",
    value: `£${num.Price.mean.toFixed(2)}`,
    sub: `£${num.Price.min.toFixed(0)}–£${num.Price.max.toFixed(0)} range`,
  },
  {
    icon: Star,
    label: "Average rating",
    value: `${num.Rating.mean.toFixed(1)} / 5`,
    sub: `${formatNumber(Math.round(num["Review Count"].mean))} reviews avg`,
  },
  {
    icon: Users,
    label: "Median shopper age",
    value: `${num.Age.median.toFixed(0)} yrs`,
    sub: `${num.Age.min.toFixed(0)}–${num.Age.max.toFixed(0)} spread`,
  },
  {
    icon: ShieldCheck,
    label: "Data completeness",
    value: overview.missingValues === 0 ? "100%" : `${overview.missingValues} gaps`,
    sub: "no missing values",
  },
];

const distSnapshot = [
  { label: "Price", unit: "£", ...num.Price },
  { label: "Rating", unit: "", ...num.Rating },
  { label: "Review count", unit: "", ...num["Review Count"] },
  { label: "Age", unit: "", ...num.Age },
];

function StatTile({
  icon: Icon, label, value, sub,
}: { icon: typeof Boxes; label: string; value: string; sub: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-ink-400">{label}</span>
        <span className="grid size-9 place-items-center rounded-lg bg-steel-50 text-steel-600">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tabular-nums text-ink-900">{value}</p>
      <p className="mt-1 text-sm text-ink-500">{sub}</p>
    </Card>
  );
}

function MixBars({
  title, rows, max,
}: {
  title: string;
  rows: { label: string; count: number; avgRating: number; share: number }[];
  max: number;
}) {
  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
        <span className="text-xs uppercase tracking-wider text-ink-400">Share of catalogue</span>
      </div>
      <ul className="mt-6 flex flex-col gap-4">
        {rows.map((r) => (
          <li key={r.label} className="grid grid-cols-[7.5rem_1fr_auto] items-center gap-4">
            <span className="truncate text-sm font-medium text-ink-700">{r.label}</span>
            <span className="relative h-2.5 overflow-hidden rounded-full bg-ink-100">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-steel-400"
                style={{ width: `${(r.count / max) * 100}%` }}
              />
            </span>
            <span className="w-24 text-right text-sm tabular-nums text-ink-500">
              {r.share.toFixed(1)}% · ★{r.avgRating.toFixed(1)}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function Page() {
  const total = products.byBrand.reduce((s, b) => s + b.count, 0);
  const withShare = (list: typeof products.byBrand) =>
    [...list]
      .sort((a, b) => b.count - a.count)
      .map((r) => ({ label: r.label, count: r.count, avgRating: r.avgRating, share: (r.count / total) * 100 }));

  const brands = withShare(products.byBrand);
  const categories = withShare(products.byCategory);
  const brandMax = Math.max(...brands.map((b) => b.count));
  const catMax = Math.max(...categories.map((c) => c.count));
  const shareSpread =
    Math.max(...categories.map((c) => c.share)) - Math.min(...categories.map((c) => c.share));

  return (
    <>
      <PageHeader eyebrow={meta.eyebrow} title={meta.title} description={meta.description}>
        <Badge variant="warning" className="gap-2">
          <Info className="size-3.5" />
          Simulated dataset — figures demonstrate methodology, not real market data
        </Badge>
      </PageHeader>

      {/* KPI grid */}
      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.04}>
              <StatTile {...k} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Portfolio health — honest framing */}
      <Section className="py-8">
        <Reveal>
          <Card className="flex flex-col gap-6 border-steel-200/70 bg-steel-50/50 p-8 md:flex-row md:items-center md:p-10">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-surface text-steel-600 shadow-ring">
              <Layers className="size-6" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-ink-900">Portfolio health: balanced by design</h2>
              <p className="mt-2 max-w-3xl leading-relaxed text-ink-600">
                Because this is a simulated catalogue, brands, categories and styles are
                near-uniformly represented — the widest gap between any two categories is
                just <strong className="font-semibold text-ink-800">{shareSpread.toFixed(1)} percentage points</strong>.
                Headline aggregates therefore sit flat around the mean (price ≈ £{num.Price.mean.toFixed(0)},
                rating ≈ {num.Rating.mean.toFixed(1)}). The value here is the {" "}
                <em>method</em>, not a market signal — an honesty that carries through every page.
              </p>
            </div>
          </Card>
        </Reveal>
      </Section>

      {/* Mix bars */}
      <Section className="py-8">
        <SectionHeading
          eyebrow="Catalogue mix"
          title="How the portfolio breaks down"
          lead="Record share across the eight brands and ten categories, with average customer rating alongside each."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Reveal>
            <MixBars title="By brand" rows={brands} max={brandMax} />
          </Reveal>
          <Reveal delay={0.05}>
            <MixBars title="By category" rows={categories} max={catMax} />
          </Reveal>
        </div>
      </Section>

      {/* Distribution snapshot */}
      <Section className="py-8">
        <SectionHeading
          eyebrow="Distribution snapshot"
          title="The numeric backbone"
          lead="Median with the full observed range for each numeric attribute — the shape every model works from."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {distSnapshot.map((d, i) => {
            const pct = ((d.median - d.min) / (d.max - d.min)) * 100;
            return (
              <Reveal key={d.label} delay={i * 0.04}>
                <Card className="p-6">
                  <p className="text-xs uppercase tracking-wider text-ink-400">{d.label}</p>
                  <p className="mt-3 text-2xl font-semibold tabular-nums text-ink-900">
                    {d.unit}{d.median.toFixed(d.label === "Rating" ? 1 : 0)}
                    <span className="ml-1.5 text-sm font-normal text-ink-400">median</span>
                  </p>
                  <div className="relative mt-4 h-1.5 rounded-full bg-ink-100">
                    <span
                      className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-steel-500"
                      style={{ left: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs tabular-nums text-ink-400">
                    <span>{d.unit}{d.min.toFixed(0)}</span>
                    <span>{d.unit}{d.max.toFixed(0)}</span>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Deep-dive CTA */}
      <Section className="py-12">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/product-analytics" className="group">
              <Card className="flex h-full items-start gap-4 p-8 transition-colors group-hover:border-steel-300">
                <span className="grid size-11 place-items-center rounded-xl bg-steel-50 text-steel-600">
                  <ScanSearch className="size-5" />
                </span>
                <div>
                  <h3 className="flex items-center gap-1.5 text-lg font-semibold text-ink-900">
                    Product analytics <ArrowRight className="size-4 text-ink-400 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                    Price, rating and review distributions, plus the price–rating crosstab across the full catalogue.
                  </p>
                </div>
              </Card>
            </Link>
            <Link href="/customer-intelligence" className="group">
              <Card className="flex h-full items-start gap-4 p-8 transition-colors group-hover:border-steel-300">
                <span className="grid size-11 place-items-center rounded-xl bg-steel-50 text-steel-600">
                  <Users className="size-5" />
                </span>
                <div>
                  <h3 className="flex items-center gap-1.5 text-lg font-semibold text-ink-900">
                    Customer intelligence <ArrowRight className="size-4 text-ink-400 transition-transform group-hover:translate-x-0.5" />
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                    Age, satisfaction and sentiment breakdowns — who the shoppers are and how they respond.
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
