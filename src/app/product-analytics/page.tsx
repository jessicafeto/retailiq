import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, TrendingUp } from "lucide-react";
import { pageMeta } from "@/lib/pages";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarList, Histogram, Heatmap, Figure } from "@/components/charts";
import { dist, products } from "@/lib/artifacts";
import { formatNumber } from "@/lib/utils";

const meta = pageMeta["/product-analytics"];
export const metadata: Metadata = { title: meta.title, description: meta.description };

const histograms = [
  { key: "Price", title: "Price", caption: "Selling price across the catalogue", x: ["£10", "£100"] as [string, string] },
  { key: "Rating", title: "Customer rating", caption: "Mean star rating, 1–5", x: ["1★", "5★"] as [string, string] },
  { key: "Review Count", title: "Review volume", caption: "Reviews recorded per product", x: ["0", "499"] as [string, string] },
  { key: "Age", title: "Shopper age", caption: "Age of the associated customer", x: ["18", "64"] as [string, string] },
];

export default function Page() {
  const ct = products.priceRatingCrosstab;
  // Leaderboard: categories ranked by average rating (spread is tiny — shown honestly).
  const leaderboard = [...products.byCategory].sort((a, b) => b.avgRating - a.avgRating);
  const catMax = Math.max(...products.byCategory.map((c) => c.count));

  return (
    <>
      <PageHeader eyebrow={meta.eyebrow} title={meta.title} description={meta.description}>
        <Badge variant="warning" className="gap-2">
          <Info className="size-3.5" />
          Simulated dataset — figures demonstrate methodology, not real market data
        </Badge>
      </PageHeader>

      {/* Distribution explorers */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Distribution explorers"
          title="How the four numeric attributes are shaped"
          lead="Each histogram bins the full 1,000,000-row catalogue. The near-flat profiles are the signature of a simulated, uniformly generated dataset."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {histograms.map((h, i) => (
            <Reveal key={h.key} delay={i * 0.05}>
              <Figure title={h.title} caption={h.caption}>
                <Histogram bins={dist.numeric[h.key].bins} xLabels={h.x} />
              </Figure>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Price × rating crosstab */}
      <Section className="py-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <SectionHeading
            eyebrow="Price × rating"
            title="Do pricier products earn better ratings?"
            lead="A cross-tab of price band against rating band, counted across the catalogue. If price drove satisfaction, the diagonal would dominate — instead the cells are strikingly even, the honest read of independent, simulated variables."
          />
          <Reveal delay={0.05}>
            <Card className="p-6 md:p-7">
              <Heatmap
                rowLabels={ct.bands}
                colLabels={ct.ratings.map((r) => `${r}★`)}
                matrix={ct.matrix}
                format={(v) => `${(v * 100).toFixed(1)}%`}
              />
              <p className="mt-5 text-xs text-ink-400">Each row sums to 100% — the rating mix within a price band.</p>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Segment leaderboard */}
      <Section className="py-8">
        <SectionHeading
          eyebrow="Segment performance"
          title="Categories, ranked"
          lead="Ordered by average rating. The differences are fractions of a star — a reminder that ranking on noise invites false confidence."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <div className="overflow-x-auto rounded-2xl border border-ink-200/80 bg-surface shadow-card">
              <table className="w-full min-w-[34rem] text-sm">
                <thead>
                  <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wider text-ink-400">
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 text-right font-medium">Products</th>
                    <th className="p-4 text-right font-medium">Avg price</th>
                    <th className="p-4 text-right font-medium">Avg rating</th>
                    <th className="p-4 text-right font-medium">Avg reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((c) => (
                    <tr key={c.label} className="border-b border-ink-100 last:border-0">
                      <td className="p-4 font-medium text-ink-800">{c.label}</td>
                      <td className="p-4 text-right tabular-nums text-ink-500">{formatNumber(c.count)}</td>
                      <td className="p-4 text-right tabular-nums text-ink-600">£{c.avgPrice.toFixed(2)}</td>
                      <td className="p-4 text-right tabular-nums text-ink-800">{c.avgRating.toFixed(3)}</td>
                      <td className="p-4 text-right tabular-nums text-ink-500">{Math.round(c.avgReviews)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <Figure
              title="Category share"
              caption="Record count by category"
              aside={<TrendingUp className="size-5 text-steel-400" />}
            >
              <BarList
                labelWidth="6.5rem"
                items={leaderboard.map((c) => ({
                  label: c.label,
                  value: formatNumber(c.count),
                  fraction: c.count / catMax,
                }))}
              />
            </Figure>
          </Reveal>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-12">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-ink-200/70 bg-ink-50 p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h3 className="text-xl font-semibold text-ink-900">From products to people</h3>
              <p className="mt-2 text-ink-600">See who the shoppers are, or which items are bought together.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/customer-intelligence">
                <Button variant="brand">Customer intelligence <ArrowRight className="size-4" /></Button>
              </Link>
              <Link href="/market-basket">
                <Button variant="secondary">Market basket</Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
