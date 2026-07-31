import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { pageMeta } from "@/lib/pages";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { overview, ml, basket } from "@/lib/artifacts";
import { formatNumber } from "@/lib/utils";
import { PrintButton } from "./print-button";

const meta = pageMeta["/reports"];
export const metadata: Metadata = { title: meta.title, description: meta.description };

const clean = (s: string) => s.replace(/^(Category|Style Attributes|Style)_/, "");

export default function Page() {
  const generated = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const findings = ml.targets.map((t) => {
    const leaky = Math.max(...Object.values(t.reproductionPca));
    const c = t.corrected[t.headline];
    return { label: t.label, leaky, corrected: c.accuracy, auc: c.rocAuc, baseline: t.baselineAccuracy };
  });
  const topRule = basket.rules[0];

  const kpis = [
    ["Records analysed", formatNumber(overview.generatedRows)],
    ["Attributes", String(overview.columns)],
    ["Brands / categories / styles", `${overview.cardinality.brands} / ${overview.cardinality.categories} / ${overview.cardinality.styles}`],
    ["Average price", `£${overview.numeric.Price.mean.toFixed(2)}`],
    ["Average rating", `${overview.numeric.Rating.mean.toFixed(1)} / 5`],
    ["Missing values", String(overview.missingValues)],
  ];

  return (
    <>
      <PageHeader eyebrow={meta.eyebrow} title={meta.title} description={meta.description}>
        <div className="no-print">
          <PrintButton />
        </div>
      </PageHeader>

      <Section className="pt-0">
        {/* The printable document */}
        <article className="print-surface mx-auto max-w-3xl rounded-2xl border border-ink-200/80 bg-surface p-8 shadow-card md:p-12">
          {/* Masthead */}
          <div className="flex items-start justify-between gap-4 border-b border-ink-200 pb-6">
            <div>
              <div className="flex items-center gap-2 text-steel-600">
                <FileText className="size-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">RetailIQ</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-ink-900">
                Fashion Retail Analytics — Executive Summary
              </h2>
              <p className="mt-1 text-sm text-ink-500">Generated {generated} from the RetailIQ pipeline</p>
            </div>
          </div>

          {/* Overview */}
          <section className="pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400">Dataset at a glance</h3>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              {kpis.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-ink-400">{label}</dt>
                  <dd className="mt-0.5 text-lg font-semibold text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">{overview.note}</p>
          </section>

          {/* Model findings */}
          <section className="mt-8 border-t border-ink-100 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400">Predictive findings</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Four behaviours were modelled on a stratified {formatNumber(ml.sample.size)}-row sample.
              The table contrasts the original (leakage-inflated) accuracy with a corrected,
              cross-validated result and its majority-class baseline.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wider text-ink-400">
                    <th className="py-2 pr-3 font-medium">Target</th>
                    <th className="py-2 px-2 text-right font-medium">Leaky</th>
                    <th className="py-2 px-2 text-right font-medium">Corrected</th>
                    <th className="py-2 px-2 text-right font-medium">Baseline</th>
                    <th className="py-2 pl-2 text-right font-medium">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody>
                  {findings.map((f) => (
                    <tr key={f.label} className="border-b border-ink-100 last:border-0">
                      <td className="py-2.5 pr-3 font-medium text-ink-800">{f.label}</td>
                      <td className="py-2.5 px-2 text-right tabular-nums text-ink-500">{f.leaky.toFixed(1)}%</td>
                      <td className="py-2.5 px-2 text-right tabular-nums text-ink-800">{f.corrected.toFixed(1)}%</td>
                      <td className="py-2.5 px-2 text-right tabular-nums text-ink-400">{f.baseline.toFixed(1)}%</td>
                      <td className="py-2.5 pl-2 text-right tabular-nums text-ink-600">{f.auc ? f.auc.toFixed(2) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Basket */}
          <section className="mt-8 border-t border-ink-100 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400">Market basket</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Apriori mined {formatNumber(basket.ruleCount)} association rules at {(basket.params.minSupport * 100).toFixed(0)}%
              minimum support. The strongest — <strong>{clean(topRule.antecedent)} → {clean(topRule.consequent)}</strong> —
              reaches a lift of just {topRule.lift.toFixed(2)}, only marginally above statistical independence.
            </p>
          </section>

          {/* Conclusion */}
          <section className="mt-8 border-t border-ink-100 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400">Recommendation</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              The dataset is simulated and near-uniform, so genuine predictive signal is limited; the honest
              conclusion is to invest in the <em>method</em> — leakage-free features, cross-validation and
              baseline-relative reporting — and to re-run this pipeline against real, time-stamped transaction
              data before acting on any specific figure. The techniques are production-ready; the data simply
              has little structure to reward them.
            </p>
          </section>

          <footer className="mt-8 border-t border-ink-200 pt-4 text-xs text-ink-400">
            RetailIQ · Xhesika Feto, MSc · Figures demonstrate methodology, not real market data.
          </footer>
        </article>
      </Section>
    </>
  );
}
