import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-ink-900 text-white shadow-soft hover:bg-ink-800 active:translate-y-px",
        brand:
          "bg-steel-600 text-white shadow-soft hover:bg-steel-700 active:translate-y-px",
        secondary:
          "bg-surface text-ink-800 shadow-ring hover:bg-ink-50 hover:shadow-soft",
        outline:
          "border border-ink-300 bg-transparent text-ink-800 hover:border-ink-400 hover:bg-ink-50",
        ghost: "bg-transparent text-ink-700 hover:bg-ink-100",
        link: "text-steel-600 underline-offset-4 hover:underline p-0 h-auto rounded-none",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
