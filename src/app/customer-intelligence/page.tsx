import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, Users, Sparkles } from "lucide-react";
import { pageMeta } from "@/lib/pages";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarList, Figure } from "@/components/charts";
import { dist, ml } from "@/lib/artifacts";
import { formatNumber } from "@/lib/utils";

const meta = pageMeta["/customer-intelligence"];
export const metadata: Metadata = { title: meta.title, description: meta.description };

function barItems(rows: { label: string; count: number }[]) {
  const max = Math.max(...rows.map((r) => r.count));
  return rows.map((r) => ({ label: r.label, value: formatNumber(r.count), fraction: r.count / max }));
}

export default function Page() {
  const ageRows = [...dist.ageGroup].sort((a, b) => b.count - a.count);
  const ageTop = ageRows[0];
  const ageBottom = ageRows[ageRows.length - 1];
  const ageSpread = ((ageTop.count - ageBottom.count) / ageBottom.count) * 100;

  const propensity = ml.targets.map((t) => ({
    label: t.label,
    value: `${(t.positiveRate * 100).toFixed(1)}%`,
    fraction: t.positiveRate,
    highlight: t.positiveRate > 0.6 || t.positiveRate < 0.4,
  }));

  const purchase = [...dist.categorical["Purchase History"]].sort((a, b) => b.count - a.count);
  const timing = [...dist.categorical["Time Period Highest Purchase"]].sort((a, b) => b.count - a.count);
  const reviews = [...dist.sentiment["Customer Reviews"]].sort((a, b) => b.count - a.count);

  return (
    <>
      <PageHeader eyebrow={meta.eyebrow} title={meta.title} description={meta.description}>
        <Badge variant="warning" className="gap-2">
          <Info className="size-3.5" />
          Simulated dataset — figures demonstrate methodology, not real market data
        </Badge>
      </PageHeader>

      {/* Age — the one real signal */}
      <Section className="pt-0">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <SectionHeading
            eyebrow="Demographics"
            title="Where the data actually varies: age"
            lead={`Age group is the one dimension with genuine structure. ${ageTop.label} lead the catalogue — ${ageSpread.toFixed(0)}% more shoppers than ${ageBottom.label} — the only demographic skew worth planning around.`}
          />
          <Reveal delay={0.05}>
            <Figure title="Shoppers by age group" caption="Record count across the four generational bands" aside={<Users className="size-5 text-steel-400" />}>
              <BarList labelWidth="7.5rem" items={barItems(ageRows)} accent="bg-steel-500" />
            </Figure>
          </Reveal>
        </div>
      </Section>

      {/* Behavioural propensities */}
      <Section className="py-8">
        <SectionHeading
          eyebrow="Behavioural targets"
          title="How common is each behaviour?"
          lead="The positive rate of the four modelling targets. Satisfaction and interest split almost exactly in half, while category purchase and holiday shopping are heavily imbalanced — which is precisely why raw accuracy flatters those two."
        />
        <Reveal delay={0.05}>
          <Card className="mt-8 p-6 md:p-8">
            <BarList labelWidth="11rem" items={propensity} />
            <p className="mt-6 text-xs text-ink-400">
              Highlighted bars mark imbalanced targets, where a majority-class baseline already scores high without any real skill.
            </p>
          </Card>
        </Reveal>
      </Section>

      {/* Purchase behaviour + timing */}
      <Section className="py-8">
        <SectionHeading
          eyebrow="Purchase behaviour"
          title="Engagement and timing"
          lead="Purchase-history tiers and the time period of peak buying. Both are near-uniform — an even scaffold rather than a behavioural signal."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Reveal>
            <Figure title="Purchase-history tier" caption="Ten engagement levels">
              <BarList labelWidth="7.5rem" items={barItems(purchase)} accent="bg-steel-400" />
            </Figure>
          </Reveal>
          <Reveal delay={0.05}>
            <Figure title="Peak purchase window" caption="When buying concentrates">
              <BarList labelWidth="7.5rem" items={barItems(timing)} accent="bg-steel-400" />
            </Figure>
          </Reveal>
        </div>
      </Section>

      {/* Sentiment */}
      <Section className="py-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <SectionHeading
            eyebrow="Sentiment"
            title="Reading the review labels honestly"
            lead="The review, comment and feedback columns are categorical labels — not free text — so their even spread is a property of the simulation, not a measured mood. RetailIQ maps the labels rather than inventing sentiment scores."
          />
          <Reveal delay={0.05}>
            <Figure title="Customer review sentiment" caption="Distribution of review labels" aside={<Sparkles className="size-5 text-steel-400" />}>
              <BarList labelWidth="6rem" items={barItems(reviews)} accent="bg-steel-400" />
            </Figure>
          </Reveal>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-12">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-ink-200/70 bg-ink-50 p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h3 className="text-xl font-semibold text-ink-900">Turn behaviour into prediction</h3>
              <p className="mt-2 text-ink-600">Try the live model, or read how every classifier was evaluated.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/predictions">
                <Button variant="brand">AI predictions <ArrowRight className="size-4" /></Button>
              </Link>
              <Link href="/machine-learning">
                <Button variant="secondary">Machine learning</Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
