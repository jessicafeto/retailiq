import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, Network } from "lucide-react";
import { pageMeta } from "@/lib/pages";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heatmap, Figure } from "@/components/charts";
import { basket } from "@/lib/artifacts";
import { formatNumber } from "@/lib/utils";

const meta = pageMeta["/market-basket"];
export const metadata: Metadata = { title: meta.title, description: meta.description };

const clean = (s: string) => s.replace(/^(Category|Style Attributes|Style)_/, "");

export default function Page() {
  const topRules = basket.rules.slice(0, 12);
  const maxLift = Math.max(...basket.rules.map((r) => r.lift));
  const hm = basket.heatmap;

  const kpis = [
    { label: "Rules mined", value: formatNumber(basket.ruleCount) },
    { label: "Min support", value: `${(basket.params.minSupport * 100).toFixed(0)}%` },
    { label: "Strongest lift", value: maxLift.toFixed(2) },
    { label: "Sample size", value: formatNumber(basket.params.sampleSize) },
  ];

  return (
    <>
      <PageHeader eyebrow={meta.eyebrow} title={meta.title} description={meta.description}>
        <Badge variant="warning" className="gap-2">
          <Info className="size-3.5" />
          Simulated dataset — figures demonstrate methodology, not real market data
        </Badge>
      </PageHeader>

      {/* KPI strip */}
      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.04}>
              <Card className="p-6">
                <p className="text-xs uppercase tracking-wider text-ink-400">{k.label}</p>
                <p className="mt-3 text-3xl font-semibold tabular-nums text-ink-900">{k.value}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Top rules */}
      <Section className="py-8">
        <SectionHeading
          eyebrow="Association rules"
          title="The strongest pairings the Apriori found"
          lead="Ranked by lift — the ratio of observed co-occurrence to what independence would predict. Every rule here sits within a whisker of 1.00, meaning the pairings are barely stronger than chance."
        />
        <Reveal delay={0.05}>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-ink-200/80 bg-surface shadow-card">
            <table className="w-full min-w-[40rem] text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wider text-ink-400">
                  <th className="p-4 font-medium">If a shopper buys</th>
                  <th className="p-4 font-medium">They also tend toward</th>
                  <th className="p-4 text-right font-medium">Support</th>
                  <th className="p-4 text-right font-medium">Confidence</th>
                  <th className="p-4 text-right font-medium">Lift</th>
                </tr>
              </thead>
              <tbody>
                {topRules.map((r, i) => (
                  <tr key={`${r.antecedent}-${r.consequent}-${i}`} className="border-b border-ink-100 last:border-0">
                    <td className="p-4 font-medium text-ink-800">{clean(r.antecedent)}</td>
                    <td className="p-4 text-ink-700">{clean(r.consequent)}</td>
                    <td className="p-4 text-right tabular-nums text-ink-500">{(r.support * 100).toFixed(2)}%</td>
                    <td className="p-4 text-right tabular-nums text-ink-500">{(r.confidence * 100).toFixed(1)}%</td>
                    <td className="p-4 text-right tabular-nums">
                      <Badge variant={r.lift >= 1.05 ? "success" : "neutral"}>{r.lift.toFixed(3)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      {/* Lift heatmap */}
      <Section className="py-8">
        <SectionHeading
          eyebrow="Category × style"
          title="A full lift matrix"
          lead="Lift between every category and every style. A genuine merchandising signal would light up hot cells; here the near-uniform blue confirms that categories and styles are chosen independently."
        />
        <Reveal delay={0.05}>
          <Figure
            title="Lift heatmap"
            caption="Lift > 1 (darker) means bought together more than chance predicts"
            aside={<Network className="size-5 text-steel-400" />}
            className="mt-8"
          >
            <Heatmap
              rowLabels={hm.categories}
              colLabels={hm.styles}
              matrix={hm.lift}
              format={(v) => v.toFixed(2)}
            />
          </Figure>
        </Reveal>
      </Section>

      {/* Honest takeaway */}
      <Section className="py-8">
        <Reveal>
          <Card className="border-steel-200/70 bg-steel-50/50 p-8 md:p-10">
            <h2 className="text-xl font-semibold text-ink-900">The merchandising read</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-ink-600">
              In a real catalogue, these rules would drive bundles, cross-sells and store layout.
              On this simulated data the honest recommendation is restraint: with every lift near
              1.0, any bundle built from these pairings would perform no better than a random one.
              The technique is sound and production-ready — it is simply reporting, correctly, that
              there is no basket structure to exploit.
            </p>
          </Card>
        </Reveal>
      </Section>

      {/* CTA */}
      <Section className="py-12">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-ink-200/70 bg-ink-50 p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h3 className="text-xl font-semibold text-ink-900">See the models behind the platform</h3>
              <p className="mt-2 text-ink-600">Every classifier, evaluated — or try a live prediction yourself.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/machine-learning">
                <Button variant="brand">Machine learning <ArrowRight className="size-4" /></Button>
              </Link>
              <Link href="/predictions">
                <Button variant="secondary">AI predictions</Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
