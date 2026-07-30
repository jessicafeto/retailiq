import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-steel-200 bg-steel-50 text-steel-700",
        neutral: "border-ink-200 bg-ink-50 text-ink-600",
        outline: "border-ink-300 bg-transparent text-ink-600",
        solid: "border-transparent bg-ink-900 text-white",
        success: "border-teal-200 bg-teal-200/40 text-teal-500",
        warning: "border-sand-200 bg-sand-200/40 text-sand-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
