import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-semibold tracking-tight",
    "rounded-xl transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.97] cursor-pointer",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 hover:shadow-md",
        gradient:
          "bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white shadow-sm hover:from-emerald-800 hover:to-teal-700 hover:shadow-md",
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200/80 active:bg-slate-200",
        outline:
          "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-2xs",
        inverse:
          "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950",
        ghost:
          "rounded-full bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800",
        link: "text-emerald-700 underline underline-offset-4 hover:text-emerald-800 p-0 h-auto",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-10 px-4 text-sm rounded-lg",
        pill: "h-11 px-6 rounded-full",
        lg: "h-13 px-7 text-base rounded-2xl",
        icon: "h-10 w-10 rounded-full",
        "icon-sm": "h-8 w-8 rounded-full text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
