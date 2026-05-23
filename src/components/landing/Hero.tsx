import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ResultMockup } from "@/components/landing/ResultMockup";

export function Hero() {
  return (
    <section className="hero-radial relative min-h-[90vh] pt-32 pb-20">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-3 py-1.5 text-xs font-medium text-[var(--muted)] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[var(--blue)]" />
            🎓 GDG Build with AI · 2026
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Stop learning the same thing as <span className="text-[var(--blue)]">everyone else</span>.
          </h1>
          <p className="mt-6 max-w-xl text-xl text-[var(--muted)]">
            CoachyAI runs a 10-minute AI diagnostic, then builds the exact study roadmap you need. Languages, math, and science — in Uzbek, Russian, and English.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/app">
              <Button size="lg">
                Take the free diagnostic
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="ghost" size="lg">
                See how it works
              </Button>
            </a>
          </div>
          <p className="mt-6 text-sm text-[var(--muted)]">
            Built with Gemini · Free during beta · No credit card
          </p>
        </div>
        <div className="hidden lg:block">
          <ResultMockup />
        </div>
      </div>
    </section>
  );
}
