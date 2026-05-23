import { Globe, MessagesSquare, BookMarked } from "lucide-react";

const items = [
  {
    icon: Globe,
    title: "One-size-fits-all",
    body: "Everyone gets the same lesson. Strong students are bored, weak students are lost.",
  },
  {
    icon: MessagesSquare,
    title: "No native language support",
    body: "Global tools explain mistakes in English. We explain in Uzbek and Russian.",
  },
  {
    icon: BookMarked,
    title: "No structure",
    body: "PDFs and YouTube playlists aren't a learning path. You need a roadmap.",
  },
];

export function Problem() {
  return (
    <section className="bg-[var(--ink)] py-24 text-white">
      <div className="container-page">
        <h2 className="font-display max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
          Most apps don't know who you are.
        </h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-white/70">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
