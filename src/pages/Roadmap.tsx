import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { Btn, Card, Pill, Progress } from "@/components/ui/Primitives";
import { useIsAtMostTablet, useIsMobile } from "@/hooks/useMediaQuery";
import {
  getExamHistory,
  getRoadmap,
  regenerateRoadmap,
  type ExamHistoryItem,
  type Roadmap as RoadmapData,
  type RoadmapMilestone,
  type SubjectCode,
} from "@/lib/api";

type NodeState = "done" | "active" | "locked";
type NodeMeta = "event" | "checkpoint" | "goal" | "topic" | undefined;

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

// SubjectCode → display label / short tag for the pill row + header.
const SUBJECT_LABELS: Record<SubjectCode, { full: string; short: string }> = {
  MATH:    { full: "Mathematics",          short: "Math" },
  PHYS:    { full: "Physics",              short: "Physics" },
  CHEM:    { full: "Chemistry",            short: "Chem" },
  BIO:     { full: "Biology",              short: "Bio" },
  HIST:    { full: "History",              short: "History" },
  GEOG:    { full: "Geography",            short: "Geo" },
  UZB_LIT: { full: "Uzbek language & lit.", short: "Uzbek" },
  RUS_LIT: { full: "Russian lit.",         short: "Russian" },
  KAR_LIT: { full: "Karakalpak lit.",      short: "Karakalpak" },
};

const SUBJECT_ORDER: SubjectCode[] = [
  "MATH", "PHYS", "CHEM", "BIO", "HIST", "GEOG", "UZB_LIT", "RUS_LIT",
];

/** Map a milestone's API status onto the visual node state. The roadmap uses
 * four buckets server-side (mastered/in_progress/active/locked) — collapse
 * "in_progress" + "active" into a single "active" pill so the constellation
 * stays readable. */
function statusToState(status: RoadmapMilestone["status"]): NodeState {
  if (status === "mastered") return "done";
  if (status === "locked") return "locked";
  return "active";
}

// Lane rows reserve row index 2 (vertical center) for the diagnostic / final
// mock / exam events so the spines run above and below them. With three lanes
// we get a clean top / middle / bottom constellation.
const LANE_ROW: Record<number, number> = { 0: 0, 1: 2, 2: 4 };
const LANE_COUNT = 3;

/** Lay the milestones out on the (week, row) grid using the lane assigned by
 * the generator. If two milestones land on the same (week, lane) we nudge
 * the second one onto the adjacent free row so they don't overlap. */
function layoutMilestones(milestones: RoadmapMilestone[]): RNode[] {
  const taken = new Set<string>(); // `${week}:${row}`
  const nudgeOrder = [0, 1, -1, 2, -2];
  return milestones.map((m) => {
    const week = m.weekBucket;
    const lane = Math.max(0, Math.min(LANE_COUNT - 1, m.lane ?? 0));
    const base = LANE_ROW[lane] ?? 0;
    let row = base;
    for (const dy of nudgeOrder) {
      const candidate = base + dy;
      if (candidate < 0 || candidate > 5) continue;
      const key = `${week}:${candidate}`;
      if (!taken.has(key)) {
        row = candidate;
        taken.add(key);
        break;
      }
    }
    return {
      id: m.topicId,
      week,
      row,
      name: m.topicNameEn,
      mastery: Math.round(m.masteryPct),
      state: statusToState(m.status),
      meta: "topic",
    };
  });
}

/** Build edges so each lane reads as its own spine. Within a lane we chain
 * sequentially (by `order`), and we add lightweight cross-lane handoffs
 * from the last node of the prior week to the first node of each lane in
 * the next week — that's what gives the constellation a real "branched"
 * silhouette instead of a single zigzag. */
