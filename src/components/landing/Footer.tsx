import { Logo } from "@/components/shared/Logo";

const cols = [
  {
    heading: "Product",
    links: ["Diagnostic", "Roadmap", "Voice tutor", "Subjects"],
  },
  { heading: "Company", links: ["About", "Team", "GDG Tashkent", "Contact"] },
  { heading: "Legal", links: ["Privacy", "Terms", "Cookies"] },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--ink)] py-12 text-white/70">
      <div className="container-page grid gap-10 md:grid-cols-[1fr_2fr_auto]">
        <div>
          <Logo variant="dark" />
          <p className="mt-3 max-w-xs text-sm">
            Diagnose first. Then teach. Built in Tashkent for GDG Build with AI 2026.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {cols.map((c) => (
            <div key={c.heading}>
              <div className="text-xs font-semibold uppercase tracking-wide text-white">
                {c.heading}
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-white transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-xs text-white/50">© 2026 CoachyAI</div>
      </div>
    </footer>
  );
}
