import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { palette as pal } from "@/lib/palette";
import { Icon } from "@/components/ui/Icon";
import { Btn, Card, Logo, Pill, Progress, Ring } from "@/components/ui/Primitives";
import { LangSwitcher } from "@/components/app/LangSwitcher";
import {
  getExamResult,
  regenerateRoadmap,
  requestAIAnalysis,
  type ExamSummary,
} from "@/lib/api";
import { clearExam } from "@/lib/examState";

type LocationState = { sessionId?: string; result?: ExamSummary };

export default function ExamResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state ?? {}) as LocationState;

  const [result, setResult] = useState<ExamSummary | null>(state.result ?? null);
  const [busy, setBusy] = useState<"ai" | "roadmap" | null>(null);

  // If we landed here directly (no nav state), fetch the latest result.
  useEffect(() => {
    if (result) return;
    let live = true;
    getExamResult(state.sessionId ?? "latest").then((r) => {
      if (live) setResult(r);
    });
    return () => {
      live = false;
    };
  }, [result, state.sessionId]);

  // Clear local exam timer/state once results are shown.
  useEffect(() => {
    if (result) clearExam();
  }, [result]);

  const onAnalyzeAI = async () => {
    if (!result || busy) return;
    setBusy("ai");
    try {
      const { chatId } = await requestAIAnalysis(result.sessionId);
      navigate("/app/chat", { state: { chatId, source: "exam" } });
    } finally {
      setBusy(null);
    }
  };

  const onRoadmap = async () => {
    if (!result || busy) return;
    setBusy("roadmap");
    try {
      await regenerateRoadmap(result.sessionId);
      navigate("/app/roadmap");
    } finally {
      setBusy(null);
    }
  };

  if (!result) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: pal.muted,
          fontSize: 14,
        }}
      >
        Loading your report…
      </div>
    );
  }

  const passed = result.raschScore >= 46;

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      {/* Top */}
      <div
        style={{
          padding: "20px 32px",
          borderBottom: `1px solid ${pal.line}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Logo pal={pal} size={18} />
        <div style={{ width: 1, height: 24, background: pal.line }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: pal.muted, marginBottom: 2 }}>
            Mock exam · Mathematics
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            Your diagnostic report
          </h1>
        </div>
        <LangSwitcher />
        <Btn
          pal={pal}
          tone="outline"
          size="md"
          onClick={() => navigate("/app")}
          icon={<Icon name="home" size={14} />}
        >
          Back to dashboard
        </Btn>
      </div>

      <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Hero */}
        <Card
          pal={pal}
          pad={0}
          style={{
            background: pal.primary,
            color: pal.primaryInk,
            border: "none",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -40,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background: pal.accent,
              opacity: 0.4,
              filter: "blur(50px)",
            }}
          />
          <div
            style={{
              position: "relative",
              padding: 32,
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: 28,
              alignItems: "center",
            }}
          >
            <Ring
              value={result.raschScore}
              max={75}
              size={160}
              stroke={12}
              color={pal.accent}
              track="rgba(255,255,255,0.15)"
              pal={pal}
              label={
                <span
                  style={{
                    fontSize: 32,
                    fontFamily: '"JetBrains Mono", monospace',
                    color: pal.primaryInk,
                  }}
                >
                  {result.raschScore.toFixed(1)}
                </span>
              }
              sub={
                <span style={{ color: "rgba(255,255,255,0.7)" }}>
                  Rasch / 75
                </span>
              }
            />
            <div>
              <Pill
                pal={pal}
                tone={passed ? "accent" : "bad"}
                style={{ marginBottom: 12 }}
              >
                {passed ? "Certificate-ready" : "Below pass threshold"}
              </Pill>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  letterSpacing: "-0.045em",
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                Grade {result.grade}
              </div>
              <div
                style={{
                  fontSize: 15,
                  opacity: 0.9,
                  maxWidth: 520,
                  lineHeight: 1.55,
                }}
              >
                You answered {result.totalCorrect}/{result.totalQuestions} correctly.
                Your weak topics are ranked below by impact on your final score —
                fix the top three and your projected grade jumps a tier.
              </div>
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  gap: 18,
                  flexWrap: "wrap",
                }}
              >
                <SectionStat
                  label="Section A · closed"
                  correct={result.sectionA.correct}
                  total={result.sectionA.total}
                  ball={result.sectionA.ball}
                />
                <SectionStat
                  label="Section B · open"
                  correct={result.sectionB.correct}
                  total={result.sectionB.total}
                  ball={result.sectionB.ball}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                minWidth: 220,
              }}
            >
              <Btn
                pal={pal}
                tone="accent"
                size="lg"
                full
                icon={<Icon name="chat" size={16} />}
                onClick={onAnalyzeAI}
              >
                {busy === "ai" ? "Starting…" : "Analyze with AI Coach"}
              </Btn>
              <Btn
                pal={pal}
                tone="outline"
                size="lg"
                full
                dark
                style={{ color: pal.primaryInk, borderColor: "rgba(255,255,255,0.35)" }}
                icon={<Icon name="map" size={16} />}
                onClick={onRoadmap}
              >
                {busy === "roadmap" ? "Updating…" : "View updated roadmap"}
              </Btn>
            </div>
          </div>
        </Card>

        {/* Weak topics + Strong topics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 16,
          }}
        >
          <Card pal={pal} pad={22}>
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
                  Weakest topics
                </div>
                <div style={{ fontSize: 12, color: pal.muted, marginTop: 2 }}>
                  Ranked by impact on your projected final score
                </div>
              </div>
              <Pill pal={pal} tone="primarySoft">
                Top {result.weakTopics.length}
              </Pill>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {result.weakTopics.map((w, i) => (
                <div
                  key={w.topic}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "28px 1fr 130px 90px 32px",
                    gap: 12,
                    alignItems: "center",
                    padding: "12px 14px",
                    background: pal.surfaceAlt,
                    border: `1px solid ${pal.line}`,
                    borderRadius: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: pal.accent,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    #{i + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{w.topic}</div>
                    <div style={{ fontSize: 11, color: pal.muted }}>{w.domain}</div>
                  </div>
                  <Progress
                    value={w.mastery}
                    pal={pal}
                    color={w.mastery < 35 ? pal.bad : pal.accent}
                    height={6}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      color: pal.primary,
                      fontWeight: 700,
                      fontFamily: '"JetBrains Mono", monospace',
                      textAlign: "right",
                    }}
                  >
                    +{w.impact.toFixed(1)} ball
                  </span>
                  <Icon name="chev-right" size={16} color={pal.muted} />
                </div>
              ))}
            </div>
          </Card>

          <Card pal={pal} pad={22}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
              You're solid on
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {result.strongTopics.map((s) => (
                <div
                  key={s.topic}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 110px 50px",
                    gap: 10,
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: `1px solid ${pal.line}`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.topic}</div>
                    <div style={{ fontSize: 11, color: pal.muted }}>{s.domain}</div>
                  </div>
                  <Progress
                    value={s.mastery}
                    pal={pal}
                    color={pal.primary}
                    height={6}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: pal.primary,
                      fontFamily: '"JetBrains Mono", monospace',
                      textAlign: "right",
                    }}
                  >
                    {s.mastery}%
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 16,
                padding: 14,
                background: pal.primarySoft,
                color: pal.primary,
                borderRadius: 12,
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              <strong>Tip:</strong> Don't drill these — diminishing returns.
              Focus minutes on the weak list to climb tiers faster.
            </div>
          </Card>
        </div>

        {/* Question breakdown */}
        <Card pal={pal} pad={0}>
          <div
            style={{
              padding: "16px 22px",
              borderBottom: `1px solid ${pal.line}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                Question breakdown
              </div>
              <div style={{ fontSize: 12, color: pal.muted, marginTop: 2 }}>
                First {result.breakdown.length} questions · tap "Explain" to ask the AI Coach
              </div>
            </div>
            <Btn
              pal={pal}
              tone="ghost"
              size="sm"
              iconAfter={<Icon name="arrow-right" size={12} />}
            >
              View all
            </Btn>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 100px 100px 100px 100px",
              padding: "10px 22px",
              borderBottom: `1px solid ${pal.line}`,
              fontSize: 10,
              fontWeight: 700,
              color: pal.muted,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <span>#</span>
            <span>Topic</span>
            <span>Yours</span>
            <span>Correct</span>
            <span>Time</span>
            <span style={{ textAlign: "right" }}>Action</span>
          </div>
          {result.breakdown.map((b, i, arr) => (
            <div
              key={b.qIndex}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 100px 100px 100px 100px",
                padding: "12px 22px",
                alignItems: "center",
                borderBottom: i < arr.length - 1 ? `1px solid ${pal.line}` : "none",
                fontSize: 13,
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: pal.muted,
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                Q{b.qIndex + 1}
              </span>
              <span style={{ fontWeight: 600 }}>{b.topic}</span>
              <span
                style={{
                  color: b.correct ? pal.good : pal.bad,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                }}
              >
                {b.yourAnswer ?? "—"}{" "}
                <Icon
                  name={b.correct ? "check" : "x"}
                  size={11}
                  color={b.correct ? pal.good : pal.bad}
                  stroke={2.5}
                />
              </span>
              <span
                style={{
                  color: pal.primary,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                }}
              >
                {b.correctAnswer}
              </span>
              <span
                style={{
                  color: pal.muted,
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 12,
                }}
              >
                {(b.timeSpentMs / 1000).toFixed(0)}s
              </span>
              <span style={{ textAlign: "right" }}>
                {!b.correct ? (
                  <button
                    type="button"
                    onClick={onAnalyzeAI}
                    style={{
                      padding: "4px 10px",
                      border: `1px solid ${pal.primary}`,
                      background: pal.primarySoft,
                      color: pal.primary,
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Explain
                  </button>
                ) : (
                  <span style={{ fontSize: 11, color: pal.muted }}>—</span>
                )}
              </span>
            </div>
          ))}
        </Card>

        {/* Footer CTAs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <Card pal={pal} pad={20}>
            <Icon name="chat" size={20} color={pal.primary} />
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginTop: 8,
                letterSpacing: "-0.015em",
              }}
            >
              Talk through wrong answers
            </div>
            <div
              style={{
                fontSize: 12,
                color: pal.muted,
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              AI Coach uses the Socratic method — no lectures, just questions
              that lead you to the answer.
            </div>
            <Btn
              pal={pal}
              tone="primary"
              size="md"
              full
              style={{ marginTop: 14 }}
              onClick={onAnalyzeAI}
              iconAfter={<Icon name="arrow-right" size={14} />}
            >
              Start session
            </Btn>
          </Card>
          <Card pal={pal} pad={20}>
            <Icon name="map" size={20} color={pal.primary} />
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginTop: 8,
                letterSpacing: "-0.015em",
              }}
            >
              Regenerate roadmap
            </div>
            <div
              style={{
                fontSize: 12,
                color: pal.muted,
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              We'll rebuild your study path around the weak topics, pacing
              checkpoints up to your exam date.
            </div>
            <Btn
              pal={pal}
              tone="outline"
              size="md"
              full
              style={{ marginTop: 14 }}
              onClick={onRoadmap}
              iconAfter={<Icon name="arrow-right" size={14} />}
            >
              Update plan
            </Btn>
          </Card>
          <Card pal={pal} pad={20}>
            <Icon name="swords" size={20} color={pal.primary} />
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginTop: 8,
                letterSpacing: "-0.015em",
              }}
            >
              Drill the topics in battles
            </div>
            <div
              style={{
                fontSize: 12,
                color: pal.muted,
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              5-minute ranked duels filtered to your weakest topics — the
              cheapest exposure per minute.
            </div>
            <Btn
              pal={pal}
              tone="outline"
              size="md"
              full
              style={{ marginTop: 14 }}
              onClick={() => navigate("/app/battle")}
              iconAfter={<Icon name="arrow-right" size={14} />}
            >
              Open battle lobby
            </Btn>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SectionStat({
  label,
  correct,
  total,
  ball,
}: {
  label: string;
  correct: number;
  total: number;
  ball: number;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          opacity: 0.7,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          fontFamily: '"JetBrains Mono", monospace',
          letterSpacing: "-0.02em",
          marginTop: 4,
        }}
      >
        {correct}/{total}
        <span
          style={{
            fontSize: 13,
            opacity: 0.7,
            marginLeft: 8,
            fontWeight: 500,
          }}
        >
          · {ball.toFixed(1)} ball
        </span>
      </div>
    </div>
  );
}