function buildEdges(
  topicNodes: RNode[],
  milestones: RoadmapMilestone[],
): { edges: [string, string][]; spineHeads: string[]; spineTails: string[] } {
  const byId = new Map(milestones.map((m) => [m.topicId, m]));
  const nodesByLane: Record<number, RNode[]> = { 0: [], 1: [], 2: [] };
  for (const n of topicNodes) {
    const lane = byId.get(n.id)?.lane ?? 0;
    const clamped = Math.max(0, Math.min(LANE_COUNT - 1, lane));
    nodesByLane[clamped].push(n);
  }
  // Sort each lane by week then order to get a clean left-to-right spine.
  for (const lane of Object.keys(nodesByLane)) {
    nodesByLane[Number(lane)].sort((a, b) => {
      if (a.week !== b.week) return a.week - b.week;
      const oa = byId.get(a.id)?.order ?? 0;
      const ob = byId.get(b.id)?.order ?? 0;
      return oa - ob;
    });
  }

  const edges: [string, string][] = [];
  for (let lane = 0; lane < LANE_COUNT; lane++) {
    const chain = nodesByLane[lane];
    for (let i = 1; i < chain.length; i++) {
      edges.push([chain[i - 1].id, chain[i].id]);
    }
  }

  // Cross-lane handoffs — connect the first non-empty lane's spine to any
  // lanes that *start* later than week 1 so the diagnostic doesn't dangle.
  const spineHeads: string[] = [];
  const spineTails: string[] = [];
  for (let lane = 0; lane < LANE_COUNT; lane++) {
    const chain = nodesByLane[lane];
    if (chain.length > 0) {
      spineHeads.push(chain[0].id);
      spineTails.push(chain[chain.length - 1].id);
    }
  }
  return { edges, spineHeads, spineTails };
}

