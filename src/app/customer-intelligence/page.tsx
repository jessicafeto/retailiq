import type { Metadata } from "next";
import { pageMeta } from "@/lib/pages";
import { PageScaffold } from "@/components/site/page-scaffold";

const meta = pageMeta["/customer-intelligence"];
export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function Page() {
  return <PageScaffold meta={meta} />;
}
