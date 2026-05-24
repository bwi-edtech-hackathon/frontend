import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Avatar, Btn, Card, Pill } from "@/components/ui/Primitives";
import { useIsAtMostTablet, useIsMobile } from "@/hooks/useMediaQuery";
import {
  findRankedMatch,
  getLeaderboard,
  type LeaderboardRow,
  type LeaderboardScope,
  type SubjectCode,
} from "@/lib/api";

const SUBJECTS: { code: SubjectCode; label: string }[] = [
  { code: "MATH", label: "Mathematics" },
  { code: "PHYS", label: "Physics" },
  { code: "CHEM", label: "Chemistry" },
  { code: "BIO", label: "Biology" },
  { code: "UZB_LIT", label: "Uzbek lit" },
];

type Row = LeaderboardRow;

function TopThree({ rows }: { rows: Row[] }) {
  if (rows.length < 3) {
    // Not enough rows in this scope — skip the podium so the layout doesn't
    // look broken.
    return null;
  }
  const first = rows[0];
  const second = rows[1];
  const third = rows[2];
  const top = [
    { rank: 2, name: second.name, elo: second.elo, hue: 320, h: 90 },
    { rank: 1, name: first.name, elo: first.elo, hue: 20, h: 120 },
    { rank: 3, name: third.name, elo: third.elo, hue: 200, h: 70 },
  ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 18,
        marginBottom: 20,
      }}
    >
      {top.map((t) => (
        <div
          key={t.rank}
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            name={t.name}
            size={t.rank === 1 ? 64 : 52}
            hue={t.hue}
            ring={t.rank === 1 ? pal.accent : "transparent"}
          />
          {t.rank === 1 && (
            <div style={{ marginTop: -6, marginBottom: 4 }}>
              <Icon name="crown" size={20} color={pal.accent} />
            </div>
          )}
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              marginTop: t.rank === 1 ? 0 : 8,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontSize: 11,
              color: pal.muted,
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            ELO {t.elo}
          </div>
          <div
            style={{
              width: 84,
              height: t.h,
              marginTop: 10,
              borderRadius: "12px 12px 0 0",
              background: t.rank === 1 ? pal.primary : pal.surfaceAlt,
              border: t.rank === 1 ? "none" : `1px solid ${pal.line}`,
              color: t.rank === 1 ? pal.primaryInk : pal.text,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            {t.rank}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Leaderboard() {
  const t = useT();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isAtMostTablet = useIsAtMostTablet();
  const [scope, setScope] = useState<LeaderboardScope>("global");
  const [subject, setSubject] = useState<SubjectCode>("MATH");
  const [rows, setRows] = useState<Row[]>([]);
  const [you, setYou] = useState<Row | null>(null);
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    let live = true;
    getLeaderboard(scope, subject).then((data) => {
      if (!live) return;
      setRows(data.rows);
      setYou(data.you);
    });
    return () => {
      live = false;
    };
  }, [scope, subject]);

  const handleQuickMatch = async () => {
    if (matching) return;
    setMatching(true);
    try {
      const m = await findRankedMatch(subject);
      navigate("/app/battle/matchmaking", {
        state: {
          subject,
          mode: "ranked",
          opponentId: m.opponentId,
          opponentName: m.opponentName,
        },
      });
    } catch {
      toast.error(t("Could not find a match."));
    } finally {
      setMatching(false);
    }
  };

  const tabs: { id: LeaderboardScope; label: string; icon: IconName }[] = [
    { id: "global", label: t("Global"), icon: "globe" },
    { id: "weekly", label: t("This week"), icon: "clock" },
    { id: "friends", label: t("Friends"), icon: "users" },
    { id: "region", label: t("Tashkent"), icon: "map" },
    { id: "school", label: t("My school"), icon: "shield" },
  ];

  return (
    <div>
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
            {t("Battle")}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? 20 : 24,
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            {t("Leaderboard")}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SUBJECTS.map((s) => {
            const on = s.code === subject;
            return (
              <button
                key={s.code}
                type="button"
                onClick={() => setSubject(s.code)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: `1px solid ${on ? pal.primary : pal.line}`,
                  background: on ? pal.primary : "transparent",
                  color: on ? pal.primaryInk : pal.text,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {t(s.label)}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          padding: isMobile ? "16px" : "24px 32px",
          display: "grid",
          gridTemplateColumns: isAtMostTablet ? "1fr" : "1fr 320px",
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 20,
              borderBottom: `1px solid ${pal.line}`,
            }}
          >
            {tabs.map((tab) => {
              const active = tab.id === scope;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setScope(tab.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 14px",
                    fontSize: 13,
                    fontWeight: active ? 700 : 500,
                    color: active ? pal.primary : pal.muted,
                    borderBottom: `2px solid ${active ? pal.primary : "transparent"}`,
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    background: "transparent",
                    marginBottom: -1,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <Icon name={tab.icon} size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <TopThree rows={rows} />

          <Card pal={pal} pad={0}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "44px 1fr 80px"
                  : "60px 1fr 110px 100px 80px",
                padding: "12px 18px",
                borderBottom: `1px solid ${pal.line}`,
                fontSize: 11,
                fontWeight: 700,
                color: pal.muted,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <span>{t("Rank")}</span>
              <span>{t("Student")}</span>
              <span style={{ textAlign: "right" }}>ELO</span>
              {!isMobile && <span style={{ textAlign: "right" }}>W / L</span>}
              {!isMobile && <span style={{ textAlign: "right" }}>{t("Streak")}</span>}
            </div>
            {rows.map((r, i) => (
              <div
                key={r.rank}
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                  ? "44px 1fr 80px"
                  : "60px 1fr 110px 100px 80px",
                  padding: "14px 18px",
                  borderBottom:
                    i < rows.length - 1 ? `1px solid ${pal.line}` : "none",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: r.rank <= 3 ? pal.accent : pal.muted,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  #{r.rank}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Avatar name={r.name} size={32} hue={(i * 47) % 360} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: 11, color: pal.muted }}>
                      {r.school}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    textAlign: "right",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {r.elo}
                </span>
                {!isMobile && (
                  <span
                    style={{
                      textAlign: "right",
                      fontSize: 12,
                      color: pal.muted,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    <span style={{ color: pal.good }}>{r.w}</span>
                    <span> · </span>
                    <span style={{ color: pal.bad }}>{r.l}</span>
                  </span>
                )}
                {!isMobile && (
                  <span
                    style={{
                      textAlign: "right",
                      fontSize: 12,
                      fontWeight: 600,
                      color: r.streak > 0 ? pal.accent : pal.muted,
                    }}
                  >
                    {r.streak > 0 ? r.streak : "—"}
                    {r.streak > 0 && (
                      <span style={{ marginLeft: 2 }}>
                        <Icon name="flame" size={12} color={pal.accent} />
                      </span>
                    )}
                  </span>
                )}
              </div>
            ))}
            <div
              style={{
                height: 1,
                background: pal.line,
                margin: "4px 18px",
              }}
            />
            {you && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "44px 1fr 80px"
                    : "60px 1fr 110px 100px 80px",
                  padding: "14px 18px",
                  alignItems: "center",
                  background: pal.primarySoft,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: pal.primary,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  #{you.rank}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Avatar name={you.name} size={32} hue={20} ring={pal.primary} />
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: pal.primary,
                      }}
                    >
                      {t("You")} · {you.name}
                    </div>
                    <div style={{ fontSize: 11, color: pal.muted }}>
                      {you.school}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    textAlign: "right",
                    fontSize: 14,
                    fontWeight: 700,
                    color: pal.primary,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {you.elo}
                </span>
                {!isMobile && (
                  <span
                    style={{
                      textAlign: "right",
                      fontSize: 12,
                      color: pal.muted,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    <span style={{ color: pal.good }}>{you.w}</span> ·{" "}
                    <span style={{ color: pal.bad }}>{you.l}</span>
                  </span>
                )}
                {!isMobile && (
                  <span
                    style={{
                      textAlign: "right",
                      fontSize: 12,
                      fontWeight: 600,
                      color: pal.accent,
                    }}
                  >
                    {you.streak}{" "}
                    <Icon name="flame" size={12} color={pal.accent} />
                  </span>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Right rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card pal={pal} pad={20}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: pal.muted,
                marginBottom: 8,
              }}
            >
              {t("Your rank")}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                #{you?.rank ?? "—"}
              </span>
              <Pill pal={pal} tone="good">
                <Icon name="arrow-up" size={11} /> 5
              </Pill>
            </div>
            <div style={{ fontSize: 12, color: pal.muted }}>
              {t("of 8,412 students in")}{" "}
              {t(
                SUBJECTS.find((s) => s.code === subject)?.label ?? "Mathematics",
              )}{" "}
              ·{" "}
              {t(
                scope === "global"
                  ? "Global"
                  : scope === "weekly"
                    ? "This week"
                    : scope === "friends"
                      ? "Friends"
                      : scope === "region"
                        ? "Tashkent"
                        : "My school",
              )}
            </div>
            <div
              style={{
                height: 1,
                background: pal.line,
                margin: "14px 0",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: pal.muted }}>ELO</div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {you?.elo ?? "—"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: pal.muted }}>
                  {t("Peak")}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  1521
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: pal.muted }}>
                  {t("Tier")}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {t("Silver")}
                </div>
              </div>
            </div>
          </Card>

          <Card pal={pal} pad={20}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              {t("Weekly reset in")}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              3d 14h
            </div>
            <div
              style={{ fontSize: 12, color: pal.muted, marginTop: 4 }}
            >
              {t("Monday 00:00 Tashkent time")}
            </div>
            <div
              style={{
                height: 1,
                background: pal.line,
                margin: "14px 0",
              }}
            />
            <div
              style={{ fontSize: 12, color: pal.muted, marginBottom: 8 }}
            >
              {t("This week's prize pool")}
            </div>
            <Pill
              pal={pal}
              tone="accentSoft"
              icon={<Icon name="trophy" size={13} />}
            >
              {t("Top 10 · Premium month")}
            </Pill>
          </Card>

          <Card
            pal={pal}
            pad={20}
            style={{ background: pal.surfaceAlt }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
              {t("Climb faster")}
            </div>
            <div
              style={{
                fontSize: 12,
                color: pal.muted,
                marginBottom: 12,
              }}
            >
              {t("You're 8 wins from Gold tier (1600)")}
            </div>
            <Btn
              pal={pal}
              tone="primary"
              size="md"
              full
              icon={<Icon name="swords" size={14} />}
              onClick={handleQuickMatch}
            >
              {matching ? t("Finding opponent…") : t("Quick Match")}
            </Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}
