import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Quote, Target, Database, GitBranch, Layers,
  AlertTriangle, Compass, CheckCircle2,
} from "lucide-react";
import { pageMeta } from "@/lib/pages";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading, Prose } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ml, overview, basket } from "@/lib/artifacts";
import { formatNumber } from "@/lib/utils";

const meta = pageMeta["/research"];
export const metadata: Metadata = { title: meta.title, description: meta.description };

const purposes = [
  {
    icon: Target,
    title: "Predict consumer behaviour",
    body: "Analyse how modern data mining and machine learning can predict customer preferences in fashion retail.",
  },
  {
    icon: Layers,
    title: "Understand CRM value",
    body: "Examine the role of customer relationship management in driving sales and business strategy.",
  },
  {
    icon: GitBranch,
    title: "Compare PCA and LDA",
    body: "Evaluate two dimensionality-reduction techniques and their effect on classification tasks.",
  },
];

const limitations = [
  "The dataset is simulated and, at full scale, largely uniform — genuine predictive signal is limited.",
  "The original study's high accuracies were partly driven by target leakage (e.g. Rating predicting satisfaction).",
  "External drivers of behaviour — trends, seasonality, economics — are not represented in the data.",
  "Customer interest proved hard to predict, hovering near random for every model.",
];

const futureWork = [
  "Incorporate real, time-stamped transaction data to enable temporal and cohort analysis.",
  "Explore neural networks and deep learning where linear models plateaued.",
  "Engineer richer, non-leaking features and validate with rigorous cross-validation (applied here).",
  "Add external signals — trend indices, macro-economic and seasonal context.",
];

