import { CheckCircle2, Target } from "lucide-react";

export function ResultMockup() {
  return (
    <div className="relative animate-fade-in">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-[var(--blue)]/10 via-transparent to-[var(--green)]/10 blur-2xl" />
      <div className="rounded-2xl border border-[var(--border)] bg-white shadow-[0_30px_80px_-30px_rgba(10,14,39,0.25)] overflow-hidden">
        <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-3 bg-[var(--bg-soft)]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-[var(--muted)] tabular">
            coachy.ai/result
          </span>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--blue)] text-3xl font-bold text-white tabular">
              B2
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
                Your English level
              </div>
              <div className="font-display text-xl font-semibold">
                Upper-Intermediate
              </div>
              <div className="text-sm text-[var(--muted)]">
                Stronger than 64% of learners
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { label: "Grammar", value: 72, color: "var(--score-mid)" },
              { label: "Vocabulary", value: 64, color: "var(--score-mid)" },
              { label: "Listening", value: 78, color: "var(--score-high)" },
              { label: "Speaking", value: 56, color: "var(--score-low)" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--ink)]">{s.label}</span>
                  <span className="tabular text-[var(--muted)]">
                    {s.value}/100
                  </span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-[var(--bg-soft)]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${s.value}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              <Target className="h-3.5 w-3.5" />
              Your 8-week roadmap
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full ${
                    i < 1 ? "bg-[var(--blue)]" : "bg-[var(--border)]"
                  }`}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-[var(--green)]" />
              <span className="text-[var(--ink)]">Week 1 — Speaking Foundations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
