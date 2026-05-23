import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="bg-[var(--ink)] py-24 text-white">
      <div className="container-page text-center">
        <h2 className="font-display mx-auto max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
          Find out where you actually stand.
        </h2>
        <p className="mt-5 text-xl text-white/70">
          Free diagnostic. 10 minutes. No signup.
        </p>
        <div className="mt-10">
          <Link to="/app">
            <Button size="lg" className="bg-white text-[var(--ink)] hover:bg-white/90">
              Start the diagnostic
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
