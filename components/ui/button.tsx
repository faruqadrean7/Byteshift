"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-blue-500 text-slate-100 hover:bg-blue-500 hover:-translate-y-0.5 shadow-md shadow-blue-600/25 font-semibold",
        secondary:
          "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-slate-100",
        outline:
          "border border-slate-700 text-slate-200 bg-slate-800/60 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-600",
        ghost: "text-slate-300 hover:bg-slate-800 hover:text-slate-100",
        white:
          "bg-white text-slate-900 hover:-translate-y-0.5 hover:shadow-lg font-semibold",
        destructive:
          "bg-rose-600 text-slate-100 hover:bg-rose-500 shadow-sm shadow-rose-600/20 font-semibold",
        wa: "bg-[#25D366] text-slate-100 hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#20bd5a] font-semibold",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
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
