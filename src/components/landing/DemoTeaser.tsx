import { Mic, Play } from "lucide-react";

export function DemoTeaser() {
  return (
    <section className="py-24">
      <div className="container-page grid items-center gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Talk to the AI examiner.
          </h2>
          <p className="mt-4 max-w-md text-lg text-[var(--muted)]">
            Practice IELTS Speaking with an AI that scores you on the real 4-criteria band rubric. Get specific feedback on fluency, lexical range, grammar, and pronunciation.
          </p>
          <ul className="mt-6 space-y-3 text-[var(--ink)]">
            {[
              "Real-time transcription as you speak",
              "Band-by-band breakdown — not just a single number",
              "Feedback in Uzbek and Russian, not just English",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--blue)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="group relative aspect-video w-full overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--ink)] text-left transition-shadow hover:shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--blue)]/30 via-transparent to-[var(--green)]/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="relative">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/40" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-[var(--ink)]">
                <Play className="h-7 w-7 fill-current" />
              </span>
            </div>
            <span className="mt-6 text-sm uppercase tracking-wide opacity-80">
              Live demo · 45 seconds
            </span>
            <span className="mt-2 font-display text-2xl font-semibold">
              IELTS Speaking Part 1
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3 text-white">
              <Mic className="h-4 w-4" />
              <span className="text-sm font-medium">
                "Tell me about your hometown."
              </span>
            </div>
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs text-white">
              Band 6.5
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}
