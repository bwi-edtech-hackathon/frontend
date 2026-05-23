import { useEffect, useState } from "react";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { FloatingPanel } from "@/components/exam/FloatingPanel";
import { Icon } from "@/components/ui/Icon";
import { getFormulaSheet, type FormulaGroup, type SubjectCode } from "@/lib/api";

export function FormulaSheet({
  onClose,
  subject = "MATH",
}: {
  onClose: () => void;
  subject?: SubjectCode;
}) {
  const t = useT();
  const [groups, setGroups] = useState<FormulaGroup[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let live = true;
    getFormulaSheet(subject).then((g) => {
      if (live) setGroups(g);
    });
    return () => {
      live = false;
    };
  }, [subject]);

  const q = query.trim().toLowerCase();
  const filtered =
    groups === null
      ? null
      : q
        ? groups
            .map((g) => ({
              ...g,
              items: g.items.filter(
                (f) =>
                  f.name.toLowerCase().includes(q) ||
                  f.eq.toLowerCase().includes(q),
              ),
            }))
            .filter((g) => g.items.length)
        : groups;

  return (
    <FloatingPanel
      title={t("Formula sheet")}
      onClose={onClose}
      width={340}
      initialX={typeof window !== "undefined" ? window.innerWidth - 360 : 100}
      initialY={180}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          borderRadius: 10,
          background: pal.surfaceAlt,
          border: `1px solid ${pal.line}`,
          marginBottom: 10,
        }}
      >
        <Icon name="search" size={14} color={pal.muted} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Search formulas…")}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 13,
            fontFamily: "inherit",
            color: pal.text,
          }}
        />
      </div>
      <div
        style={{
          maxHeight: 360,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {filtered === null && (
          <div style={{ fontSize: 12, color: pal.muted, padding: 12 }}>
            {t("Loading…")}
          </div>
        )}
        {filtered !== null && filtered.length === 0 && (
          <div style={{ fontSize: 12, color: pal.muted, padding: 12 }}>
            {t("No matches.")}
          </div>
        )}
        {filtered?.map((g) => (
          <div key={g.title}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: pal.muted,
                marginBottom: 6,
              }}
            >
              {g.title}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {g.items.map((f) => (
                <div
                  key={f.name}
                  style={{
                    padding: "8px 10px",
                    background: pal.surfaceAlt,
                    border: `1px solid ${pal.line}`,
                    borderRadius: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: pal.muted,
                      fontWeight: 600,
                      marginBottom: 2,
                    }}
                  >
                    {f.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontFamily: '"Newsreader", serif',
                      fontStyle: "italic",
                      color: pal.text,
                    }}
                  >
                    {f.eq}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FloatingPanel>
  );
}
