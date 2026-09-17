import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "text-white bg-linear-to-b from-primary-light/90 to-primary/90 backdrop-blur-xl border border-white/15 shadow-[0_8px_24px_-8px_rgba(2,80,215,0.55),inset_0_1px_0_0_rgba(255,255,255,0.15)] hover:from-primary-light hover:to-primary hover:shadow-[0_10px_32px_-6px_rgba(59,116,232,0.65),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5",
        accent:
          "bg-accent/80 backdrop-blur-xl text-secondary border border-white/15 hover:bg-accent shadow-lg shadow-accent/15 hover:-translate-y-0.5",
        outline:
          "border border-primary-light/30 bg-primary-light/5 backdrop-blur-xl text-text hover:border-primary-light/50 hover:bg-primary-light/10 hover:shadow-[0_0_0_1px_rgba(59,116,232,0.2),0_8px_24px_-8px_rgba(59,116,232,0.35)]",
        ghost: "text-text hover:bg-primary-light/10 hover:backdrop-blur-xl",
        glass:
          "glass text-text hover:border-primary-light/40 hover:bg-primary-light/10 hover:shadow-[0_0_0_1px_rgba(59,116,232,0.25),0_10px_28px_-10px_rgba(59,116,232,0.5)] hover:-translate-y-0.5",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
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
