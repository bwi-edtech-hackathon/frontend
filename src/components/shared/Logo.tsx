import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center gap-2 font-display font-bold text-xl tracking-tight",
        variant === "light" ? "text-[var(--ink)]" : "text-white",
        className,
      )}
    >
      <span className="relative inline-flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--blue)] opacity-70 animate-pulse-ring" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--blue)]" />
      </span>
      CoachyAI
    </Link>
  );
}
