import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white",
        secondary: "border border-slate-200 bg-slate-100 text-slate-800",
        primary: "bg-emerald-600 text-white",
        verified: "bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold",
        destructive: "bg-rose-600 text-white",
        "destructive-light": "bg-rose-50 text-rose-700 border border-rose-200/60",
        success: "bg-emerald-600 text-white",
        "success-light": "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
        warning: "bg-amber-500 text-white",
        "warning-light": "bg-amber-50 text-amber-800 border border-amber-200/60",
        outline: "border border-slate-200 text-slate-700 bg-white shadow-2xs",
      },
      size: {
        sm: "h-5 gap-1 px-2 text-[10px]",
        default: "h-6 gap-1.5 px-2.5 text-xs",
        lg: "h-7 gap-1.5 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
