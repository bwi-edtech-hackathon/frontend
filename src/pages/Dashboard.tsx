import { Link } from "react-router-dom";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { Avatar, Btn, Card, Pill, Progress } from "@/components/ui/Primitives";
import { LangSwitcher } from "@/components/app/LangSwitcher";

export default function Dashboard() {
  const t = useT();

  const kpis = [
    {
      label: t("Rasch score"),
      value: "56.4",
      sub: t("Math · projected"),
      delta: "+3.2",
    },
    {
      label: t("Topic mastery"),
      value: "68%",
      sub: `14/22 ${t("mastered")}`,
      delta: "+5%",
    },
    {
      label: t("Battle ELO"),
      value: "1487",
      sub: t("Silver tier"),
      delta: "+18",
    },
    {
      label: t("Study streak"),
      value: "12d",
      sub: `${t("best")} 17d`,
      delta: `${t("Today")} ✓`,
    },
  ];

  const heatmapVals = [
    92, 88, 75, 95, 62, 45, 30, 78, 82, 65, 50, 70, 90, 85, 35, 55, 40, 72, 88,
    60, 25, 68,
  ];

  return (
    <div>
      {/* Topbar */}
      <div
        style={{
          padding: "20px 32px",
          borderBottom: `1px solid ${pal.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: pal.bg,
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: pal.muted, marginBottom: 2 }}>
            {t("Tuesday, August 5")}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            {t("Good evening, Diana")}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 999,
              background: pal.surface,
              border: `1px solid ${pal.line}`,
            }}
          >
            <Icon name="search" size={14} color={pal.muted} />
            <span style={{ fontSize: 12, color: pal.muted }}>
              {t("Search topics…")}
            </span>
            <span
              style={{
                fontSize: 10,
                color: pal.muted,
                padding: "1px 6px",
                borderRadius: 4,
                background: pal.surfaceAlt,
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              ⌘K
            </span>
          </div>
          <Pill
            pal={pal}
            tone="accentSoft"
            icon={<Icon name="flame" size={13} />}
          >
            {t("12 day streak")}
          </Pill>
          <LangSwitcher />
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: pal.surface,
              border: `1px solid ${pal.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="bell" size={16} />
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "24px 32px",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 20,
        }}
      >
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {kpis.map((k, i) => (
              <Card key={i} pal={pal} pad={16}>
                <div
                  style={{
                    fontSize: 11,
                    color: pal.muted,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {k.label}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    marginTop: 4,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {k.value}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 6,
                  }}
                >
                  <span style={{ fontSize: 11, color: pal.muted }}>
                    {k.sub}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: pal.good,
                    }}
                  >
                    {k.delta}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Score trend */}
          <Card pal={pal} pad={20}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div>
                <div
                  style={{ fontSize: 13, color: pal.muted, marginBottom: 2 }}
                >
                  {t("Rasch score · last 8 weeks")}
                </div>
                <div
                  style={{ display: "flex", alignItems: "baseline", gap: 10 }}
                >
                  <span
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    56.4
                  </span>
                  <Pill pal={pal} tone="good">
                    {t("+8.2 vs 4 wk ago")}
                  </Pill>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Pill pal={pal} tone="primary">
                  {t("Math")}
                </Pill>
                <Pill pal={pal} tone="outline">
                  {t("Uzbek")}
                </Pill>
              </div>
            </div>
            <svg viewBox="0 0 600 140" style={{ width: "100%", height: 140 }}>
              {[0, 1, 2, 3].map((i) => (
                <line
                  key={i}
                  x1="0"
                  x2="600"
                  y1={i * 35 + 10}
                  y2={i * 35 + 10}
                  stroke={pal.line}
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              ))}
              <line
                x1="0"
                x2="600"
                y1="45"
                y2="45"
                stroke={pal.accent}
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text
                x="595"
                y="40"
                textAnchor="end"
                fontSize="10"
                fill={pal.accent}
                fontWeight="600"
              >
                {t("B+ target · 60")}
              </text>
              <defs>
                <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={pal.primary}
                    stopOpacity="0.25"
                  />
                  <stop offset="100%" stopColor={pal.primary} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 110 L 75 100 L 150 90 L 225 95 L 300 75 L 375 70 L 450 55 L 525 50 L 600 38 L 600 140 L 0 140 Z"
                fill="url(#area)"
              />
              <path
                d="M 0 110 L 75 100 L 150 90 L 225 95 L 300 75 L 375 70 L 450 55 L 525 50 L 600 38"
                fill="none"
                stroke={pal.primary}
                strokeWidth="2.5"
              />
              {[0, 75, 150, 225, 300, 375, 450, 525, 600].map((x, i) => {
                const y = [110, 100, 90, 95, 75, 70, 55, 50, 38][i];
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={i === 8 ? 5 : 3}
                    fill={pal.surface}
                    stroke={pal.primary}
                    strokeWidth="2"
                  />
                );
              })}
              {["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "Now"].map(
                (l, i) => (
                  <text
                    key={l}
                    x={i * 75}
                    y="135"
                    fontSize="10"
                    fill={pal.muted}
                  >
                    {l}
                  </text>
                ),
              )}
            </svg>
          </Card>

          {/* Heat map */}
          <Card pal={pal} pad={20}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {t("Topic mastery heat map")}
                </div>
                <div
                  style={{ fontSize: 12, color: pal.muted, marginTop: 2 }}
                >
                  {t("Math · 22 topics · darker = stronger")}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: pal.muted,
                }}
              >
                <span>0%</span>
                <div
                  style={{
                    width: 80,
                    height: 8,
                    borderRadius: 2,
                    background: `linear-gradient(to right, ${pal.line}, ${pal.primary})`,
                  }}
                />
                <span>100%</span>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(11, 1fr)",
                gap: 4,
              }}
            >
              {heatmapVals.map((v, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 6,
                    background: `color-mix(in oklch, ${pal.primary} ${v}%, ${pal.surfaceAlt})`,
                    border: `1px solid ${pal.line}`,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    padding: 4,
                    fontSize: 9,
                    fontWeight: 700,
                    color: v > 60 ? pal.primaryInk : pal.muted,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {v}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 14,
                fontSize: 11,
                color: pal.muted,
              }}
            >
              <span>{t("Algebra · Geometry · Functions · Probability")}</span>
            </div>
          </Card>

          {/* Recent mocks + battles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <Card pal={pal} pad={18}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 12,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700 }}>{t("Recent mocks")}</div>
                <span
                  style={{ fontSize: 12, color: pal.primary, fontWeight: 600 }}
                >
                  {t("See all")}
                </span>
              </div>
              {[
                { name: t("Full mock #7"), date: "Aug 3", score: "58.2", grade: "B" },
                {
                  name: t("Checkpoint · Vieta"),
                  date: "Aug 2",
                  score: "8/10",
                  grade: "—",
                },
                { name: t("Full mock #6"), date: "Jul 27", score: "54.1", grade: "B" },
              ].map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 0",
                    borderTop: i > 0 ? `1px solid ${pal.line}` : "none",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: pal.surfaceAlt,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="book" size={14} color={pal.muted} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: pal.muted }}>{e.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        fontFamily: '"JetBrains Mono", monospace',
                      }}
                    >
                      {e.score}
                    </div>
                    <div style={{ fontSize: 10, color: pal.muted }}>{e.grade}</div>
                  </div>
                </div>
              ))}
            </Card>

            <Card pal={pal} pad={18}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 12,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700 }}>{t("Recent battles")}</div>
                <span
                  style={{ fontSize: 12, color: pal.primary, fontWeight: 600 }}
                >
                  {t("See all")}
                </span>
              </div>
              {[
                { name: "Sardor", score: "1240–980", won: true, delta: 18 },
                { name: "Madina", score: "1340–910", won: true, delta: 22 },
                { name: "AI · Gold", score: "880–1120", won: false, delta: -8 },
              ].map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 0",
                    borderTop: i > 0 ? `1px solid ${pal.line}` : "none",
                  }}
                >
                  <Avatar name={b.name} size={32} hue={[20, 200, 320][i]} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{b.name}</div>
                    <div
                      style={{
                        fontSize: 11,
                        color: pal.muted,
                        fontFamily: '"JetBrains Mono", monospace',
                      }}
                    >
                      {b.score}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: b.won ? pal.good : pal.bad,
                    }}
                  >
                    {b.won ? "+" : ""}
                    {b.delta}
                  </span>
                </div>
              ))}
            </Card>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card
            pal={pal}
            pad={20}
            style={{
              background: pal.primary,
              color: pal.primaryInk,
              border: "none",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -20,
                top: -20,
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: pal.accent,
                opacity: 0.4,
                filter: "blur(28px)",
              }}
            />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  opacity: 0.85,
                  marginBottom: 10,
                }}
              >
                {t("Today's lesson")}
              </div>
              <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 4 }}>
                {t("Algebra")}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  marginBottom: 14,
                  lineHeight: 1.2,
                }}
              >
                {t("Quadratic equations")} — {t("Discriminant method")}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <Progress
                  value={62}
                  pal={pal}
                  color={pal.accent}
                  dark
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 12, fontWeight: 600 }}>62%</span>
              </div>
              <Link to="/app/chat" style={{ textDecoration: "none" }}>
                <Btn
                  pal={pal}
                  tone="accent"
                  size="md"
                  full
                  iconAfter={<Icon name="arrow-right" size={16} />}
                >
                  {t("Resume lesson")}
                </Btn>
              </Link>
            </div>
          </Card>

          <Card pal={pal} pad={18}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{t("Quick Battle")}</div>
                <div style={{ fontSize: 11, color: pal.muted }}>
                  {t("Find an opponent in 30s")}
                </div>
              </div>
              <Icon name="swords" size={20} color={pal.primary} />
            </div>
            <Link to="/app/battle" style={{ textDecoration: "none" }}>
              <Btn
                pal={pal}
                tone="primary"
                size="md"
                full
                icon={<Icon name="play" size={14} />}
              >
                {t("Match in Math")}
              </Btn>
            </Link>
          </Card>

          <Card pal={pal} pad={18}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700 }}>{t("Friends online")}</div>
              <span style={{ fontSize: 11, color: pal.muted }}>3 / 12</span>
            </div>
            {[
              { name: "Bekzod", elo: 1612 },
              { name: "Madina", elo: 1340 },
              { name: "Jasur", elo: 1455 },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                }}
              >
                <div style={{ position: "relative" }}>
                  <Avatar name={f.name} size={30} hue={[20, 320, 100][i]} />
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: pal.good,
                      border: `2px solid ${pal.surface}`,
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{f.name}</div>
                  <div
                    style={{
                      fontSize: 10,
                      color: pal.muted,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    ELO {f.elo}
                  </div>
                </div>
                <Btn pal={pal} tone="soft" size="sm">
                  {t("Challenge")}
                </Btn>
              </div>
            ))}
          </Card>

          <Card pal={pal} pad={18}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700 }}>
                {t("Tashkent · Math")}
              </div>
              <Link
                to="/app/leaderboard"
                style={{
                  fontSize: 11,
                  color: pal.primary,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                View →
              </Link>
            </div>
            {[
              { rank: 1, name: "Aziz K.", elo: 2104, you: false },
              { rank: 2, name: "Lola R.", elo: 1980, you: false },
              { rank: 3, name: "Otabek S.", elo: 1955, you: false },
              { rank: 47, name: t("You"), elo: 1487, you: true },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 8px",
                  borderRadius: 8,
                  background: r.you ? pal.primarySoft : "transparent",
                  marginBottom: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    width: 24,
                    color: r.rank <= 3 ? pal.accent : pal.muted,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  #{r.rank}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: r.you ? 700 : 500,
                    color: r.you ? pal.primary : pal.text,
                  }}
                >
                  {r.name}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: pal.muted,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {r.elo}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
