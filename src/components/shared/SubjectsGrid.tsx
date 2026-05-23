import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Calculator, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

type LanguageCard = {
  code: string;
  name: string;
  flag: string;
  available: boolean;
};

const LANGUAGES: LanguageCard[] = [
  { code: "english", name: "English", flag: "🇬🇧", available: true },
  { code: "russian", name: "Russian", flag: "🇷🇺", available: false },
  { code: "chinese", name: "Chinese", flag: "🇨🇳", available: false },
  { code: "japanese", name: "Japanese", flag: "🇯🇵", available: false },
  { code: "arabic", name: "Arabic", flag: "🇸🇦", available: false },
  { code: "french", name: "French", flag: "🇫🇷", available: false },
  { code: "spanish", name: "Spanish", flag: "🇪🇸", available: false },
  { code: "korean", name: "Korean", flag: "🇰🇷", available: false },
];

export function SubjectsGrid({ interactive = false }: { interactive?: boolean }) {
  const navigate = useNavigate();

  const onLanguageClick = (lang: LanguageCard) => {
    if (!interactive) return;
    if (!lang.available) {
      toast.info(`${lang.name} is coming soon`, {
        description: "We're adding new languages weekly.",
      });
      return;
    }
    navigate(`/app/diagnostic/${lang.code}`);
  };

  const onMathClick = () => {
    if (!interactive) return;
    navigate(`/app/diagnostic/math`);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <h3 className="font-display text-lg font-semibold mb-3 text-[var(--muted)] uppercase tracking-wide text-xs">
          Languages
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          {LANGUAGES.map((lang) => {
            const disabled = !lang.available;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => onLanguageClick(lang)}
                disabled={interactive && disabled}
                title={
                  disabled
                    ? "Coming soon — we're adding new languages weekly."
                    : undefined
                }
                className={cn(
                  "group rounded-2xl border border-[var(--border)] bg-white p-4 text-left transition-all",
                  interactive && !disabled && "hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--blue)] cursor-pointer",
                  interactive && disabled && "cursor-not-allowed opacity-60",
                  !interactive && "cursor-default",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl leading-none">{lang.flag}</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        lang.available ? "bg-[var(--green)]" : "bg-[var(--border)]",
                      )}
                    />
                    <span className="text-xs text-[var(--muted)]">
                      {lang.available ? "Available" : "Coming soon"}
                    </span>
                  </span>
                </div>
                <div className="font-display font-semibold text-base">
                  {lang.name}
                </div>
                <div className="mt-2 text-xs text-[var(--muted)]">
                  A1 · A2 · B1 · B2 · C1 · C2
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg font-semibold mb-3 text-[var(--muted)] uppercase tracking-wide text-xs">
          Academic
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={onMathClick}
            disabled={!interactive}
            className={cn(
              "group flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 text-left transition-all",
              interactive && "hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--blue)] cursor-pointer",
              !interactive && "cursor-default",
            )}
          >
            <div className="rounded-xl bg-[#e8f0fe] p-3 text-[var(--blue)]">
              <Calculator className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-xl font-semibold">Math</h4>
                <Badge variant="success">Available</Badge>
              </div>
              <p className="text-sm text-[var(--muted)] mt-1">
                Algebra, geometry, calculus. With a Socratic tutor that never gives the answer.
              </p>
            </div>
          </button>

          <div
            className={cn(
              "flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 text-left opacity-60",
            )}
          >
            <div className="rounded-xl bg-[#fef7e0] p-3 text-[#b06000]">
              <FlaskConical className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-xl font-semibold">Science</h4>
                <Badge variant="muted">Coming soon</Badge>
              </div>
              <p className="text-sm text-[var(--muted)] mt-1">
                Physics and chemistry. We're adding labs next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
