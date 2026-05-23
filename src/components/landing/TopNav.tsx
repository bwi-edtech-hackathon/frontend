import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-white/80 backdrop-blur shadow-[0_1px_0_var(--border)]"
          : "bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#how-it-works"
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          >
            How it works
          </a>
          <a
            href="#subjects"
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          >
            Subjects
          </a>
          <a
            href="#team"
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
          >
            Team
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Link to="/app">
            <Button size="sm">Try CoachyAI</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
