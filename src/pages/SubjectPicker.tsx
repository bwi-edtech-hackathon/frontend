import { SubjectsGrid } from "@/components/shared/SubjectsGrid";

export default function SubjectPicker() {
  return (
    <div className="animate-fade-in">
      <div className="max-w-3xl">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Step 1 of 4
        </span>
        <h1 className="font-display mt-2 text-4xl font-bold tracking-tight md:text-5xl">
          What do you want to learn?
        </h1>
        <p className="mt-3 text-lg text-[var(--muted)]">
          Pick a subject. We'll start the diagnostic right away — no signup needed.
        </p>
      </div>
      <div className="mt-12">
        <SubjectsGrid interactive />
      </div>
    </div>
  );
}
