import { Link } from "react-router-dom";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { Btn, Card, Pill, Progress } from "@/components/ui/Primitives";
import { useIsAtMostTablet, useIsMobile } from "@/hooks/useMediaQuery";

type NodeState = "done" | "active" | "locked";
type NodeMeta = "event" | "checkpoint" | "goal" | undefined;

type RNode = {
  id: string;
  week: number;
  row: number;
  name: string;
  mastery: number;
  state: NodeState;
  meta?: NodeMeta;
  topics?: number;
};

export default function Roadmap() {
  const t = useT();
  const isMobile = useIsMobile();
  const isAtMostTablet = useIsAtMostTablet();

  const nodes: RNode[] = [
    { id: "diag", week: 0, row: 1, name: t("Diagnostic"), mastery: 100, state: "done", meta: "event" },
    { id: "lin", week: 1, row: 0, name: t("Linear equations"), mastery: 92, state: "done", topics: 4 },
    { id: "ineq", week: 1, row: 2, name: t("Inequalities"), mastery: 86, state: "done", topics: 3 },
    { id: "quad", week: 2, row: 1, name: t("Quadratic equations"), mastery: 62, state: "active", topics: 5 },
    { id: "cp1", week: 2, row: 3, name: t("Checkpoint"), mastery: 0, state: "locked", meta: "checkpoint" },
    { id: "log", week: 3, row: 0, name: t("Logarithms"), mastery: 0, state: "locked", topics: 6 },
    { id: "func", week: 3, row: 2, name: t("Functions"), mastery: 0, state: "locked", topics: 5 },
    { id: "trig", week: 4, row: 1, name: t("Trigonometry"), mastery: 0, state: "locked", topics: 8 },
    { id: "seq", week: 4, row: 3, name: t("Sequences & series"), mastery: 0, state: "locked", topics: 5 },
    { id: "mock", week: 5, row: 1, name: t("Final mock"), mastery: 0, state: "locked", meta: "event" },
    { id: "exam", week: 6, row: 1, name: t("BMBA exam"), mastery: 0, state: "locked", meta: "goal" },
  ];

  const edges: [string, string][] = [
    ["diag", "lin"],
    ["diag", "ineq"],
    ["lin", "quad"],
    ["ineq", "quad"],
    ["quad", "cp1"],
    ["cp1", "log"],
    ["cp1", "func"],
    ["log", "trig"],
    ["func", "trig"],
    ["quad", "seq"],
    ["func", "seq"],
    ["trig", "mock"],
    ["seq", "mock"],
    ["mock", "exam"],
  ];

  const COL_W = 200;
  const ROW_H = 110;
  const COLS = 7;
  const ROWS = 5;
  const SVG_W = COLS * COL_W + 80;
  const SVG_H = ROWS * ROW_H + 80;
  const posOf = (week: number, row: number) => ({
    x: 40 + week * COL_W + COL_W / 2,
    y: 40 + row * ROW_H + ROW_H / 2,
  });

  const stateColor = (state: NodeState) => {
    if (state === "done") return pal.primary;
    if (state === "active") return pal.accent;
    return pal.line;
  };

  return (
    <div>
      {/* Top */}
      <div
        style={{
          padding: isMobile ? "14px 16px" : "20px 32px",
          borderBottom: `1px solid ${pal.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: pal.muted, marginBottom: 2 }}>
            {t("Mathematics")} · {t("6-week plan")}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            {t("Your study path")}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Pill
            pal={pal}
            tone="primarySoft"
            icon={<Icon name="flag" size={12} />}
          >
            {t("On track for")} {t("B+ by August 12")}
          </Pill>
          <Btn
            pal={pal}
            tone="outline"
            size="md"
            icon={<Icon name="sparkle" size={14} />}
          >
            {t("Regenerate roadmap")}
          </Btn>
        </div>
      </div>

      {/* Progress strip */}
      <div
        style={{
          padding: isMobile ? "12px 16px" : "14px 32px",
          background: pal.surface,
          borderBottom: `1px solid ${pal.line}`,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 8,
          overflowX: "auto",
        }}
      >
        {[
          { w: 0, l: t("Diagnostic"), state: "done" as const },
          { w: 1, l: `${t("Week")} 1`, state: "done" as const },
          { w: 2, l: `${t("Week")} 2`, state: "active" as const },
          { w: 3, l: `${t("Week")} 3`, state: "locked" as const },
          { w: 4, l: `${t("Week")} 4`, state: "locked" as const },
          { w: 5, l: t("Final mock"), state: "locked" as const },
          { w: 6, l: t("BMBA exam"), state: "locked" as const },
        ].map((w) => (
          <div key={w.w} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: w.state === "active" ? pal.accent : pal.muted,
                marginBottom: 4,
              }}
            >
              {w.l}
            </div>
            <div
              style={{
                height: 4,
                borderRadius: 999,
                background:
                  w.state === "done"
                    ? pal.primary
                    : w.state === "active"
                      ? pal.accent
                      : pal.line,
              }}
            />
          </div>
        ))}
      </div>

      {/* Constellation */}
      <div style={{ padding: 24, overflowX: "auto", overflowY: "hidden" }}>
        <div
          style={{
            position: "relative",
            width: SVG_W,
            height: SVG_H,
            margin: "0 auto",
          }}
        >
          <svg
            width={SVG_W}
            height={SVG_H}
            style={{ position: "absolute", inset: 0 }}
          >
            {Array.from({ length: COLS + 1 }).map((_, i) => (
              <line
                key={i}
                x1={40 + i * COL_W}
                x2={40 + i * COL_W}
                y1="20"
                y2={SVG_H - 20}
                stroke={pal.line}
                strokeWidth="1"
                strokeDasharray="4 6"
              />
            ))}
            {edges.map(([from, to], i) => {
              const a = nodes.find((n) => n.id === from);
              const b = nodes.find((n) => n.id === to);
              if (!a || !b) return null;
              const p1 = posOf(a.week, a.row);
              const p2 = posOf(b.week, b.row);
              const midX = (p1.x + p2.x) / 2;
              const d = `M ${p1.x} ${p1.y} C ${midX} ${p1.y}, ${midX} ${p2.y}, ${p2.x} ${p2.y}`;
              const active = a.state !== "locked" && b.state !== "locked";
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={active ? pal.primary : pal.line}
                  strokeWidth={active ? 2.5 : 1.5}
                  strokeDasharray={b.state === "locked" ? "6 6" : "0"}
                  opacity={active ? 1 : 0.5}
                />
              );
            })}
          </svg>

          {nodes.map((n) => {
            const p = posOf(n.week, n.row);
            const isEvent =
              n.meta === "event" || n.meta === "checkpoint" || n.meta === "goal";
            const size = isEvent ? 80 : 140;
            void stateColor;
            return (
              <div
                key={n.id}
                style={{
                  position: "absolute",
                  left: p.x - size / 2,
                  top: p.y - (isEvent ? 30 : 40),
                  width: size,
                  ...(isEvent
                    ? {
                        background:
                          n.state === "done"
                            ? pal.primary
                            : n.state === "active"
                              ? pal.accent
                              : pal.surfaceAlt,
                        color:
                          n.state === "done"
                            ? pal.primaryInk
                            : n.state === "active"
                              ? pal.accentInk
                              : pal.muted,
                        border:
                          n.state === "locked"
                            ? `1.5px dashed ${pal.line}`
                            : "none",
                        borderRadius: 12,
                        padding: "10px 12px",
                        textAlign: "center" as const,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                      }
                    : {
                        background:
                          n.state === "active" ? pal.primary : pal.surface,
                        color: n.state === "active" ? pal.primaryInk : pal.text,
                        border:
                          n.state === "locked"
                            ? `1px dashed ${pal.line}`
                            : `1px solid ${pal.line}`,
                        borderRadius: 14,
                        padding: 12,
                        boxShadow:
                          n.state === "active"
                            ? `0 8px 24px ${pal.primary}25`
                            : "none",
                        opacity: n.state === "locked" ? 0.6 : 1,
                      }),
                }}
              >
                {isEvent ? (
                  <>
                    {n.meta === "goal" && (
                      <Icon
                        name="flag"
                        size={14}
                        color={
                          n.state === "locked" ? pal.muted : pal.primaryInk
                        }
                      />
                    )}
                    {n.meta === "event" && n.state === "done" && (
                      <Icon
                        name="check"
                        size={14}
                        color={pal.primaryInk}
                        stroke={2.5}
                      />
                    )}
                    {n.meta === "checkpoint" && (
                      <Icon name="shield" size={14} color={pal.muted} />
                    )}
                    <div style={{ marginTop: 4 }}>{n.name}</div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          opacity: 0.75,
                        }}
                      >
                        {n.state === "done"
                          ? t("Mastered")
                          : n.state === "active"
                            ? t("In progress")
                            : `${n.topics} ${t("topics")}`}
                      </span>
                      {n.state !== "locked" && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: '"JetBrains Mono", monospace',
                          }}
                        >
                          {n.mastery}%
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {n.name}
                    </div>
                    {n.state !== "locked" && (
                      <div
                        style={{
                          marginTop: 8,
                          height: 3,
                          borderRadius: 999,
                          background:
                            n.state === "active"
                              ? "rgba(255,255,255,0.25)"
                              : pal.line,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${n.mastery}%`,
                            height: "100%",
                            background:
                              n.state === "active" ? pal.accent : pal.primary,
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & details */}
      <div
        style={{
          padding: isMobile ? "0 16px 24px" : "0 32px 32px",
          display: "grid",
          gridTemplateColumns: isAtMostTablet ? "1fr" : "1fr 1fr 1fr",
          gap: 16,
        }}
      >
        <Card pal={pal} pad={20}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: pal.muted,
              marginBottom: 12,
            }}
          >
            {t("Mastery legend")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { c: pal.primary, l: t("Mastered"), n: 2, border: false },
              { c: pal.accent, l: t("In progress"), n: 1, border: false },
              { c: pal.line, l: t("Locked"), n: 8, border: true },
            ].map((r, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: r.c,
                    border: r.border ? `1px dashed ${pal.muted}` : "none",
                    opacity: r.border ? 0.5 : 1,
                  }}
                />
                <span style={{ flex: 1, fontSize: 13 }}>{r.l}</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: '"JetBrains Mono", monospace',
                    color: pal.muted,
                  }}
                >
                  {r.n}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card pal={pal} pad={20}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: pal.muted,
              marginBottom: 12,
            }}
          >
            {t("Domains")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { name: t("Algebra"), mastery: 80 },
              { name: t("Geometry"), mastery: 45 },
              { name: t("Functions"), mastery: 30 },
              { name: t("Probability"), mastery: 10 },
            ].map((d) => (
              <div key={d.name}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</span>
                  <span
                    style={{
                      fontSize: 12,
                      color: pal.muted,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    {d.mastery}%
                  </span>
                </div>
                <Progress
                  value={d.mastery}
                  pal={pal}
                  height={6}
                  color={pal.primary}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card
          pal={pal}
          pad={20}
          style={{
            background: pal.primary,
            color: pal.primaryInk,
            border: "none",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.85,
              marginBottom: 8,
            }}
          >
            {t("Today")}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {t("Quadratic equations")} · {t("Discriminant method")}
          </div>
          <div
            style={{
              marginTop: 10,
              height: 5,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{ width: "62%", height: "100%", background: pal.accent }}
            />
          </div>
          <Link
            to="/app/chat"
            style={{ textDecoration: "none", display: "block", marginTop: 14 }}
          >
            <Btn
              pal={pal}
              tone="accent"
              size="md"
              full
              iconAfter={<Icon name="arrow-right" size={14} />}
            >
              {t("Resume lesson")}
            </Btn>
          </Link>
        </Card>
      </div>
    </div>
  );
}
