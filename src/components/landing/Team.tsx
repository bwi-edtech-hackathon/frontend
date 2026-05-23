const TEAM = [
  {
    initials: "ST",
    name: "Sukhrob Tokhirov",
    role: "Team Lead",
    bio: "Java/Spring Boot backend engineer with distributed-systems experience.",
    bg: "var(--blue)",
  },
  {
    initials: "AS",
    name: "Ali Sultonov",
    role: "ML Trainer & Developer",
    bio: "Owns the Gemini integration and prompt engineering.",
    bg: "var(--red)",
  },
  {
    initials: "MJ",
    name: "Muhammad Jabborov",
    role: "Main Backend Developer",
    bio: "Builds the API layer and roadmap generator.",
    bg: "var(--green)",
  },
];

export function Team() {
  return (
    <section id="team" className="py-24">
      <div className="container-page">
        <h2 className="font-display max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
          Three builders, one weekend.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
          Backend, ML, and product — built together for GDG Build with AI 2026 in Tashkent.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TEAM.map((m) => (
            <div
              key={m.name}
              className="flex flex-col items-center rounded-2xl border border-[var(--border)] bg-white p-8 text-center transition-shadow hover:shadow-md"
            >
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full font-display text-2xl font-bold text-white"
                style={{ background: m.bg }}
              >
                {m.initials}
              </div>
              <div className="font-display mt-5 text-xl font-semibold">{m.name}</div>
              <div className="text-sm font-medium text-[var(--blue)]">{m.role}</div>
              <p className="mt-3 text-sm text-[var(--muted)]">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
