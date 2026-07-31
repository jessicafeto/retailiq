import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Compass, GitBranch, Layers, ShieldCheck, Sparkles, Cpu,
} from "lucide-react";
import { pageMeta } from "@/lib/pages";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading, Prose } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const meta = pageMeta["/about"];
export const metadata: Metadata = { title: meta.title, description: meta.description };

const principles = [
  {
    icon: ShieldCheck,
    title: "Honesty over flattery",
    body: "Every figure is reported against a baseline, and leakage is corrected in the open. A near-chance result is shown as exactly that — the number the method actually earns.",
  },
  {
    icon: Cpu,
    title: "Reproducible by design",
    body: "An offline Python pipeline generates every artifact the site reads. The same code that trains the models exports the JSON that renders these pages.",
  },
  {
    icon: Compass,
    title: "Clarity as craft",
    body: "Executive-ready surfaces, calm typography and restraint. The interface stays out of the way so the analysis can speak.",
  },
];

const stack = [
  ["Frontend", "Next.js App Router, TypeScript, Tailwind CSS"],
  ["Analytics", "Python — pandas, scikit-learn, Apriori"],
  ["Inference", "Client-side: model coefficients exported to JSON, evaluated in-browser"],
  ["Delivery", "Static-first pages, deployed on Vercel"],
];

export default function Page() {
  return (
    <>
      <PageHeader eyebrow={meta.eyebrow} title={meta.title} description={meta.description} />

      {/* Vision */}
      <Section className="pt-0">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SectionHeading eyebrow="The idea" title="Research, turned into a product" />
          <Reveal delay={0.05}>
            <Prose>
              <p>
                RetailIQ began as an MSc dissertation asking how advanced data science could
                uncover patterns in consumer behaviour and guide strategic decisions in fashion
                retail. It has been rebuilt as a decision-support platform — the same rigorous
                methodology, presented the way a business would actually consume it.
              </p>
              <p>
                The premise is simple: <strong>a model is only worth as much as the honesty
                behind its evaluation.</strong> RetailIQ preserves the original study in full,
                then shows transparently what survives proper validation.
              </p>
            </Prose>
          </Reveal>
        </div>
      </Section>

      {/* From dissertation to platform */}
      <Section className="py-8">
        <SectionHeading
          eyebrow="The journey"
          title="From a dissertation to a decision-support tool"
          lead="Three moves took the research from a static document to a living platform."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: Layers, title: "Preserve the method", body: "Reproduce the dissertation's pipeline faithfully — every classifier, reduction and target, exactly as reported." },
            { icon: GitBranch, title: "Correct it in the open", body: "Add a parallel track that removes target leakage, cross-validates, and reports the full metric suite against a baseline." },
            { icon: Sparkles, title: "Make it usable", body: "Wrap the analysis in an executive interface — dashboards, an interactive predictor, and print-ready reports." },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 0.05}>
                <Card className="h-full p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-steel-50 text-steel-600">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.body}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Principles */}
      <Section className="py-8">
        <SectionHeading eyebrow="Design principles" title="What the platform stands for" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {principles.map((p, i) => {
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

      {/* Technology */}
      <Section className="py-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Technology"
            title="How it is built"
            lead="A static-first architecture: heavy computation happens offline, and the browser only ever renders the results."
          />
          <Reveal delay={0.05}>
            <Card className="p-2">
              <dl className="divide-y divide-ink-100">
                {stack.map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-baseline sm:gap-6">
                    <dt className="w-28 shrink-0 text-xs uppercase tracking-wider text-ink-400">{label}</dt>
                    <dd className="text-sm text-ink-700">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* Author */}
      <Section className="py-8">
        <Reveal>
          <Card className="flex flex-col gap-6 border-steel-200/70 bg-steel-50/50 p-8 md:flex-row md:items-center md:p-10">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-surface text-2xl font-semibold text-steel-600 shadow-ring">
              XF
            </span>
            <div>
              <p className="eyebrow mb-2">About the author</p>
              <h2 className="text-xl font-semibold text-ink-900">Xhesika Feto, MSc</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-ink-600">
                A data scientist working at the intersection of machine learning and product.
                RetailIQ is built on her MSc dissertation in fashion-retail analytics — an
                exercise in taking research all the way to a usable, honest decision-support
                tool rather than leaving it on the page.
              </p>
            </div>
          </Card>
        </Reveal>
      </Section>

      {/* CTA */}
      <Section className="py-12">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-ink-200/70 bg-ink-50 p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h3 className="text-xl font-semibold text-ink-900">Explore the platform</h3>
              <p className="mt-2 text-ink-600">Start with the executive dashboard, or read the research in full.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button variant="brand">Open dashboard <ArrowRight className="size-4" /></Button>
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
