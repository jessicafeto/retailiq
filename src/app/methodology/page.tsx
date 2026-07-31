import type { Metadata } from "next";
import Link from "next/link";
import {
  Database, Search, Eraser, Wand2, Network, Shrink,
  Cpu, BarChart3, SlidersHorizontal, Code2, ArrowRight,
} from "lucide-react";
import { pageMeta } from "@/lib/pages";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading, Prose } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const meta = pageMeta["/methodology"];
export const metadata: Metadata = { title: meta.title, description: meta.description };

const steps = [
  {
    icon: Database,
    title: "Data collection & understanding",
    body: "A simulated fashion retail dataset from Kaggle — 20 attributes spanning products (price, brand, category, rating, reviews, style, season) and consumers (age, purchase history, sentiment). Summary statistics and data types establish the ground truth.",
  },
  {
    icon: Search,
    title: "Exploratory data analysis",
    body: "Distributions, cardinalities and relationships are visualised to surface patterns and anomalies before any modelling — the detective work that shapes every later decision.",
  },
  {
    icon: Eraser,
    title: "Data cleaning",
    body: "Missing values are imputed (median for numeric, mode for categorical), duplicates checked, and non-informative columns such as Product Name removed to keep the signal clean.",
  },
  {
    icon: Wand2,
    title: "Feature engineering",
    body: "Interaction features (price×rating, reviews×rating), age-group binning, sentiment polarity on the text columns, one-hot and ordinal encoding, and four supervised targets: satisfaction, interest, category recommendation and holiday shopping.",
  },
  {
    icon: Network,
    title: "Market basket analysis",
    body: "The Apriori algorithm mines association rules between categories and styles, ranked by support (frequency), confidence (conditional probability) and lift (strength versus chance).",
  },
  {
    icon: Shrink,
    title: "Dimensionality reduction",
    body: "PCA compresses the feature space to 10 components that preserve variance; LDA projects onto the axis that best separates classes. Both are compared for their effect on classification.",
  },
  {
    icon: Cpu,
    title: "Modelling",
    body: "Seven classifiers — Logistic Regression, KNN, Linear & Kernel SVM, Naïve Bayes, Decision Tree and Random Forest — are trained on each target and reduction with a 70/30 split.",
  },
  {
    icon: BarChart3,
    title: "Evaluation & validation",
    body: "Beyond accuracy: k-fold cross-validation, confusion matrices, precision, recall, F1, ROC curves and AUC, plus feature importance — all benchmarked against a majority-class baseline.",
  },
  {
    icon: SlidersHorizontal,
    title: "Optimisation & fine-tuning",
    body: "Hyperparameter tuning, class balancing and feature selection reduce overfitting and remove target leakage — the difference between a flattering number and an honest one.",
  },
];

const apriori = [
  { term: "Support", def: "How frequently an itemset appears across all transactions." },
  { term: "Confidence", def: "The probability of buying B given that A was bought — P(B|A)." },
  { term: "Lift", def: "Observed support versus what independence predicts. >1 means the items are bought together more than by chance." },
];

const reduction = [
  {
    name: "PCA — Principal Component Analysis",
    tag: "Unsupervised",
    body: "Finds orthogonal directions of maximum variance. Ignores class labels; excellent for compression and visualisation.",
  },
  {
    name: "LDA — Linear Discriminant Analysis",
    tag: "Supervised",
    body: "Finds the projection that maximises separation between classes while minimising within-class scatter — tuned for classification.",
  },
];

export default function Page() {
  return (
    <>
      <PageHeader eyebrow={meta.eyebrow} title={meta.title} description={meta.description} />

      {/* Pipeline */}
      <Section className="pt-4">
        <SectionHeading
          eyebrow="The pipeline"
          title="From raw data to validated decision support"
          lead="Nine stages, applied end to end. Each one is reproducible in the open-source pipeline that generates every figure on this platform."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={(i % 3) * 0.05}>
                <Card className="flex h-full flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-steel-50 text-steel-600">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-ink-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-ink-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.body}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Apriori metrics */}
      <Section className="py-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="Market basket"
            title="The three Apriori metrics"
            lead="Association rules are only as trustworthy as the metrics behind them."
          />
          <div className="flex flex-col gap-4">
            {apriori.map((m, i) => (
              <Reveal key={m.term} delay={i * 0.05}>
                <div className="flex gap-4 rounded-2xl border border-ink-200/80 bg-surface p-5 shadow-soft">
                  <span className="font-display text-2xl italic text-steel-500">
                    {m.term[0]}
                  </span>
                  <div>
                    <p className="font-semibold text-ink-900">{m.term}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-500">{m.def}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* PCA vs LDA */}
      <Section className="py-8">
        <SectionHeading eyebrow="Dimensionality reduction" title="Two ways to simplify the data" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {reduction.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.05}>
              <Card className="h-full p-8">
                <Badge variant={r.tag === "Supervised" ? "default" : "neutral"}>{r.tag}</Badge>
                <h3 className="mt-4 text-lg font-semibold text-ink-900">{r.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{r.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Reproducibility */}
      <Section className="py-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-ink-200/70 bg-ink-950 p-8 text-white md:p-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(55% 70% at 90% 15%, rgba(108,151,201,0.4), transparent 60%)",
              }}
            />
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-steel-300">
                Reproducibility
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
                Two modelling tracks, run in the open
              </h3>
              <Prose className="mt-4 max-w-none text-ink-200 [&_strong]:text-white">
                <p>
                  RetailIQ runs the full pipeline on the 1,000,000-row dataset, with
                  modelling on a 20,000-row stratified sample (fixed random seed).
                  A <strong>faithful reproduction</strong> mirrors the dissertation
                  exactly, while a <strong>corrected track</strong> removes leakage,
                  adds cross-validation and reports a full metric suite against a
                  baseline.
                </p>
              </Prose>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="https://github.com/jessicafeto/retailiq" target="_blank">
                  <Button variant="brand">
                    <Code2 className="size-4" /> View the pipeline
                  </Button>
                </Link>
                <Link href="/machine-learning">
                  <Button variant="outline" className="border-white/25 text-white hover:border-white/50 hover:bg-white/10">
                    Explore results <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
