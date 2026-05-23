import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-lg border border-[var(--border)] bg-white px-4 text-base text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/20 focus:outline-none",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex w-full rounded-lg border border-[var(--border)] bg-white p-4 text-base text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/20 focus:outline-none resize-none",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
