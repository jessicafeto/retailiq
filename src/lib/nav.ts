import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  PackageSearch,
  Users,
  Sparkles,
  Brain,
  Network,
  FileText,
  FlaskConical,
  BookOpen,
  Building2,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

/** Primary destinations, grouped for the navbar dropdowns + footer sitemap. */
export const navGroups: NavGroup[] = [
  {
    label: "Platform",
    items: [
      {
        label: "Executive Dashboard",
        href: "/dashboard",
        description: "KPIs and portfolio health at a glance",
        icon: LayoutDashboard,
      },
      {
        label: "Product Analytics",
        href: "/product-analytics",
        description: "Performance, price and rating distributions",
        icon: PackageSearch,
      },
      {
        label: "Customer Intelligence",
        href: "/customer-intelligence",
        description: "Behaviour, satisfaction and demographics",
        icon: Users,
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      {
        label: "AI Predictions",
        href: "/predictions",
        description: "Interactive model-driven predictions",
        icon: Sparkles,
      },
      {
        label: "Machine Learning",
        href: "/machine-learning",
        description: "Models, metrics and comparisons",
        icon: Brain,
      },
      {
        label: "Market Basket Analysis",
        href: "/market-basket",
        description: "Association rules, lift and confidence",
        icon: Network,
      },
    ],
  },
  {
    label: "Research",
    items: [
      {
        label: "Methodology",
        href: "/methodology",
        description: "The end-to-end analytical pipeline",
        icon: FlaskConical,
      },
      {
        label: "About the Research",
        href: "/research",
        description: "Problem, findings and limitations",
        icon: BookOpen,
      },
      {
        label: "Reports",
        href: "/reports",
        description: "Generate and export executive reports",
        icon: FileText,
      },
    ],
  },
];

/** Standalone top-level links. */
export const aboutItem: NavItem = {
  label: "About",
  href: "/about",
  description: "The platform and the person behind it",
  icon: Building2,
};

/** Flat list of every routed page (used for footer + route generation sanity). */
export const allNavItems: NavItem[] = [
  ...navGroups.flatMap((g) => g.items),
  aboutItem,
];
