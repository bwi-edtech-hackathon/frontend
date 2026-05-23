import { SubjectsGrid } from "@/components/shared/SubjectsGrid";

export function SubjectsSection() {
  return (
    <section id="subjects" className="py-24 bg-[var(--bg-soft)]">
      <div className="container-page">
        <h2 className="font-display max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
          Pick what you want to master.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">
          Eight languages, two academic subjects. Start with the one you're closest to needing.
        </p>
        <div className="mt-10">
          <SubjectsGrid interactive={false} />
        </div>
      </div>
    </section>
  );
}
