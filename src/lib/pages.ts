/**
 * Central content model for interior pages. During the incremental build,
 * routes that are not yet fully implemented render a consistent, intentional
 * scaffold from this data (heading + planned contents + delivering milestone).
 */
export type PageMeta = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  milestone: string;
  planned: string[];
};

export const pageMeta: Record<string, PageMeta> = {
  "/dashboard": {
    href: "/dashboard",
    eyebrow: "Platform",
    title: "Executive Dashboard",
    description:
      "A single, elegant view of portfolio health — headline KPIs, brand and category mix, and interactive filters for slicing the catalogue.",
    milestone: "Milestone 4",
    planned: [
      "Executive KPI cards: products, average rating, review volume, average price",
      "Filters for brand, category, season, price band, rating and style",
      "Interactive brand and category performance charts",
      "Demand and satisfaction summaries derived from the dataset",
    ],
  },
  "/product-analytics": {
    href: "/product-analytics",
    eyebrow: "Platform",
    title: "Product Analytics",
    description:
      "Understand how products perform across price, rating and review dimensions, and compare categories and brands side by side.",
    milestone: "Milestone 4",
    planned: [
      "Price and rating distribution explorers",
      "Category and brand comparison views",
      "Top and bottom performing product segments",
      "Cross-tabs of price band against rating",
    ],
  },
  "/customer-intelligence": {
    href: "/customer-intelligence",
    eyebrow: "Platform",
    title: "Customer Intelligence",
    description:
      "Behavioural insights from the dissertation — satisfaction, purchase behaviour, demographics and sentiment — presented for decision makers.",
    milestone: "Milestone 5",
    planned: [
      "Satisfaction and sentiment breakdowns",
      "Age-group and purchase-history analysis",
      "Popularity and engagement signals",
      "Recommendation opportunities grounded in the data",
    ],
  },
  "/predictions": {
    href: "/predictions",
    eyebrow: "Intelligence",
    title: "AI Predictions",
    description:
      "Interactive, in-browser prediction tools powered by the trained models — enter product and customer attributes and see the model's output instantly.",
    milestone: "Milestone 6",
    planned: [
      "Predict customer satisfaction from product attributes",
      "Estimate product recommendation likelihood",
      "Seasonal-shopper propensity",
      "Honest confidence and limitation notes on every prediction",
    ],
  },
  "/machine-learning": {
    href: "/machine-learning",
    eyebrow: "Intelligence",
    title: "Machine Learning",
    description:
      "Every model explained and evaluated — the original study results alongside a corrected, cross-validated pipeline with full metrics.",
    milestone: "Milestone 6",
    planned: [
      "Model comparison tables (accuracy, precision, recall, F1, ROC-AUC)",
      "Confusion matrices and ROC curves",
      "Feature importance and cross-validation",
      "Original-vs-corrected pipeline, presented transparently",
    ],
  },
  "/market-basket": {
    href: "/market-basket",
    eyebrow: "Intelligence",
    title: "Market Basket Analysis",
    description:
      "Explore association rules mined with the Apriori algorithm — filter by lift, confidence and support to find products that belong together.",
    milestone: "Milestone 5",
    planned: [
      "Interactive association-rule explorer",
      "Lift, confidence and support controls",
      "Rule network and heatmap visualisations",
      "Merchandising and bundling recommendations",
    ],
  },
  "/methodology": {
    href: "/methodology",
    eyebrow: "Research",
    title: "Methodology",
    description:
      "The end-to-end analytical pipeline — from data understanding and cleaning through feature engineering, dimensionality reduction and modelling.",
    milestone: "Milestone 3",
    planned: [
      "Data collection, cleaning and feature engineering",
      "PCA and LDA dimensionality reduction",
      "Modelling, evaluation and validation approach",
      "Reproducibility notes for the RetailIQ pipeline",
    ],
  },
  "/research": {
    href: "/research",
    eyebrow: "Research",
    title: "About the Research",
    description:
      "The business problem, dataset, models, findings, limitations and future work — the academic foundation behind the platform.",
    milestone: "Milestone 3",
    planned: [
      "Business problem and research questions",
      "Dataset overview and key findings",
      "Limitations and future work, stated honestly",
      "“Originally developed as an MSc dissertation and expanded into an AI-powered retail intelligence platform.”",
    ],
  },
  "/reports": {
    href: "/reports",
    eyebrow: "Research",
    title: "Reports",
    description:
      "Generate clean executive summaries of the analysis and export them to PDF for sharing with stakeholders.",
    milestone: "Milestone 7",
    planned: [
      "Configurable executive report builder",
      "Key metrics, charts and insights in one document",
      "PDF export",
      "Shareable, print-ready layout",
    ],
  },
  "/about": {
    href: "/about",
    eyebrow: "Company",
    title: "About RetailIQ",
    description:
      "What the platform is, the thinking behind it, and the person who built it — a data scientist turning research into a product.",
    milestone: "Milestone 3",
    planned: [
      "The RetailIQ story and product vision",
      "How the dissertation became a platform",
      "The technology and design principles",
      "About the author",
    ],
  },
};
