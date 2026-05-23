import { cn } from "@/lib/utils";

const steps = [
  {
    n: 1,
    title: "Diagnose.",
    body: "Take a short adaptive exam — written and spoken. AI scores against real rubrics like CEFR and IELTS bands.",
    accent: "bg-[var(--blue)] text-white",
    visual: (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
          Question 4 of 10
        </div>
        <div className="mt-3 font-display text-lg font-semibold">
          By the time we arrived, the movie ____.
        </div>
        <div className="mt-4 space-y-2 text-sm">
          {["already started", "had already started", "starts already"].map((o, i) => (
            <div
              key={o}
              className={cn(
                "rounded-lg border px-4 py-3",
                i === 1
                  ? "border-[var(--blue)] bg-[#e8f0fe] text-[var(--ink)]"
                  : "border-[var(--border)]",
              )}
            >
              {o}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    n: 2,
    title: "Personalize.",
    body: "Get a multi-week roadmap targeting your actual weak areas, not generic chapters.",
    accent: "bg-[var(--green)] text-white",
    visual: (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
          Your roadmap · 8 weeks
        </div>
        <div className="mt-4 space-y-3">
          {[
            { w: 1, title: "Speaking foundations", focus: true },
            { w: 2, title: "Fluency builders", focus: false },
            { w: 3, title: "Article mastery 🎯", focus: true },
            { w: 4, title: "Lexical range 🎯", focus: true },
          ].map((wk) => (
            <div
              key={wk.w}
              className={cn(
                "flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm",
                wk.focus
                  ? "border-[var(--blue)]/30 bg-[#e8f0fe]/40"
                  : "border-[var(--border)] bg-white",
              )}
            >
              <span className="font-medium">Week {wk.w}</span>
              <span className="text-[var(--muted)]">{wk.title}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    n: 3,
    title: "Practice.",
    body: "Voice-in / voice-out AI tutor for languages. Socratic guide for math. Real feedback, not just 'correct/incorrect.'",
    accent: "bg-[var(--yellow)] text-[var(--ink)]",
    visual: (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        <div className="space-y-3 text-sm">
          <div className="rounded-2xl rounded-bl-sm bg-[var(--bg-soft)] px-4 py-3 max-w-[80%]">
            What's the first thing you notice about this equation?
          </div>
          <div className="ml-auto rounded-2xl rounded-br-sm bg-[var(--blue)] text-white px-4 py-3 max-w-[80%]">
            The two sides aren't equal — I should isolate x.
          </div>
          <div className="rounded-2xl rounded-bl-sm bg-[var(--bg-soft)] px-4 py-3 max-w-[80%]">
            Good — what happens if you subtract 7 from both sides?
          </div>
        </div>
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container-page">
        <h2 className="font-display max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
          A learning loop that knows where you actually stand.
        </h2>
        <div className="mt-14 space-y-20">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={cn(
                "grid items-center gap-10 md:grid-cols-2",
                i % 2 === 1 && "md:[&>*:first-child]:order-2",
              )}
            >
              <div>
                <div
                  className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-full font-display text-xl font-bold",
                    s.accent,
                  )}
                >
                  {s.n}
                </div>
                <h3 className="font-display mt-4 text-3xl font-bold">{s.title}</h3>
                <p className="mt-3 max-w-md text-lg text-[var(--muted)]">{s.body}</p>
              </div>
              <div>{s.visual}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
