import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Btn, Card, Logo, MathPill, Pill } from "@/components/ui/Primitives";
import { Calculator } from "@/components/exam/Calculator";
import { FormulaSheet } from "@/components/exam/FormulaSheet";
import { ScratchPaper } from "@/components/exam/ScratchPaper";
import {
  EXAM_DURATION_MS,
  SECTION_A_COUNT,
  TOTAL_Q,
  clearExam,
  formatHMS,
  readExam,
  startExam,
  writeExam,
  type ExamState,
} from "@/lib/examState";
import { useExamTimer } from "@/hooks/useExamTimer";
import { createExamSession, saveAnswer, submitExam, type ExamSession } from "@/lib/api";

type Tool = "calc" | "formula" | "scratch";

type LocationState = { sessionId?: string };

export default function ExamActive() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state ?? null) as LocationState | null;

  const [session, setSession] = useState<ExamSession | null>(null);
  const [exam, setExam] = useState<ExamState | null>(() => readExam());
  const [tools, setTools] = useState<Record<Tool, boolean>>({
    calc: false,
    formula: false,
    scratch: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const autoSubmitFired = useRef(false);

  // Boot: ensure we have an exam state (timer) and a session (questions).
  useEffect(() => {
    let live = true;

    if (!exam) {
      const s = startExam(EXAM_DURATION_MS);
      if (live) setExam(s);
    }
    (async () => {
      const ses = navState?.sessionId
        ? await createExamSession("MATH") // backend would GET existing; sample creates new
        : await createExamSession("MATH");
      if (live) setSession(ses);
    })();

    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((next: ExamState) => {
    setExam(next);
    writeExam(next);
  }, []);

  const onWarn = useCallback(
    (minutesRemaining: number) => {
      toast.warning(`${minutesRemaining} ${t("minutes remaining")}`, {
        description:
          minutesRemaining <= 5
            ? t("Wrap up. The exam will submit automatically.")
            : t("Proctor warning."),
      });
    },
    [t],
  );

  const handleSubmit = useCallback(
    async (isAuto = false) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        const sid = session?.id ?? "pending";
        await submitExam(sid);
        if (exam) {
          persist({ ...exam, finishedAt: Date.now() });
        }
        navigate("/app/exam/analyzing", {
          state: { sessionId: sid, auto: isAuto },
        });
      } catch {
        setSubmitting(false);
        toast.error(t("Could not submit exam. Try again."));
      }
    },
    [exam, navigate, persist, session, submitting, t],
  );

  const onExpire = useCallback(() => {
    if (autoSubmitFired.current) return;
    autoSubmitFired.current = true;
    toast.error(t("Time's up — submitting your answers."));
    void handleSubmit(true);
  }, [handleSubmit, t]);

  const timer = useExamTimer({
    startedAt: exam?.startedAt ?? Date.now(),
    durationMs: exam?.durationMs ?? EXAM_DURATION_MS,
    enabled: !!exam && !submitting,
    onWarn,
    onExpire,
  });

  const setCurrent = useCallback(
    (i: number) => {
      if (!exam) return;
      const next = Math.max(0, Math.min(TOTAL_Q - 1, i));
      persist({ ...exam, current: next });
    },
    [exam, persist],
  );

  const answerCurrent = useCallback(
    (letter: string) => {
      if (!exam || !session) return;
      const i = exam.current;
      const answers = { ...exam.answers, [i]: letter };
      const next = { ...exam, answers };
      persist(next);
      void saveAnswer(session.id, i, letter, exam.flagged.includes(i));
    },
    [exam, persist, session],
  );

  const toggleFlag = useCallback(() => {
    if (!exam || !session) return;
    const i = exam.current;
    const isFlagged = exam.flagged.includes(i);
    const flagged = isFlagged
      ? exam.flagged.filter((x) => x !== i)
      : [...exam.flagged, i];
    const next = { ...exam, flagged };
    persist(next);
    void saveAnswer(session.id, i, exam.answers[i] ?? null, !isFlagged);
  }, [exam, persist, session]);

  const counts = useMemo(() => {
    if (!exam) return { answered: 0, flagged: 0, unseen: TOTAL_Q };
    const answered = Object.keys(exam.answers).length;
    return {
      answered,
      flagged: exam.flagged.length,
      unseen: TOTAL_Q - answered,
    };
  }, [exam]);

  const exit = () => {
    if (!confirm(t("Exit and discard this attempt? Your answers will be lost."))) return;
    clearExam();
    navigate("/app/exam");
  };

  // Tool toggles
  const toggleTool = (k: Tool) => setTools((s) => ({ ...s, [k]: !s[k] }));

  // Timer chrome appearance
  const minsLeft = Math.ceil(timer.remainingMs / 60000);
  const timerBg =
    timer.remainingMs <= 5 * 60_000
      ? pal.bad
      : timer.remainingMs <= 15 * 60_000
        ? pal.accent
        : pal.text;
  const timerInk = timer.remainingMs <= 15 * 60_000 ? pal.accentInk : pal.surface;

  // Loading state
  if (!exam || !session) {
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
        {t("Loading exam…")}
      </div>
    );
  }

  const q = session.questions[exam.current];
  const qsStatus = (i: number): "answered" | "flagged" | "current" | "unseen" => {
    if (i === exam.current) return "current";
    if (exam.flagged.includes(i)) return "flagged";
    if (exam.answers[i] != null) return "answered";
    return "unseen";
  };

  const colorFor = (s: "answered" | "flagged" | "current" | "unseen") => {
    if (s === "answered") return pal.primary;
    if (s === "flagged") return pal.accent;
    if (s === "current") return pal.text;
    return "transparent";
  };
  const inkFor = (s: "answered" | "flagged" | "current" | "unseen") => {
    if (s === "answered") return pal.primaryInk;
    if (s === "flagged") return pal.accentInk;
    if (s === "current") return pal.surface;
    return pal.muted;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Top bar */}
      <div
        style={{
          padding: "14px 28px",
          background: pal.surface,
          borderBottom: `1px solid ${pal.line}`,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Logo pal={pal} size={16} />
        <div style={{ width: 1, height: 24, background: pal.line }} />
        <div>
          <div style={{ fontSize: 11, color: pal.muted, letterSpacing: "0.04em" }}>
            {t("Full Mock #8")}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.015em",
            }}
          >
            {t("Mathematics")} · {t("BMBA format")}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: pal.muted,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: pal.good,
              boxShadow: `0 0 0 3px ${pal.good}20`,
            }}
          />
          {t("Auto-saved")}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 16px",
            background: timerBg,
            color: timerInk,
            borderRadius: 20,
            transition: "background 0.3s",
          }}
        >
          <Icon name="clock" size={16} color={pal.accent} />
          <div>
            <div
              style={{
                fontSize: 9,
                opacity: 0.7,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {t("Time remaining")}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                fontFamily: '"JetBrains Mono", monospace',
                lineHeight: 1,
              }}
            >
              {formatHMS(timer.remainingMs)}
            </div>
          </div>
        </div>

        <Btn
          pal={pal}
          tone="outline"
          size="md"
          onClick={exit}
          icon={<Icon name="x" size={14} />}
        >
          {t("Exit")}
        </Btn>
        <Btn
          pal={pal}
          tone="accent"
          size="md"
          icon={<Icon name="flag" size={14} />}
          onClick={() => {
            if (confirm(`${t("Submit exam")}: ${counts.answered}/${TOTAL_Q} ${t("Answered")}?`)) {
              void handleSubmit(false);
            }
          }}
        >
          {t("Submit exam")}
        </Btn>
      </div>

      {minsLeft <= 5 && (
        <div
          style={{
            padding: "8px 28px",
            background: pal.bad,
            color: pal.surface,
            fontSize: 13,
            fontWeight: 600,
            textAlign: "center",
            letterSpacing: "-0.01em",
          }}
        >
          {t("⚠ Less than 5 minutes remaining — your exam will auto-submit when the timer hits zero.")}
        </div>
      )}

      {/* Body — 3 columns */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "260px 1fr 280px",
          overflow: "hidden",
        }}
      >
        {/* LEFT — Question palette */}
        <div
          style={{
            background: pal.surface,
            borderRight: `1px solid ${pal.line}`,
            overflow: "auto",
            padding: "20px 18px",
          }}
        >
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
            {t("Question palette")}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{t("Section A · Closed type")}</span>
            <span
              style={{
                color: pal.muted,
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              {Object.keys(exam.answers).filter((k) => Number(k) < SECTION_A_COUNT).length}/
              {SECTION_A_COUNT}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 4,
              marginBottom: 18,
            }}
          >
            {Array.from({ length: SECTION_A_COUNT }).map((_, i) => {
              const s = qsStatus(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 6,
                    background: colorFor(s),
                    color: inkFor(s),
                    border: s === "unseen" ? `1px solid ${pal.line}` : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: '"JetBrains Mono", monospace',
                    position: "relative",
                    cursor: "pointer",
                    padding: 0,
                    ...(s === "current"
                      ? { boxShadow: `0 0 0 2px ${pal.primary}` }
                      : {}),
                  }}
                >
                  {i + 1}
                  {s === "flagged" && (
                    <div
                      style={{
                        position: "absolute",
                        top: -2,
                        right: -2,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: pal.bad,
                        border: `1.5px solid ${pal.surface}`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{t("Section B · Open type")}</span>
            <span
              style={{
                color: pal.muted,
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              {Object.keys(exam.answers).filter((k) => Number(k) >= SECTION_A_COUNT).length}
              /{TOTAL_Q - SECTION_A_COUNT}
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 4,
              marginBottom: 18,
            }}
          >
            {Array.from({ length: TOTAL_Q - SECTION_A_COUNT }).map((_, i) => {
              const idx = SECTION_A_COUNT + i;
              const s = qsStatus(idx);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(idx)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 6,
                    background: s === "unseen" ? "transparent" : colorFor(s),
                    border:
                      s === "unseen"
                        ? `1px dashed ${pal.line}`
                        : "none",
                    color: s === "unseen" ? pal.muted : inkFor(s),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                    ...(s === "current"
                      ? { boxShadow: `0 0 0 2px ${pal.primary}` }
                      : {}),
                  }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div
            style={{
              borderTop: `1px solid ${pal.line}`,
              paddingTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {[
              {
                c: pal.primary,
                l: t("Answered"),
                n: counts.answered,
                border: false,
              },
              { c: pal.accent, l: t("Flagged"), n: counts.flagged, border: false },
              { c: pal.text, l: t("Current"), n: 1, border: false },
              {
                c: "transparent",
                l: t("Unseen"),
                n: Math.max(0, counts.unseen - 1),
                border: true,
              },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 11,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    background: r.c,
                    border: r.border ? `1px solid ${pal.line}` : "none",
                  }}
                />
                <span style={{ flex: 1, color: pal.muted }}>{r.l}</span>
                <span
                  style={{
                    color: pal.text,
                    fontFamily: '"JetBrains Mono", monospace',
                    fontWeight: 600,
                  }}
                >
                  {r.n}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER — Question */}
        <div style={{ overflow: "auto", padding: "32px 48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: pal.muted,
                }}
              >
                {t("Question")} {q.index + 1} {t("of")} {TOTAL_Q}
              </span>
              <Pill pal={pal} tone="muted" style={{ fontSize: 10 }}>
                {q.section === "A" ? t("Closed · 1 correct") : t("Open type")}
              </Pill>
              <Pill pal={pal} tone="primarySoft" style={{ fontSize: 10 }}>
                {q.domain} · {q.topic}
              </Pill>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: pal.muted }}>
                {q.weight} {t("ball")}
              </span>
              <Btn
                pal={pal}
                tone={exam.flagged.includes(exam.current) ? "accent" : "outline"}
                size="sm"
                icon={<Icon name="flag" size={14} />}
                onClick={toggleFlag}
              >
                {exam.flagged.includes(exam.current)
                  ? t("Unflag")
                  : t("Flag for review")}
              </Btn>
            </div>
          </div>

          <Card pal={pal} pad={32}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 500,
                lineHeight: 1.5,
                marginBottom: 22,
                color: pal.text,
                fontFamily: '"Newsreader", serif',
              }}
            >
              {q.prompt}
            </div>
            {q.section === "A" && (
              <MathPill pal={pal} block>
                <span>{"{ "}</span>
                <span>x² + y² = 25</span>
                <span style={{ marginLeft: 24 }}>y = kx + 3</span>
                <span>{" }"}</span>
              </MathPill>
            )}

            {q.options && (
              <div
                style={{
                  marginTop: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {q.options.map((opt) => {
                  const sel = exam.answers[exam.current] === opt.letter;
                  return (
                    <label
                      key={opt.letter}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: "16px 20px",
                        borderRadius: 14,
                        background: sel ? pal.primarySoft : pal.surfaceAlt,
                        border: `1.5px solid ${sel ? pal.primary : pal.line}`,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name={`q-${q.index}`}
                        checked={sel}
                        onChange={() => answerCurrent(opt.letter)}
                        style={{
                          appearance: "none",
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          border: `2px solid ${sel ? pal.primary : pal.muted}`,
                          background: sel ? pal.primary : "transparent",
                          margin: 0,
                          cursor: "pointer",
                          flexShrink: 0,
                          boxShadow: sel
                            ? `inset 0 0 0 4px ${pal.primaryInk}, inset 0 0 0 5px ${pal.primary}`
                            : "none",
                        }}
                      />
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          background: sel ? pal.primary : pal.surface,
                          color: sel ? pal.primaryInk : pal.text,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      >
                        {opt.letter}
                      </span>
                      <span
                        style={{
                          fontSize: 16,
                          fontFamily: '"Newsreader", serif',
                          fontStyle: "italic",
                          color: pal.text,
                        }}
                      >
                        {opt.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {q.section === "B" && (
              <div style={{ marginTop: 22 }}>
                <input
                  type="text"
                  placeholder={t("Type your answer (number, word, or formula)…")}
                  value={exam.answers[exam.current] ?? ""}
                  onChange={(e) => answerCurrent(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 18px",
                    borderRadius: 14,
                    border: `1.5px solid ${pal.line}`,
                    background: pal.surfaceAlt,
                    fontSize: 16,
                    fontFamily: '"Newsreader", serif',
                    outline: "none",
                    color: pal.text,
                  }}
                />
              </div>
            )}
          </Card>

          <div
            style={{
              marginTop: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Btn
              pal={pal}
              tone="outline"
              size="md"
              onClick={() => setCurrent(exam.current - 1)}
              icon={
                <span style={{ display: "inline-block", transform: "rotate(180deg)" }}>
                  <Icon name="arrow-right" size={14} />
                </span>
              }
            >
              {t("Previous")}
            </Btn>
            <div
              style={{
                fontSize: 12,
                color: pal.muted,
                display: "flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              <span>
                {counts.answered} {t("Answered")}
              </span>{" "}
              ·{" "}
              <span>
                {counts.flagged} {t("Flagged")}
              </span>{" "}
              ·{" "}
              <span>
                {Math.max(0, counts.unseen - 1)} {t("Unseen")}
              </span>
            </div>
            <Btn
              pal={pal}
              tone="primary"
              size="md"
              onClick={() => setCurrent(exam.current + 1)}
              iconAfter={<Icon name="arrow-right" size={14} />}
            >
              {t("Next")}
            </Btn>
          </div>
        </div>

        {/* RIGHT — Answer sheet + tools */}
        <div
          style={{
            background: pal.surface,
            borderLeft: `1px solid ${pal.line}`,
            overflow: "auto",
            padding: "20px 18px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: pal.muted,
              marginBottom: 14,
            }}
          >
            {t("Answer sheet")}
          </div>

          <div
            style={{
              background: pal.surfaceAlt,
              border: `1px solid ${pal.line}`,
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: pal.muted,
                marginBottom: 10,
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              {t("Answer sheet · 1–20")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {Array.from({ length: 20 }).map((_, i) => {
                const ans = exam.answers[i];
                const current = i === exam.current;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: current ? "4px 6px" : 0,
                      borderRadius: 6,
                      background: current ? pal.primarySoft : "transparent",
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        fontSize: 10,
                        color: pal.muted,
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}.
                    </span>
                    {(["A", "B", "C", "D"] as const).map((letter) => (
                      <div
                        key={letter}
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          border: `1.5px solid ${pal.line}`,
                          background: ans === letter ? pal.primary : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 9,
                          fontWeight: 700,
                          color: ans === letter ? pal.primaryInk : pal.muted,
                        }}
                      >
                        {letter}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: pal.muted,
                marginBottom: 10,
              }}
            >
              {t("Tools")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(
                [
                  { key: "calc" as const, icon: "bolt" as IconName, l: t("Calculator") },
                  { key: "formula" as const, icon: "book" as IconName, l: t("Formula sheet") },
                  { key: "scratch" as const, icon: "image" as IconName, l: t("Scratch paper") },
                ]
              ).map((tool) => {
                const on = tools[tool.key];
                return (
                  <button
                    key={tool.key}
                    type="button"
                    onClick={() => toggleTool(tool.key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: `1px solid ${on ? pal.primary : pal.line}`,
                      background: on ? pal.primarySoft : pal.surface,
                      color: on ? pal.primary : pal.text,
                      fontSize: 13,
                      fontWeight: on ? 700 : 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                    }}
                  >
                    <Icon name={tool.icon} size={14} />
                    <span style={{ flex: 1 }}>{tool.l}</span>
                    {on && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: pal.primary,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        {t("Open")}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              padding: 12,
              background: pal.accentSoft,
              color: pal.accentInk,
              borderRadius: 10,
              fontSize: 12,
              lineHeight: 1.4,
            }}
          >
            <strong>{t("Note:")}</strong>{" "}
            {t("You cannot return to Section A after submitting it.")}
          </div>
        </div>
      </div>

      {/* Floating tool panels */}
      {tools.calc && <Calculator onClose={() => toggleTool("calc")} />}
      {tools.formula && <FormulaSheet onClose={() => toggleTool("formula")} />}
      {tools.scratch && <ScratchPaper onClose={() => toggleTool("scratch")} />}
    </div>
  );
}
