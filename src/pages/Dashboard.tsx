import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { Avatar, Btn, Card, Pill, Progress } from "@/components/ui/Primitives";
import { LangSwitcher } from "@/components/app/LangSwitcher";
import { useIsAtMostTablet, useIsMobile } from "@/hooks/useMediaQuery";
import {
  challengeFriend,
  getExamHistory,
  getNotifications,
  searchTopics,
  type ExamHistoryItem,
  type SubjectCode,
} from "@/lib/api";
import { labelForSubject } from "@/lib/examMode";

type SubjectFilter = SubjectCode | "ALL";

export default function Dashboard() {
  const t = useT();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isAtMostTablet = useIsAtMostTablet();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [challenging, setChallenging] = useState<string | null>(null);
  const [mockHistory, setMockHistory] = useState<ExamHistoryItem[]>([]);
  const [mockHistoryLoading, setMockHistoryLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("ALL");

  useEffect(() => {
    let live = true;
    setMockHistoryLoading(true);
    // Pull a larger window so the trend chart + per-subject filters have
    // enough data to look populated. The card still only renders the top 3.
    getExamHistory(25)
      .then((rows) => {
        if (live) setMockHistory(rows);
      })
      .catch(() => {
        if (live) setMockHistory([]);
      })
      .finally(() => {
        if (live) setMockHistoryLoading(false);
      });
    return () => {
      live = false;
    };
  }, []);

  // Subjects the user has actually attempted, in most-recent order — drives
  // the filter pills so we don't list subjects they've never touched.
  const subjectsInHistory = useMemo<SubjectCode[]>(() => {
    const seen = new Set<SubjectCode>();
    const ordered: SubjectCode[] = [];
    for (const h of mockHistory) {
      if (seen.has(h.subject)) continue;
      seen.add(h.subject);
      ordered.push(h.subject);
    }
    return ordered;
  }, [mockHistory]);

  // If the user picks a subject and then the filter would have no matches
  // after a refresh (e.g. all attempts for that subject were deleted), drop
  // back to ALL so the dashboard isn't blank.
  useEffect(() => {
    if (subjectFilter === "ALL") return;
    if (!subjectsInHistory.includes(subjectFilter)) {
      setSubjectFilter("ALL");
    }
  }, [subjectFilter, subjectsInHistory]);

  const filteredHistory = useMemo(() => {
    if (subjectFilter === "ALL") return mockHistory;
    return mockHistory.filter((h) => h.subject === subjectFilter);
  }, [mockHistory, subjectFilter]);

  // Graded attempts only — these are what the KPIs and trend chart pull from.
  // We sort ascending by submittedAt (oldest → newest) so the chart reads
  // left-to-right in time.
  const gradedSeries = useMemo(() => {
    return filteredHistory
      .filter((h) => h.status === "graded" && h.raschScore != null)
      .slice()
      .sort((a, b) => {
        const ta = a.submittedAt ?? a.startedAt;
        const tb = b.submittedAt ?? b.startedAt;
        return ta - tb;
      });
  }, [filteredHistory]);

  const latestGraded = gradedSeries[gradedSeries.length - 1] ?? null;
  const previousGraded = gradedSeries[gradedSeries.length - 2] ?? null;

  const raschValue = latestGraded?.raschScore ?? null;
  const raschDelta =
    latestGraded?.raschScore != null && previousGraded?.raschScore != null
      ? latestGraded.raschScore - previousGraded.raschScore
      : null;

  const masteryPct = useMemo(() => {
    // Average correctness across the user's last 5 graded attempts in scope.
    // Avoids one bad day tanking the headline number.
    const recent = gradedSeries.slice(-5);
    if (recent.length === 0) return null;
    const total = recent.reduce((acc, h) => acc + (h.totalQuestions || 0), 0);
    const correct = recent.reduce((acc, h) => acc + (h.totalCorrect || 0), 0);
    if (total === 0) return null;
    return Math.round((correct / total) * 100);
  }, [gradedSeries]);

  const subjectLabel =
    subjectFilter === "ALL" ? t("All subjects") : t(labelForSubject(subjectFilter));
  const battleSubject: SubjectCode =
    subjectFilter === "ALL" ? "MATH" : subjectFilter;

  const handleSearchChange = async (v: string) => {
    setSearch(v);
    if (!v.trim()) {
      setSearchResults([]);
      return;
    }
    const res = await searchTopics(v);
    setSearchResults(res.topics);
  };

  const handleBell = async () => {
    const notes = await getNotifications();
    const unread = notes.filter((n) => !n.read);
    const first = unread[0] ?? notes[0];
    if (!first) {
      toast.info(t("No notifications"));
      return;
    }
    toast(first.title, { description: first.body });
  };

  const handleChallenge = async (friendName: string) => {
    if (challenging) return;
    setChallenging(friendName);
    try {
      await challengeFriend(friendName, battleSubject);
      navigate("/app/battle/matchmaking", {
        state: {
          subject: battleSubject,
          mode: "friend",
          opponentId: friendName,
          opponentName: friendName,
        },
      });
    } catch {
      toast.error(t("Could not send challenge."));
    } finally {
      setChallenging(null);
    }
  };

  const formatDelta = (n: number | null): string => {
    if (n == null) return "—";
    const sign = n > 0 ? "+" : "";
    return `${sign}${n.toFixed(1)}`;
  };

  const kpis = [
    {
      label: t("Rasch score"),
      value: raschValue != null ? raschValue.toFixed(1) : "—",
      sub:
        latestGraded != null
          ? `${t(latestGraded.subjectLabel)} · ${t("latest mock")}`
          : `${subjectLabel} · ${t("no mocks yet")}`,
      delta: formatDelta(raschDelta),
      deltaPositive: raschDelta == null ? null : raschDelta >= 0,
    },
    {
      label: t("Topic mastery"),
      value: masteryPct != null ? `${masteryPct}%` : "—",
      sub:
        gradedSeries.length > 0
          ? `${gradedSeries.length} ${t("graded mocks")}`
          : t("Take a mock to populate"),
      delta: null,
      deltaPositive: null,
    },
    {
      label: t("Battle ELO"),
      value: "1487",
      sub: t("Silver tier"),
      delta: "+18",
      deltaPositive: true,
    },
    {
      label: t("Study streak"),
      value: "12d",
      sub: `${t("best")} 17d`,
      delta: `${t("Today")} ✓`,
      deltaPositive: true,
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
          padding: isMobile ? "14px 16px" : "20px 32px",
          borderBottom: `1px solid ${pal.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: pal.bg,
          gap: 12,
          flexWrap: "wrap",
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
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {!isMobile && (
            <div style={{ position: "relative" }}>
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
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t("Search topics…")}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 12,
                    color: pal.text,
                    fontFamily: "inherit",
                    width: 160,
                  }}
                />
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
              {searchResults.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    background: pal.surface,
                    border: `1px solid ${pal.line}`,
                    borderRadius: 12,
                    boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
                    zIndex: 30,
                    overflow: "hidden",
                  }}
                >
                  {searchResults.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setSearchResults([]);
                        navigate("/app/chat");
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 12px",
                        background: "transparent",
                        border: "none",
                        fontSize: 13,
                        color: pal.text,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <Pill
            pal={pal}
            tone="accentSoft"
            icon={<Icon name="flame" size={13} />}
          >
            {t("12 day streak")}
          </Pill>
          <LangSwitcher />
          <button
            type="button"
            onClick={handleBell}
            aria-label="Notifications"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: pal.surface,
              border: `1px solid ${pal.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Icon name="bell" size={16} />
          </button>
        </div>
      </div>

      <div
        style={{
          padding: isMobile ? "16px" : "24px 32px",
          display: "grid",
          gridTemplateColumns: isAtMostTablet ? "1fr" : "1fr 340px",
          gap: 20,
        }}
      >
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Subject filter pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: pal.muted,
                marginRight: 4,
              }}
            >
              {t("Subject")}
            </span>
            {(["ALL", ...subjectsInHistory] as SubjectFilter[]).map((s) => {
              const active = s === subjectFilter;
              const label = s === "ALL" ? t("All") : t(labelForSubject(s));
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubjectFilter(s)}
                  style={{
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    padding: "5px 12px",
                    borderRadius: 999,
                    border: `1px solid ${active ? pal.primary : pal.line}`,
                    background: active ? pal.primarySoft : pal.surface,
                    color: active ? pal.primary : pal.text,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "repeat(2, 1fr)"
                : isAtMostTablet
                  ? "repeat(4, 1fr)"
                  : "repeat(4, 1fr)",
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
                  {k.delta != null && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color:
                          k.deltaPositive == null
                            ? pal.muted
                            : k.deltaPositive
                              ? pal.good
                              : pal.bad,
                      }}
                    >
                      {k.delta}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Score trend */}
          <Card pal={pal} pad={20}>
            <ScoreTrend
              t={t}
              series={gradedSeries.slice(-8)}
              latest={latestGraded}
              delta={raschDelta}
              subjectLabel={subjectLabel}
            />
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
                  {subjectLabel} · 22 {t("topics · darker = stronger")}
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
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
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
                <div style={{ fontSize: 14, fontWeight: 700 }}>
                  {t("Recent mocks")}
                  {subjectFilter !== "ALL" && (
                    <span style={{ fontSize: 11, color: pal.muted, marginLeft: 6, fontWeight: 500 }}>
                      · {subjectLabel}
                    </span>
                  )}
                </div>
                <Link
                  to="/app/exam"
                  style={{
                    fontSize: 12,
                    color: pal.primary,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {t("See all")}
                </Link>
              </div>
              {mockHistoryLoading ? (
                <div style={{ fontSize: 12, color: pal.muted, padding: "10px 0" }}>
                  {t("Loading…")}
                </div>
              ) : filteredHistory.length === 0 ? (
                <div
                  style={{
                    fontSize: 12,
                    color: pal.muted,
                    padding: "10px 0",
                    lineHeight: 1.5,
                  }}
                >
                  {subjectFilter === "ALL"
                    ? t("No mocks yet. Finish one and your score will appear here.")
                    : t("No mocks for this subject yet.")}
                </div>
              ) : (
                filteredHistory.slice(0, 3).map((h, i) => {
                  const when = h.submittedAt ?? h.startedAt;
                  const dateLabel = new Date(when).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  });
                  const kindLabel =
                    h.kind === "full_mock"
                      ? t("Full mock")
                      : h.kind === "diagnostic"
                        ? t("Diagnostic")
                        : t("Checkpoint");
                  const name = `${kindLabel} · ${t(h.subjectLabel)}`;
                  const scoreText =
                    h.status === "graded" && h.raschScore != null
                      ? h.raschScore.toFixed(1)
                      : h.status === "graded"
                        ? `${h.totalCorrect}/${h.totalQuestions}`
                        : h.status === "in_progress"
                          ? t("in progress")
                          : t(h.status);
                  const clickable = h.status === "graded";
                  return (
                    <button
                      key={h.id}
                      type="button"
                      disabled={!clickable}
                      onClick={() => {
                        if (!clickable) return;
                        navigate("/app/exam/result", {
                          state: { sessionId: h.id, subject: h.subject },
                        });
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 0",
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        borderTop: i > 0 ? `1px solid ${pal.line}` : "none",
                        textAlign: "left",
                        fontFamily: "inherit",
                        cursor: clickable ? "pointer" : "default",
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
                          flexShrink: 0,
                        }}
                      >
                        <Icon name="book" size={14} color={pal.muted} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {name}
                        </div>
                        <div style={{ fontSize: 11, color: pal.muted }}>
                          {dateLabel}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            fontFamily: '"JetBrains Mono", monospace',
                          }}
                        >
                          {scoreText}
                        </div>
                        <div style={{ fontSize: 10, color: pal.muted }}>
                          {h.grade ?? "—"}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
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
                <Link
                  to="/app/battle"
                  style={{
                    fontSize: 12,
                    color: pal.primary,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {t("See all")}
                </Link>
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
            <Btn
              pal={pal}
              tone="primary"
              size="md"
              full
              icon={<Icon name="play" size={14} />}
              onClick={() =>
                navigate("/app/battle/matchmaking", {
                  state: { subject: battleSubject, mode: "ranked" },
                })
              }
            >
              {t("Match in")} {t(labelForSubject(battleSubject))}
            </Btn>
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
                <Btn
                  pal={pal}
                  tone="soft"
                  size="sm"
                  onClick={() => handleChallenge(f.name)}
                >
                  {challenging === f.name ? t("Starting…") : t("Challenge")}
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
                {t("Tashkent")} · {subjectLabel}
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

type ScoreTrendProps = {
  t: (k: string) => string;
  series: ExamHistoryItem[];
  latest: ExamHistoryItem | null;
  delta: number | null;
  subjectLabel: string;
};

function ScoreTrend({ t, series, latest, delta, subjectLabel }: ScoreTrendProps) {
  const scores = series
    .map((h) => h.raschScore)
    .filter((s): s is number => s != null);
  // Pad with a flat baseline if we don't have at least two points — the
  // chart still needs to render something meaningful for a brand-new user.
  const points = scores.length >= 2 ? scores : scores.length === 1 ? [scores[0], scores[0]] : [];
  const W = 600;
  const H = 140;
  const padL = 0;
  const padR = 0;
  const padT = 16;
  const padB = 24;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const min = points.length ? Math.min(...points, 40) : 40;
  const max = points.length ? Math.max(...points, 80) : 80;
  const range = Math.max(1, max - min);
  const coords = points.map((v, i) => {
    const x = points.length === 1 ? padL + innerW : padL + (i * innerW) / (points.length - 1);
    const y = padT + innerH - ((v - min) / range) * innerH;
    return { x, y };
  });
  const linePath =
    coords.length === 0
      ? ""
      : coords.reduce(
          (acc, p, i) => acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`),
          "",
        );
  const areaPath = linePath
    ? `${linePath} L ${coords[coords.length - 1].x} ${H} L ${coords[0].x} ${H} Z`
    : "";
  const targetY = padT + innerH - ((60 - min) / range) * innerH;

  const deltaText =
    delta == null
      ? t("No prior mock to compare")
      : `${delta >= 0 ? "+" : ""}${delta.toFixed(1)} ${t("vs prev mock")}`;

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: pal.muted, marginBottom: 2 }}>
            {t("Rasch score · last")} {series.length} {t("mocks")}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              {latest?.raschScore != null ? latest.raschScore.toFixed(1) : "—"}
            </span>
            <Pill
              pal={pal}
              tone={delta == null ? "outline" : delta >= 0 ? "good" : "bad"}
            >
              {deltaText}
            </Pill>
          </div>
        </div>
        <Pill pal={pal} tone="primary">
          {subjectLabel}
        </Pill>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H }}>
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1="0"
            x2={W}
            y1={i * 35 + 10}
            y2={i * 35 + 10}
            stroke={pal.line}
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        ))}
        {points.length > 0 && targetY > padT && targetY < H - padB && (
          <>
            <line
              x1="0"
              x2={W}
              y1={targetY}
              y2={targetY}
              stroke={pal.accent}
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
            <text
              x={W - 5}
              y={targetY - 5}
              textAnchor="end"
              fontSize="10"
              fill={pal.accent}
              fontWeight="600"
            >
              {t("B+ target · 60")}
            </text>
          </>
        )}
        {points.length === 0 ? (
          <text
            x={W / 2}
            y={H / 2}
            textAnchor="middle"
            fontSize="12"
            fill={pal.muted}
          >
            {t("Take a mock to see your trend.")}
          </text>
        ) : (
          <>
            <defs>
              <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={pal.primary} stopOpacity="0.25" />
                <stop offset="100%" stopColor={pal.primary} stopOpacity="0" />
              </linearGradient>
            </defs>
            {areaPath && <path d={areaPath} fill="url(#area)" />}
            <path d={linePath} fill="none" stroke={pal.primary} strokeWidth="2.5" />
            {coords.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={i === coords.length - 1 ? 5 : 3}
                fill={pal.surface}
                stroke={pal.primary}
                strokeWidth="2"
              />
            ))}
            {coords.map((p, i) => (
              <text
                key={`l-${i}`}
                x={p.x}
                y={H - 6}
                textAnchor="middle"
                fontSize="10"
                fill={pal.muted}
              >
                {i === coords.length - 1 ? t("Now") : `#${i + 1}`}
              </text>
            ))}
          </>
        )}
      </svg>
    </>
  );
}