export default function Page() {
  const findings = ml.targets.map((t) => {
    const reproBest = Math.max(...Object.values(t.reproductionPca));
    const rf = t.corrected["Random Forest"];
    return {
      label: t.label,
      reproBest,
      correctedAcc: rf.accuracy,
      auc: rf.rocAuc,
      baseline: t.baselineAccuracy,
    };
  });
  const clean = (s: string) => s.replace(/^(Category|Style Attributes|Style)_/, "");
  const topRule = basket.rules[0];

  return (
    <>
      <PageHeader eyebrow={meta.eyebrow} title={meta.title} description={meta.description} />

      {/* Origin statement */}
      <Section className="pt-0">
        <Reveal>
          <Card className="relative overflow-hidden border-steel-200/70 bg-steel-50/60 p-8 md:p-10">
            <Quote className="absolute right-6 top-6 size-10 text-steel-200" />
            <p className="max-w-3xl text-xl font-medium leading-snug text-ink-800 md:text-2xl">
              Originally developed as an MSc dissertation and expanded into an
              AI-powered retail intelligence platform.
            </p>
            <p className="mt-4 text-sm text-ink-500">
              How Can Advanced Data Science Approaches Uncover Patterns in Consumer
              Behaviour and Guide Strategic Decision-Making in the Fashion Retail
              Sector? — Xhesika Feto, MSc.
            </p>
          </Card>
        </Reveal>
      </Section>

      {/* Business problem */}
      <Section className="py-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SectionHeading eyebrow="The business problem" title="Fashion moves faster than the data can be read" />
          <Reveal delay={0.05}>
            <Prose>
              <p>
                The fashion industry generates an overwhelming influx of data as it
                digitalises. Preferences shift multiple times within a single
                season, and retailers who cannot read those signals face rising
                inventory, unsatisfied customers and shrinking profit.
              </p>
              <p>
                The paramount challenge is <strong>harnessing this data</strong> to
                understand and predict swiftly changing behaviour — ensuring
                customer satisfaction while keeping stock decisions sharp. This
                research asks whether advanced data science can turn that raw data
                into strategic, defensible decisions.
              </p>
            </Prose>
          </Reveal>
        </div>
      </Section>

      {/* Purpose */}
      <Section className="py-8">
        <SectionHeading eyebrow="Research aims" title="Three questions the study set out to answer" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {purposes.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.05}>
                <Card className="h-full p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-steel-50 text-steel-600">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.body}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Dataset */}
      <Section className="py-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="The dataset"
            title="A simulated fashion retail dataset"
            lead="Sourced from Kaggle. The original study used a 29,730-row sample; RetailIQ analyses the full dataset."
          />
          <Reveal delay={0.05}>
            <Card className="p-2">
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-ink-100">
                {[
                  ["Records", formatNumber(overview.sourceRows)],
                  ["Attributes", String(overview.columns)],
                  ["Brands", String(overview.cardinality.brands)],
                  ["Categories", String(overview.cardinality.categories)],
                  ["Styles", String(overview.cardinality.styles)],
                  ["Missing values", String(overview.missingValues)],
                ].map(([label, value]) => (
                  <div key={label} className="bg-surface p-5">
                    <dt className="text-xs uppercase tracking-wider text-ink-400">{label}</dt>
                    <dd className="mt-1 text-2xl font-semibold text-ink-900">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-start gap-2 p-4 text-xs text-ink-500">
                <Database className="mt-0.5 size-4 shrink-0 text-steel-500" />
                <span>{overview.note}</span>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Findings — the honest core */}
      <Section className="py-8">
        <SectionHeading
          eyebrow="Findings"
          title="What holds up under scrutiny"
          lead="The original methodology reports high accuracy. Once target leakage is removed and models are cross-validated, most of that signal disappears — the honest read of a simulated, near-uniform dataset."
        />
        <Reveal delay={0.05}>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-ink-200/80 bg-surface shadow-card">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wider text-ink-400">
                  <th className="p-4 font-medium">Prediction task</th>
                  <th className="p-4 font-medium">Original (leaky)</th>
                  <th className="p-4 font-medium">Corrected</th>
                  <th className="p-4 font-medium">Baseline</th>
                  <th className="p-4 font-medium">ROC-AUC</th>
                </tr>
              </thead>
              <tbody>
                {findings.map((f) => (
                  <tr key={f.label} className="border-b border-ink-100 last:border-0">
                    <td className="p-4 font-medium text-ink-800">{f.label}</td>
                    <td className="p-4 tabular-nums text-ink-600">{f.reproBest.toFixed(1)}%</td>
                    <td className="p-4 tabular-nums text-ink-600">{f.correctedAcc.toFixed(1)}%</td>
                    <td className="p-4 tabular-nums text-ink-400">{f.baseline.toFixed(1)}%</td>
                    <td className="p-4 tabular-nums">
                      <Badge variant={f.auc && f.auc > 0.55 ? "success" : "neutral"}>
                        {f.auc ? f.auc.toFixed(2) : "—"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Prose className="mt-8 max-w-3xl">
            <p>
              Market basket analysis tells the same story: the strongest
              association on the full dataset —{" "}
              <strong>{clean(topRule.antecedent)} → {clean(topRule.consequent)}</strong> —
              has a lift of only {topRule.lift.toFixed(2)}, barely above the 1.0 that
              signals statistical independence. The associations the original study
              found reflect its smaller, particular sample rather than a durable
              market pattern.
            </p>
            <p>
              This is the point of RetailIQ: it preserves the methodology and
              presents the original results in full, then shows — transparently —
              what survives proper validation. Sound method matters more than a
              flattering number.
            </p>
          </Prose>
        </Reveal>
      </Section>

      {/* Limitations + future work */}
      <Section className="py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <Card className="h-full p-8">
              <span className="grid size-11 place-items-center rounded-xl bg-sand-200/50 text-sand-500">
                <AlertTriangle className="size-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-ink-900">Limitations</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {limitations.map((l) => (
                  <li key={l} className="flex items-start gap-3 text-sm leading-relaxed text-ink-600">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sand-500" />
                    {l}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
          <Reveal delay={0.05}>
            <Card className="h-full p-8">
              <span className="grid size-11 place-items-center rounded-xl bg-steel-50 text-steel-600">
                <Compass className="size-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-ink-900">Future work</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {futureWork.map((l) => (
                  <li key={l} className="flex items-start gap-3 text-sm leading-relaxed text-ink-600">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-steel-500" />
                    {l}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-12">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-ink-200/70 bg-ink-50 p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h3 className="text-xl font-semibold text-ink-900">See the methods and the models</h3>
              <p className="mt-2 text-ink-600">Follow the full pipeline, or explore every model result in detail.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/methodology">
                <Button variant="brand">Methodology <ArrowRight className="size-4" /></Button>
              </Link>
              <Link href="/machine-learning">
                <Button variant="secondary">Model results</Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
