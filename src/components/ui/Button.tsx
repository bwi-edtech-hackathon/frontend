import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--blue)]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--blue)] text-white hover:bg-[#3b78e1] active:bg-[#356dd0] shadow-sm",
        ghost:
          "bg-transparent text-[var(--ink)] hover:bg-[var(--bg-soft)] border border-[var(--border)]",
        outline:
          "bg-white text-[var(--ink)] border border-[var(--border)] hover:bg-[var(--bg-soft)]",
        dark: "bg-[var(--ink)] text-white hover:bg-[#1a1f3d]",
        destructive: "bg-[var(--red)] text-white hover:bg-[#d63329]",
        link: "text-[var(--blue)] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-14 px-7 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
