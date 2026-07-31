import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, GitBranch, Gauge } from "lucide-react";
import { pageMeta } from "@/lib/pages";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarList, Figure } from "@/components/charts";
import { ml } from "@/lib/artifacts";

const meta = pageMeta["/machine-learning"];
export const metadata: Metadata = { title: meta.title, description: meta.description };

/** Small ROC curve in pure SVG. */
function RocCurve({ points, auc }: { points: { fpr: number; tpr: number }[]; auc: number | null }) {
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(p.fpr * 100).toFixed(2)} ${((1 - p.tpr) * 100).toFixed(2)}`)
    .join(" ");
  return (
    <svg viewBox="-6 -6 112 112" className="w-full" role="img" aria-label={`ROC curve, AUC ${auc ?? "n/a"}`}>
      {/* frame */}
      <rect x="0" y="0" width="100" height="100" fill="none" stroke="var(--color-ink-200)" strokeWidth="0.6" />
      {/* chance diagonal */}
      <line x1="0" y1="100" x2="100" y2="0" stroke="var(--color-ink-300)" strokeWidth="0.8" strokeDasharray="3 3" />
      {/* curve */}
      <path d={path} fill="none" stroke="var(--color-steel-500)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <text x="50" y="112" textAnchor="middle" fontSize="6" fill="var(--color-ink-400)">False positive rate</text>
    </svg>
  );
}

function ConfusionMatrix({ matrix }: { matrix: number[][] }) {
  const flat = matrix.flat();
  const max = Math.max(...flat);
  const cellClass = (v: number, diag: boolean) =>
    diag ? "bg-steel-500 text-white" : "bg-ink-50 text-ink-600";
  const labels = ["Predicted 0", "Predicted 1"];
  return (
    <div className="grid grid-cols-[auto_1fr_1fr] gap-2 text-center text-sm">
      <div />
      {labels.map((l) => (
        <div key={l} className="pb-1 text-xs uppercase tracking-wider text-ink-400">{l}</div>
      ))}
      {matrix.map((row, ri) => (
        <div key={ri} className="contents">
          <div className="flex items-center justify-end pr-2 text-xs uppercase tracking-wider text-ink-400">
            Actual {ri}
          </div>
          {row.map((v, ci) => (
            <div
              key={ci}
              className={`rounded-xl py-6 font-semibold tabular-nums ${cellClass(v, ri === ci)}`}
              style={{ opacity: ri === ci ? 0.55 + (v / max) * 0.45 : 1 }}
            >
              {v.toLocaleString("en-GB")}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const s = ml.sample;
  const featured = ml.targets[0]; // Customer Satisfaction — the leakage exemplar
  const featuredRf = featured.corrected[featured.headline];

  const summary = ml.targets.map((t) => {
    const leakyBest = Math.max(...Object.values(t.reproductionPca));
    const c = t.corrected[t.headline];
    return { label: t.label, leakyBest, ...c, baseline: t.baselineAccuracy };
  });

  const topFeatures = ml.featureImportance.slice(0, 10);
  const featMax = Math.max(...topFeatures.map((f) => f.importance));

  return (
    <>
      <PageHeader eyebrow={meta.eyebrow} title={meta.title} description={meta.description}>
        <Badge variant="warning" className="gap-2">
          <Info className="size-3.5" />
          Simulated dataset — figures demonstrate methodology, not real market data
        </Badge>
      </PageHeader>

      {/* Setup */}
      <Section className="pt-0">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <SectionHeading
            eyebrow="Two tracks, run in the open"
            title="The original study, and an honest re-run"
            lead="Every target is modelled twice: a faithful reproduction that mirrors the dissertation exactly, and a corrected track that removes target leakage, cross-validates, and reports the full metric suite against a majority-class baseline."
          />
          <Reveal delay={0.05}>
            <Card className="p-2">
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-ink-100">
                {[
                  ["Sample", `${s.size.toLocaleString("en-GB")} rows`],
                  ["Split", `${s.split}, seed ${s.randomState}`],
                  ["Classifiers", `${ml.modelOrder.length} algorithms`],
                  ["Reduction", `PCA → ${s.reduction.pca} · LDA → ${s.reduction.lda}`],
                ].map(([label, value]) => (
                  <div key={label} className="bg-surface p-5">
                    <dt className="text-xs uppercase tracking-wider text-ink-400">{label}</dt>
                    <dd className="mt-1 text-lg font-semibold text-ink-900">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-start gap-2 p-4 text-xs text-ink-500">
                <GitBranch className="mt-0.5 size-4 shrink-0 text-steel-500" />
                <span>Models: {ml.modelOrder.join(", ")}.</span>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Cross-target summary */}
      <Section className="py-8">
        <SectionHeading
          eyebrow="Every target, every metric"
          title="What survives correction"
          lead={`Corrected results use ${featured.headline}. Where the leaky accuracy and the corrected accuracy diverge, leakage was doing the work.`}
        />
        <Reveal delay={0.05}>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-ink-200/80 bg-surface shadow-card">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wider text-ink-400">
                  <th className="p-4 font-medium">Target</th>
                  <th className="p-4 text-right font-medium">Leaky acc</th>
                  <th className="p-4 text-right font-medium">Corrected acc</th>
                  <th className="p-4 text-right font-medium">Precision</th>
                  <th className="p-4 text-right font-medium">Recall</th>
                  <th className="p-4 text-right font-medium">F1</th>
                  <th className="p-4 text-right font-medium">ROC-AUC</th>
                  <th className="p-4 text-right font-medium">Baseline</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((t) => (
                  <tr key={t.label} className="border-b border-ink-100 last:border-0">
                    <td className="p-4 font-medium text-ink-800">{t.label}</td>
                    <td className="p-4 text-right tabular-nums text-ink-500">{t.leakyBest.toFixed(1)}%</td>
                    <td className="p-4 text-right tabular-nums text-ink-800">{t.accuracy.toFixed(1)}%</td>
                    <td className="p-4 text-right tabular-nums text-ink-500">{t.precision.toFixed(1)}%</td>
                    <td className="p-4 text-right tabular-nums text-ink-500">{t.recall.toFixed(1)}%</td>
                    <td className="p-4 text-right tabular-nums text-ink-500">{t.f1.toFixed(1)}%</td>
                    <td className="p-4 text-right tabular-nums">
                      <Badge variant={t.rocAuc && t.rocAuc > 0.55 ? "success" : "neutral"}>
                        {t.rocAuc ? t.rocAuc.toFixed(2) : "—"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right tabular-nums text-ink-400">{t.baseline.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      {/* Featured: satisfaction */}
      <Section className="py-8">
        <SectionHeading
          eyebrow="Case study"
          title={`${featured.label}: the leakage story in one target`}
          lead={featured.note}
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Reveal>
            <Figure title="Per-model accuracy" caption="Dissertation vs faithful reproduction vs corrected">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wider text-ink-400">
                      <th className="py-2 pr-3 font-medium">Model</th>
                      <th className="py-2 px-2 text-right font-medium">Diss.</th>
                      <th className="py-2 px-2 text-right font-medium">Repro</th>
                      <th className="py-2 pl-2 text-right font-medium">Corrected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ml.modelOrder.map((m) => (
                      <tr key={m} className="border-b border-ink-100 last:border-0">
                        <td className="py-2.5 pr-3 font-medium text-ink-700">{m}</td>
                        <td className="py-2.5 px-2 text-right tabular-nums text-ink-500">{featured.dissertationPca[m].toFixed(1)}</td>
                        <td className="py-2.5 px-2 text-right tabular-nums text-ink-500">{featured.reproductionPca[m].toFixed(1)}</td>
                        <td className="py-2.5 pl-2 text-right tabular-nums font-medium text-ink-800">{featured.corrected[m].accuracy.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Figure>
          </Reveal>
          <div className="flex flex-col gap-4">
            <Reveal delay={0.05}>
              <Figure
                title={`ROC — ${featured.headline}`}
                caption={`AUC ${featuredRf.rocAuc?.toFixed(3) ?? "—"} · essentially the chance diagonal`}
                aside={<Gauge className="size-5 text-steel-400" />}
              >
                <div className="mx-auto max-w-[16rem]">
                  <RocCurve points={featured.roc.points} auc={featured.roc.auc} />
                </div>
              </Figure>
            </Reveal>
            <Reveal delay={0.1}>
              <Figure title="Confusion matrix" caption={`${featured.headline}, corrected · roughly a coin flip`}>
                <ConfusionMatrix matrix={featured.confusionMatrix.matrix} />
              </Figure>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Feature importance */}
      <Section className="py-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <SectionHeading
            eyebrow="Feature importance"
            title="What the forest leans on"
            lead="Random-forest importances after leakage is removed. No single feature dominates — importance is spread thinly, exactly what you would expect when the signal itself is thin."
          />
          <Reveal delay={0.05}>
            <Figure title="Top features" caption="Relative importance, corrected model">
              <BarList
                labelWidth="10rem"
                items={topFeatures.map((f) => ({
                  label: f.feature,
                  value: f.importance.toFixed(3),
                  fraction: f.importance / featMax,
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
              <h3 className="text-xl font-semibold text-ink-900">Run the model yourself</h3>
              <p className="mt-2 text-ink-600">A real logistic-regression model, live in your browser.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/predictions">
                <Button variant="brand">AI predictions <ArrowRight className="size-4" /></Button>
              </Link>
              <Link href="/methodology">
                <Button variant="secondary">Methodology</Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
