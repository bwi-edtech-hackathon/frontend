import { useI18n, type Lang } from "@/lib/i18n";
import { palette as pal } from "@/lib/palette";

const OPTIONS: { v: Lang; label: string }[] = [
  { v: "en", label: "EN" },
  { v: "ru", label: "RU" },
  { v: "uz", label: "UZ" },
];

export function LangSwitcher({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useI18n();
  return (
    <div
      style={{
        display: "inline-flex",
        padding: 2,
        borderRadius: 999,
        background: dark ? "rgba(255,255,255,0.08)" : pal.surfaceAlt,
        border: `1px solid ${dark ? "rgba(255,255,255,0.18)" : pal.line}`,
        gap: 2,
      }}
    >
      {OPTIONS.map((o) => {
        const active = o.v === lang;
        return (
          <button
            key={o.v}
            type="button"
            onClick={() => setLang(o.v)}
            style={{
              padding: "4px 10px",
              border: "none",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.04em",
              cursor: "pointer",
              fontFamily: "inherit",
              background: active
                ? pal.primary
                : "transparent",
              color: active
                ? pal.primaryInk
                : dark
                  ? "rgba(255,255,255,0.7)"
                  : pal.muted,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
