import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Btn, Card, Logo, MathPill, Pill } from "@/components/ui/Primitives";
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
import {
  createExamSession,
  getExamSession,
  saveAnswer,
  submitExam,
  type ExamSession,
  type SubjectCode,
} from "@/lib/api";
import { useIsAtMostTablet, useIsMobile } from "@/hooks/useMediaQuery";
import {
  examModeFromPath,
  examSubPath,
  exitPathFor,
  labelForSubject,
} from "@/lib/examMode";

type Tool = "formula" | "scratch";

type LocationState = { sessionId?: string; subject?: SubjectCode; mode?: "quick" | "app" };

export default function ExamActive() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state ?? null) as LocationState | null;

  const [session, setSession] = useState<ExamSession | null>(null);
  const [exam, setExam] = useState<ExamState | null>(() => readExam());
  const [tools, setTools] = useState<Record<Tool, boolean>>({
    formula: false,
    scratch: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const autoSubmitFired = useRef(false);
  // One-shot guard: stops Strict Mode's double-invoke of effects from creating
  // a second exam attempt on the backend. Without it, every mount POSTs a new
  // session and our answers were being saved to a stale id that wasn't the one
  // we ended up submitting from.
  const booted = useRef(false);

  const mode = examModeFromPath(location.pathname);
  const subject: SubjectCode = navState?.subject ?? "MATH";
  const subjectLabel = labelForSubject(subject);

  const isMobile = useIsMobile();
  const isAtMostTablet = useIsAtMostTablet();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Boot: ensure we have an exam state (timer) and a session (questions).
  // If the caller (ExamLanding / QuickExamStart) already created an attempt
  // and passed its id via navState, REUSE it via GET — never create a second
  // one, otherwise our autosave + submit go to a different attempt than the
  // one the user actually answered against.
  useEffect(() => {
    // Strict-Mode-safe one-shot guard. We DON'T use a per-effect `live` flag
    // because React 18 Strict Mode mounts the effect, unmounts (firing
    // cleanup), then mounts again — the cleanup from the first mount would
    // mark the in-flight request stale, but `booted.current` already prevents
    // the second mount from kicking off a replacement, so the page would hang
    // forever. Letting the late setState land is harmless (and required) here.
    if (booted.current) return;
    booted.current = true;

    if (!exam) {
      setExam(startExam(EXAM_DURATION_MS));
    }
    (async () => {
      const describe = (e: unknown): string => {
        if (typeof e === "object" && e && "response" in e) {
          const resp = (e as { response?: { data?: { detail?: string } } }).response;
          if (resp?.data?.detail) return resp.data.detail;
        }
        return e instanceof Error ? e.message : String(e);
      };
      try {
        const ses = navState?.sessionId
          ? await getExamSession(navState.sessionId)
          : await createExamSession(subject);
        setSession(ses);
      } catch (e) {
        if (!navState?.sessionId) {
          setLoadError(describe(e));
          return;
        }
        try {
          const fresh = await createExamSession(subject);
          setSession(fresh);
        } catch (e2) {
          setLoadError(describe(e2));
        }
      }
    })();
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
      if (!session?.id) {
        // No real attempt id — refuse instead of POSTing "pending" and ending
        // up on a result page with zero saved answers.
        toast.error(t("Exam isn't ready yet. Give it a second and try again."));
        return;
      }
      setSubmitting(true);
      try {
        const sid = session.id;
        await submitExam(sid);
        if (exam) {
          persist({ ...exam, finishedAt: Date.now() });
        }
        navigate(examSubPath(mode, "analyzing"), {
          state: { sessionId: sid, auto: isAuto, subject, mode },
        });
      } catch {
        setSubmitting(false);
        toast.error(t("Could not submit exam. Try again."));
      }
    },
    [exam, mode, navigate, persist, session, subject, submitting, t],
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
    navigate(exitPathFor(mode));
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

  // Loading / error state
  if (!exam || !session) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
          justifyContent: "center",
          color: loadError ? pal.bad : pal.muted,
          fontSize: 14,
          padding: 24,
          textAlign: "center",
        }}
      >
        {loadError ? (
          <>
            <div style={{ fontWeight: 600 }}>{t("Could not start exam.")}</div>
            <div style={{ color: pal.muted, maxWidth: 480 }}>{loadError}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Btn
                pal={pal}
                tone="primary"
                size="sm"
                onClick={() => window.location.reload()}
              >
                {t("Try again")}
              </Btn>
              <Btn
                pal={pal}
                tone="outline"
                size="sm"
                onClick={() => navigate(exitPathFor(mode))}
              >
                {t("Back")}
              </Btn>
            </div>
          </>
        ) : (
          t("Loading exam…")
        )}
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
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "100vh" }}>
      {/* Top bar */}
      <div
        style={{
          padding: isMobile ? "10px 14px" : "14px 28px",
          background: pal.surface,
          borderBottom: `1px solid ${pal.line}`,
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 8 : 20,
          flexWrap: "wrap",
        }}
      >
        <Logo pal={pal} size={16} />
        <div style={{ width: 1, height: 24, background: pal.line }} />
        <div>
          <div style={{ fontSize: 11, color: pal.muted, letterSpacing: "0.04em" }}>
            {mode === "quick" ? t("Quick mock") : t("Full Mock #8")}
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.015em",
            }}
          >
            {t(subjectLabel)} · {t("BMBA format")}
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {!isMobile && (
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
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 6 : 10,
            padding: isMobile ? "4px 10px" : "6px 16px",
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
          size={isMobile ? "sm" : "md"}
          onClick={exit}
          icon={<Icon name="x" size={14} />}
        >
          {isMobile ? "" : t("Exit")}
        </Btn>
        <Btn
          pal={pal}
          tone="accent"
          size={isMobile ? "sm" : "md"}
          icon={<Icon name="flag" size={14} />}
          onClick={() => {
            if (confirm(`${t("Submit exam")}: ${counts.answered}/${TOTAL_Q} ${t("Answered")}?`)) {
              void handleSubmit(false);
            }
          }}
        >
          {isMobile ? t("Submit") : t("Submit exam")}
        </Btn>
        {isAtMostTablet && (
          <Btn
            pal={pal}
            tone="outline"
            size={isMobile ? "sm" : "md"}
            onClick={() => setPaletteOpen(true)}
            icon={<Icon name="book" size={14} />}
          >
            {isMobile ? "" : t("Questions")}
          </Btn>
        )}
        {isAtMostTablet && (
          <Btn
            pal={pal}
            tone="outline"
            size={isMobile ? "sm" : "md"}
            onClick={() => setSheetOpen(true)}
            icon={<Icon name="bolt" size={14} />}
          >
            {isMobile ? "" : t("Tools")}
          </Btn>
        )}
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

      {/* Body — 3 columns on desktop, single column on small screens */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: isAtMostTablet ? "1fr" : "260px 1fr 280px",
          overflow: "hidden",
        }}
      >
        {/* LEFT — Question palette */}
        <div
          style={
            isAtMostTablet
              ? {
                  position: "fixed",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "min(320px, 90vw)",
                  background: pal.surface,
                  borderRight: `1px solid ${pal.line}`,
                  overflow: "auto",
                  padding: "20px 18px",
                  zIndex: 60,
                  transform: paletteOpen ? "translateX(0)" : "translateX(-100%)",
                  transition: "transform 0.25s ease",
                  boxShadow: paletteOpen ? "0 24px 60px rgba(0,0,0,0.18)" : "none",
                }
              : {
                  background: pal.surface,
                  borderRight: `1px solid ${pal.line}`,
                  overflow: "auto",
                  padding: "20px 18px",
                }
          }
        >
          {isAtMostTablet && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 8,
              }}
            >
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: pal.muted,
                  cursor: "pointer",
                  padding: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontFamily: "inherit",
                }}
              >
                <Icon name="x" size={14} />
                {t("Close")}
              </button>
            </div>
          )}
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
        <div style={{ overflow: "auto", padding: isMobile ? "20px 16px" : "32px 48px" }}>
          <div
            style={{
              display: "flex",
              alignItems: isMobile ? "flex-start" : "baseline",
              justifyContent: "space-between",
              marginBottom: 14,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 8 : 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
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
            {q.expression && (
              <MathPill pal={pal} block>
                {q.expression}
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
          style={
            isAtMostTablet
              ? {
                  position: "fixed",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: "min(320px, 90vw)",
                  background: pal.surface,
                  borderLeft: `1px solid ${pal.line}`,
                  overflow: "auto",
                  padding: "20px 18px",
                  zIndex: 60,
                  transform: sheetOpen ? "translateX(0)" : "translateX(100%)",
                  transition: "transform 0.25s ease",
                  boxShadow: sheetOpen ? "0 24px 60px rgba(0,0,0,0.18)" : "none",
                }
              : {
                  background: pal.surface,
                  borderLeft: `1px solid ${pal.line}`,
                  overflow: "auto",
                  padding: "20px 18px",
                }
          }
        >
          {isAtMostTablet && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 8,
              }}
            >
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: pal.muted,
                  cursor: "pointer",
                  padding: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontFamily: "inherit",
                }}
              >
                <Icon name="x" size={14} />
                {t("Close")}
              </button>
            </div>
          )}
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

      {/* Drawer backdrop */}
      {isAtMostTablet && (paletteOpen || sheetOpen) && (
        <div
          onClick={() => {
            setPaletteOpen(false);
            setSheetOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 55,
          }}
        />
      )}

      {/* Floating tool panels */}
      {tools.formula && <FormulaSheet onClose={() => toggleTool("formula")} subject={subject} />}
      {tools.scratch && <ScratchPaper onClose={() => toggleTool("scratch")} />}
    </div>
  );
}
