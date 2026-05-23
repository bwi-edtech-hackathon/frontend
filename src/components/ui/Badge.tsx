import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "muted" | "success" | "warning" | "danger" | "blue";

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  const styles: Record<Variant, string> = {
    default: "bg-[var(--bg-soft)] text-[var(--ink)] border border-[var(--border)]",
    muted: "bg-transparent text-[var(--muted)] border border-[var(--border)]",
    success: "bg-[#e6f4ea] text-[#1e8e3e]",
    warning: "bg-[#fef7e0] text-[#b06000]",
    danger: "bg-[#fce8e6] text-[#c5221f]",
    blue: "bg-[#e8f0fe] text-[#1967d2]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
