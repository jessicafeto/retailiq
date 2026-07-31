/**
 * Central content model for interior pages — the eyebrow, title and
 * description each route renders in its page header and metadata.
 */
export type PageMeta = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
};

export const pageMeta: Record<string, PageMeta> = {
  "/dashboard": {
    href: "/dashboard",
    eyebrow: "Platform",
    title: "Executive Dashboard",
    description:
      "A single, elegant view of portfolio health — headline KPIs, brand and category mix, and interactive filters for slicing the catalogue.",
  },
  "/product-analytics": {
    href: "/product-analytics",
    eyebrow: "Platform",
    title: "Product Analytics",
    description:
      "Understand how products perform across price, rating and review dimensions, and compare categories and brands side by side.",
  },
  "/customer-intelligence": {
    href: "/customer-intelligence",
    eyebrow: "Platform",
    title: "Customer Intelligence",
    description:
      "Behavioural insights from the dissertation — satisfaction, purchase behaviour, demographics and sentiment — presented for decision makers.",
  },
  "/predictions": {
    href: "/predictions",
    eyebrow: "Intelligence",
    title: "AI Predictions",
    description:
      "Interactive, in-browser prediction tools powered by the trained models — enter product and customer attributes and see the model's output instantly.",
  },
  "/machine-learning": {
    href: "/machine-learning",
    eyebrow: "Intelligence",
    title: "Machine Learning",
    description:
      "Every model explained and evaluated — the original study results alongside a corrected, cross-validated pipeline with full metrics.",
  },
  "/market-basket": {
    href: "/market-basket",
    eyebrow: "Intelligence",
    title: "Market Basket Analysis",
    description:
      "Explore association rules mined with the Apriori algorithm — filter by lift, confidence and support to find products that belong together.",
  },
  "/methodology": {
    href: "/methodology",
    eyebrow: "Research",
    title: "Methodology",
    description:
      "The end-to-end analytical pipeline — from data understanding and cleaning through feature engineering, dimensionality reduction and modelling.",
  },
  "/research": {
    href: "/research",
    eyebrow: "Research",
    title: "About the Research",
    description:
      "The business problem, dataset, models, findings, limitations and future work — the academic foundation behind the platform.",
  },
  "/reports": {
    href: "/reports",
    eyebrow: "Research",
    title: "Reports",
    description:
      "Generate clean executive summaries of the analysis and export them to PDF for sharing with stakeholders.",
  },
  "/about": {
    href: "/about",
    eyebrow: "Company",
    title: "About RetailIQ",
    description:
      "What the platform is, the thinking behind it, and the person who built it — a data scientist turning research into a product.",
  },
};
