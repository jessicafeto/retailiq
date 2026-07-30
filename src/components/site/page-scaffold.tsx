import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import type { PageMeta } from "@/lib/pages";
import { PageHeader } from "@/components/site/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Renders an interior page that is scheduled for a later milestone.
 * It presents the page's intent and planned contents in an intentional,
 * on-brand layout rather than an empty placeholder.
 */
export function PageScaffold({ meta }: { meta: PageMeta }) {
  return (
    <>
      <PageHeader
        eyebrow={meta.eyebrow}
        title={meta.title}
        description={meta.description}
      >
        <Badge variant="neutral">In development · {meta.milestone}</Badge>
      </PageHeader>

      <section className="container-page pb-8">
        <div className="rounded-3xl border border-ink-200/80 bg-surface p-8 shadow-card md:p-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">
            What this page will include
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {meta.planned.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-steel-50 text-steel-600">
                  <Check className="size-3.5" />
                </span>
                <span className="text-sm leading-relaxed text-ink-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ink-200/70 pt-6">
            <Link href="/">
              <Button variant="secondary" size="sm">
                Back to overview
              </Button>
            </Link>
            <Link href="/research">
              <Button variant="ghost" size="sm">
                Read the research
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
