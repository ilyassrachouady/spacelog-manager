import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-blue text-white",
        secondary: "border-transparent bg-slate-100 text-slate-900",
        success: "border-transparent bg-success-light text-emerald-700",
        warning: "border-transparent bg-warning-light text-amber-700",
        danger: "border-transparent bg-danger-light text-red-700",
        outline: "border-slate-200 text-slate-700",
        blue: "border-brand-blue/20 bg-brand-blue-light text-brand-blue",
        pink: "border-brand-pink/20 bg-brand-pink-light text-brand-pink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "outline" | "blue" | "pink";
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