export default function Roadmap() {
  const t = useT();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isAtMostTablet = useIsAtMostTablet();
  const [regenerating, setRegenerating] = useState(false);
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);
  const [activeSubject, setActiveSubject] = useState<SubjectCode>("MATH");
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);

  useEffect(() => {
    let live = true;
    getExamHistory(10)
      .then((rows) => {
        if (!live) return;
        setHistory(rows);
        // Default to the subject of the most recent graded mock (if any).
        const recent = rows.find(
          (r) => r.status === "graded" && r.raschScore != null,
        );
        if (recent) setActiveSubject(recent.subject);
      })
      .catch(() => {
        /* keep empty list */
      });
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    let live = true;
    setLoadingRoadmap(true);
    getRoadmap(activeSubject)
      .then((rm) => {
        if (live) setRoadmap(rm);
      })
      .catch(() => {
        if (live) setRoadmap(null);
      })
      .finally(() => {
        if (live) setLoadingRoadmap(false);
      });
    return () => {
      live = false;
    };
  }, [activeSubject]);

  const gradedMocks = history.filter(
    (h) => h.status === "graded" && h.raschScore != null,
  );

  const handleRegenerate = async () => {
    if (regenerating) return;
    setRegenerating(true);
    try {
      // Regenerate only the visible subject — the user can switch tabs to
      // refresh others. Re-fetch immediately so the UI reflects the new plan.
      await regenerateRoadmap(activeSubject);
      const rm = await getRoadmap(activeSubject);
      setRoadmap(rm);
      toast.success(t("Roadmap updated — sequenced around your latest mock."));
    } catch {
      toast.error(t("Could not regenerate roadmap. Try again."));
    } finally {
      setRegenerating(false);
    }
  };

  const milestones = roadmap?.milestones ?? [];
  const weeksTotal = roadmap?.weeksTotal ?? 6;

  // ── Build the constellation nodes + edges from milestones ──────────────────
  const { nodes, edges } = useMemo(() => {
    const topicNodes = layoutMilestones(milestones);
    // Decorative timeline events live on the center row (row 2) so they sit
    // between the top and bottom spines without colliding with either.
    const EVENT_ROW = 2;
    const diagnostic: RNode = {
      id: "_diag",
      week: 0,
      row: EVENT_ROW,
      name: t("Diagnostic"),
      mastery: 100,
      state: gradedMocks.length > 0 ? "done" : "active",
      meta: "event",
    };
    const finalMockWeek = weeksTotal;
    const examWeek = weeksTotal + 1;
    const finalMock: RNode = {
      id: "_mock",
      week: finalMockWeek,
      row: EVENT_ROW,
      name: t("Final mock"),
      mastery: 0,
      state: "locked",
      meta: "event",
    };
    const exam: RNode = {
      id: "_exam",
      week: examWeek,
      row: EVENT_ROW,
      name: t("BMBA exam"),
      mastery: 0,
      state: "locked",
      meta: "goal",
    };
    const allNodes = [diagnostic, ...topicNodes, finalMock, exam];
    const { edges: topicEdges, spineHeads, spineTails } = buildEdges(
      topicNodes,
      milestones,
    );
    // Fan the diagnostic out to every spine's first node so each lane reads
    // as its own branch from the start; then funnel every spine's last node
    // into the final mock so the convergence is visually explicit.
    const events: [string, string][] = [];
    for (const head of spineHeads) events.push([diagnostic.id, head]);
    for (const tail of spineTails) events.push([tail, finalMock.id]);
    events.push([finalMock.id, exam.id]);
    return { nodes: allNodes, edges: [...topicEdges, ...events] };
  }, [milestones, weeksTotal, t, gradedMocks.length]);

  const handleNodeClick = (id: string, state: NodeState, meta: NodeMeta) => {
    if (state === "locked") {
      toast.info(t("Locked — finish the preceding checkpoint to unlock."));
      return;
    }
    if (meta === "event" && id === "_diag") {
      navigate("/app/exam/result");
      return;
    }
    if (meta === "event" || meta === "checkpoint" || meta === "goal") {
      navigate("/app/exam");
      return;
    }
    navigate("/app/chat");
  };

  // ── Grid sizing — adapts to the number of week columns we actually render ──
  const COL_W = 200;
  const ROW_H = 110;
  const COLS = weeksTotal + 2; // diagnostic + study weeks + final mock + exam
  const ROWS = 5;
  const SVG_W = COLS * COL_W + 80;
  const SVG_H = ROWS * ROW_H + 80;
  const posOf = (week: number, row: number) => ({
    x: 40 + week * COL_W + COL_W / 2,
    y: 40 + row * ROW_H + ROW_H / 2,
  });

  const counts = useMemo(() => {
    const c = { done: 0, active: 0, locked: 0 };
    for (const m of milestones) {
      const s = statusToState(m.status);
      if (s === "done") c.done += 1;
      else if (s === "active") c.active += 1;
      else c.locked += 1;
    }
    return c;
  }, [milestones]);

  // Today's "Resume lesson" card highlights the first non-locked, non-mastered
  // milestone — falls back gracefully when the roadmap has none.
  const todayMilestone = milestones.find((m) => statusToState(m.status) === "active");
  const todayLabel = todayMilestone?.topicNameEn ?? t("Pick a topic to begin");

  const subjectLabel = SUBJECT_LABELS[activeSubject]?.full ?? activeSubject;

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
            {subjectLabel} · {weeksTotal}-{t("week plan")}
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
          {roadmap?.onTrack && (
            <Pill
              pal={pal}
              tone="primarySoft"
              icon={<Icon name="flag" size={12} />}
            >
              {t("On track")}
            </Pill>
          )}
          <Btn
            pal={pal}
            tone="outline"
            size="md"
            icon={<Icon name="sparkle" size={14} />}
            onClick={handleRegenerate}
          >
            {regenerating ? t("Updating…") : t("Regenerate roadmap")}
          </Btn>
        </div>
      </div>

      {/* Subject tabs */}
      <div
        style={{
          padding: isMobile ? "12px 16px" : "12px 32px",
          borderBottom: `1px solid ${pal.line}`,
          display: "flex",
          gap: 8,
          overflowX: "auto",
        }}
      >
        {SUBJECT_ORDER.map((code) => {
          const active = code === activeSubject;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setActiveSubject(code)}
              style={{
                appearance: "none",
                border: `1px solid ${active ? pal.primary : pal.line}`,
                background: active ? pal.primary : pal.surface,
                color: active ? pal.primaryInk : pal.text,
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              {SUBJECT_LABELS[code]?.short ?? code}
            </button>
          );
        })}
      </div>

      {/* Progress strip — one slot per study week + the diagnostic / mock / exam */}
      <div
        style={{
          padding: isMobile ? "12px 16px" : "14px 32px",
          background: pal.surface,
          borderBottom: `1px solid ${pal.line}`,
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: 8,
          overflowX: "auto",
        }}
      >
        {Array.from({ length: COLS }).map((_, idx) => {
          const w = idx; // 0..COLS-1
          let label: string;
          if (w === 0) label = t("Diagnostic");
          else if (w === COLS - 2) label = t("Final mock");
          else if (w === COLS - 1) label = t("BMBA exam");
          else label = `${t("Week")} ${w}`;
          const weekNodes = nodes.filter((n) => n.week === w);
          const masteredHere =
            weekNodes.length > 0 &&
            weekNodes.every((n) => n.state === "done" || n.meta);
          const hasActive = weekNodes.some((n) => n.state === "active");
          const state: NodeState = hasActive
            ? "active"
            : masteredHere && weekNodes.some((n) => n.state === "done")
              ? "done"
              : "locked";
          return (
            <div key={w} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: state === "active" ? pal.accent : pal.muted,
                  marginBottom: 4,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  height: 4,
                  borderRadius: 999,
                  background:
                    state === "done"
                      ? pal.primary
                      : state === "active"
                        ? pal.accent
                        : pal.line,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Constellation */}
      <div style={{ padding: 24, overflowX: "auto", overflowY: "hidden" }}>
        {loadingRoadmap ? (
          <div
            style={{
              minHeight: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: pal.muted,
              fontSize: 13,
            }}
          >
            {t("Loading your roadmap…")}
          </div>
        ) : milestones.length === 0 ? (
          <div
            style={{
              minHeight: 280,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: pal.muted,
              fontSize: 13,
              padding: 16,
              textAlign: "center",
            }}
          >
            {t(
              "No topics seeded for this subject yet. Try regenerating, or take a mock exam.",
            )}
          </div>
        ) : (
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
              return (
                <div
                  key={n.id}
                  onClick={() => handleNodeClick(n.id, n.state, n.meta)}
                  style={{
                    position: "absolute",
                    left: p.x - size / 2,
                    top: p.y - (isEvent ? 30 : 40),
                    width: size,
                    cursor: "pointer",
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
                              : t("Locked")}
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
        )}
      </div>

      {/* Mock exam results */}
      <div
        style={{
          padding: isMobile ? "0 16px 16px" : "0 32px 16px",
        }}
      >
        <Card pal={pal} pad={20}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: pal.muted,
                }}
              >
                {t("Mock exam results")}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: pal.muted,
                  marginTop: 2,
                }}
              >
                {t("Your scores from completed mocks — tap to reopen the report.")}
              </div>
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
              {t("Start new mock")} →
            </Link>
          </div>
          {gradedMocks.length === 0 ? (
            <div
              style={{
                fontSize: 12,
                color: pal.muted,
                padding: "8px 0",
                lineHeight: 1.5,
              }}
            >
              {t(
                "No graded mocks yet. After you submit one, the score will land here.",
              )}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 10,
              }}
            >
              {gradedMocks.slice(0, 6).map((h) => {
                const submitted = h.submittedAt ?? h.startedAt;
                const dateLabel = new Date(submitted).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric" },
                );
                const scoreColor =
                  (h.raschScore ?? 0) >= 60
                    ? pal.primary
                    : (h.raschScore ?? 0) >= 46
                      ? pal.text
                      : pal.bad;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() =>
                      navigate("/app/exam/result", {
                        state: { sessionId: h.id, subject: h.subject },
                      })
                    }
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      padding: "12px 14px",
                      background: pal.surfaceAlt,
                      border: `1px solid ${pal.line}`,
                      borderRadius: 12,
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: pal.text,
                        }}
                      >
                        {h.subjectLabel}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: pal.muted,
                        }}
                      >
                        {dateLabel}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          color: scoreColor,
                          fontFamily: '"JetBrains Mono", monospace',
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {h.raschScore!.toFixed(1)}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: pal.muted,
                        }}
                      >
                        / 75 · {h.grade ?? "—"}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: pal.muted,
                        fontFamily: '"JetBrains Mono", monospace',
                      }}
                    >
                      {h.totalCorrect}/{h.totalQuestions} {t("correct")}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </Card>
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
              { c: pal.primary, l: t("Mastered"), n: counts.done, border: false },
              { c: pal.accent, l: t("In progress"), n: counts.active, border: false },
              { c: pal.line, l: t("Locked"), n: counts.locked, border: true },
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
            {t("Top topics")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {milestones.slice(0, 4).map((d) => (
              <div key={d.topicId}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{d.topicNameEn}</span>
                  <span
                    style={{
                      fontSize: 12,
                      color: pal.muted,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    {Math.round(d.masteryPct)}%
                  </span>
                </div>
                <Progress
                  value={Math.round(d.masteryPct)}
                  pal={pal}
                  height={6}
                  color={pal.primary}
                />
              </div>
            ))}
            {milestones.length === 0 && (
              <div style={{ fontSize: 12, color: pal.muted }}>
                {t("No topics to show yet.")}
              </div>
            )}
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
            {todayLabel}
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
              style={{
                width: `${Math.round(todayMilestone?.masteryPct ?? 0)}%`,
                height: "100%",
                background: pal.accent,
              }}
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
