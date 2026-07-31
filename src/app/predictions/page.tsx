import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Info, Cpu, ShieldCheck } from "lucide-react";
import { pageMeta } from "@/lib/pages";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clientModel } from "@/lib/artifacts";
import { Predictor } from "./predictor";

const meta = pageMeta["/predictions"];
export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow={meta.eyebrow} title={meta.title} description={meta.description}>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" className="gap-2">
            <Cpu className="size-3.5" />
            Runs entirely in your browser
          </Badge>
          <Badge variant="warning" className="gap-2">
            <Info className="size-3.5" />
            Simulated dataset — honest, not inflated
          </Badge>
        </div>
      </PageHeader>

      {/* Live predictor */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Live model"
          title="Predict customer satisfaction"
          lead="A real logistic-regression model, its coefficients exported from the training pipeline and evaluated here in JavaScript. Adjust the inputs and the probability updates instantly."
        />
        <Reveal delay={0.05}>
          <div className="mt-8">
            <Predictor model={clientModel} />
          </div>
        </Reveal>
      </Section>

      {/* Honesty note */}
      <Section className="py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Reveal>
            <Card className="h-full p-7">
              <span className="grid size-11 place-items-center rounded-xl bg-steel-50 text-steel-600">
                <ShieldCheck className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink-900">Honest by construction</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{clientModel.note}</p>
            </Card>
          </Reveal>
          <Reveal delay={0.05}>
            <Card className="h-full p-7">
              <p className="text-xs uppercase tracking-wider text-ink-400">Train accuracy</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-ink-900">
                {clientModel.trainAccuracy.toFixed(1)}%
              </p>
              <p className="mt-1 text-sm text-ink-500">
                vs {clientModel.baselineAccuracy.toFixed(1)}% majority-class baseline
              </p>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="h-full p-7">
              <p className="text-xs uppercase tracking-wider text-ink-400">Train ROC-AUC</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-ink-900">
                {clientModel.trainRocAuc.toFixed(3)}
              </p>
              <p className="mt-1 text-sm text-ink-500">0.5 would be pure chance</p>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-12">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-ink-200/70 bg-ink-50 p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h3 className="text-xl font-semibold text-ink-900">How the model was built and judged</h3>
              <p className="mt-2 text-ink-600">See every classifier, metric and the leakage correction in full.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/machine-learning">
                <Button variant="brand">Machine learning <ArrowRight className="size-4" /></Button>
              </Link>
              <Link href="/research">
                <Button variant="secondary">About the research</Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
