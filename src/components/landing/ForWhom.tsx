const audiences = [
  {
    emoji: "🎯",
    title: "IELTS / TOEFL aspirants",
    body: "Score-targeted practice with real-time speaking feedback.",
  },
  {
    emoji: "📐",
    title: "School & university students",
    body: "Math and science help in Uzbek with a tutor that builds intuition, not dependence.",
  },
  {
    emoji: "🌐",
    title: "Self-learners",
    body: "Pick up a new language with structured progression — Korean, Japanese, Chinese, and more.",
  },
];

export function ForWhom() {
  return (
    <section className="py-24 bg-[var(--bg-soft)]">
      <div className="container-page">
        <h2 className="font-display max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
          Built for the way you already learn.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl border border-[var(--border)] bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="text-3xl">{a.emoji}</div>
              <h3 className="font-display mt-4 text-xl font-semibold">{a.title}</h3>
              <p className="mt-2 text-[var(--muted)]">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
