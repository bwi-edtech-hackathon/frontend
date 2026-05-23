import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { Avatar, Btn, Card, MathPill, Pill } from "@/components/ui/Primitives";
import {
  getBattleSession,
  startBattleSession,
  submitBattleAnswer,
  type BattleLetter,
  type BattleSession,
  type SubjectCode,
} from "@/lib/api";

type LocationState = {
  sessionId?: string;
  subject?: SubjectCode;
  mode?: "ranked" | "friend" | "ai";
};

const PER_Q_MS = 30_000;

export default function BattleActive() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state ?? null) as LocationState | null;

  const [session, setSession] = useState<BattleSession | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<BattleLetter | null>(null);
  const [yourScore, setYourScore] = useState(0);
  const [yourCorrectCount, setYourCorrectCount] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentCorrectCount, setOpponentCorrectCount] = useState(0);
  const [opponentQ, setOpponentQ] = useState(0);
  const [opponentLastResult, setOpponentLastResult] = useState<"correct" | "wrong" | null>("correct");
  const [opponentAvgMs, setOpponentAvgMs] = useState(3200);
  const [remainingMs, setRemainingMs] = useState(PER_Q_MS);
  const [locking, setLocking] = useState(false);

  const questionStartedAt = useRef<number>(Date.now());
  const opponentTimer = useRef<number | null>(null);

  // Load session
  useEffect(() => {
    let live = true;
    (async () => {
      const s = navState?.sessionId
        ? await getBattleSession(navState.sessionId)
        : await startBattleSession({
            subject: navState?.subject ?? "MATH",
            mode: navState?.mode ?? "ranked",
          });
      if (!live) return;
      setSession(s);
      questionStartedAt.current = Date.now();
      setRemainingMs(PER_Q_MS);
    })();
    return () => {
      live = false;
    };
  }, [navState?.sessionId, navState?.subject, navState?.mode]);

  // Per-question countdown — tick once per second.
  useEffect(() => {
    if (!session) return;
    const id = window.setInterval(() => {
      const elapsed = Date.now() - questionStartedAt.current;
      setRemainingMs(Math.max(0, PER_Q_MS - elapsed));
    }, 250);
    return () => window.clearInterval(id);
  }, [session, qIndex]);

  // Simulated opponent activity — answers ~every 3.2s on average.
  useEffect(() => {
    if (!session) return;
    if (opponentTimer.current) window.clearTimeout(opponentTimer.current);
    const next = 2500 + Math.floor(Math.random() * 2500);
    opponentTimer.current = window.setTimeout(() => {
      setOpponentQ((q) => Math.min(session.totalQuestions, q + 1));
      const wasCorrect = Math.random() < 0.62;
      if (wasCorrect) {
        setOpponentCorrectCount((c) => c + 1);
        setOpponentScore((s) => s + 155);
      }
      setOpponentLastResult(wasCorrect ? "correct" : "wrong");
      setOpponentAvgMs(2800 + Math.floor(Math.random() * 1200));
    }, next);
    return () => {
      if (opponentTimer.current) window.clearTimeout(opponentTimer.current);
    };
  }, [session, opponentQ]);

  const goToResult = useCallback(() => {
    if (!session) return;
    navigate("/app/battle/result", {
      replace: true,
      state: {
        sessionId: session.id,
        subject: session.subject,
      },
    });
  }, [session, navigate]);

  const advanceQuestion = useCallback(
    async (letter: BattleLetter | null) => {
      if (!session || locking) return;
      setLocking(true);
      const idx = qIndex;
      const timeMs = Math.min(PER_Q_MS, Date.now() - questionStartedAt.current);
      try {
        const { correct } = await submitBattleAnswer(session.id, idx, letter, timeMs);
        if (correct) {
          setYourCorrectCount((c) => c + 1);
          setYourScore((s) => s + 155);
        }
      } catch {
        // ignore — score stays as is
      }
      const next = idx + 1;
      if (next >= session.totalQuestions) {
        // Small delay so the final lock-in feels intentional, then navigate.
        setTimeout(goToResult, 350);
        return;
      }
      setQIndex(next);
      setSelected(null);
      questionStartedAt.current = Date.now();
      setRemainingMs(PER_Q_MS);
      setLocking(false);
    },
    [session, qIndex, locking, goToResult],
  );

  // Auto-submit if the per-question timer hits zero.
  useEffect(() => {
    if (!session) return;
    if (remainingMs > 0) return;
    if (locking) return;
    void advanceQuestion(selected);
  }, [remainingMs, session, locking, selected, advanceQuestion]);

  const q = useMemo(
    () => (session ? session.questions[qIndex] : null),
    [session, qIndex],
  );

  if (!session || !q) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: pal.battleBg,
          color: pal.battleInk,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}
      >
        {t("Loading battle…")}
      </div>
    );
  }

  const secondsLeft = Math.ceil(remainingMs / 1000)
    .toString()
    .padStart(2, "0");
  const isUrgent = remainingMs <= 8_000;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: pal.battleBg,
        color: pal.battleInk,
        padding: "20px 16px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <style>{`
        @keyframes tick {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
      `}</style>

      {/* Top bar — you / Q timer / opponent */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
          <Avatar name="Diana" size={36} hue={20} ring={pal.primary} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: pal.muted }}>{t("You")}</div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: pal.primary,
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: "-0.02em",
              }}
            >
              {yourScore}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: pal.muted, letterSpacing: "0.08em" }}>
            Q {qIndex + 1} / {session.totalQuestions}
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              fontFamily: '"JetBrains Mono", monospace',
              color: isUrgent ? pal.bad : pal.accent,
              letterSpacing: "-0.02em",
              animation: "tick 1s ease-in-out infinite",
            }}
          >
            00:{secondsLeft}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flex: 1,
            justifyContent: "flex-end",
            minWidth: 0,
          }}
        >
          <div style={{ minWidth: 0, textAlign: "right" }}>
            <div style={{ fontSize: 11, color: pal.muted }}>
              {session.opponent.name.split(" ")[0]} · {session.opponent.elo}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: pal.accent,
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: "-0.02em",
              }}
            >
              {opponentScore}
            </div>
          </div>
          <Avatar
            name={session.opponent.name}
            size={36}
            hue={session.opponent.avatarHue}
            ring={pal.accent}
          />
        </div>
      </div>

      {/* Live opponent status */}
      <div
        style={{
          background: pal.battleSurface,
          borderRadius: 12,
          padding: "10px 14px",
          border: `1px solid ${pal.battleLine}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: pal.accent,
            boxShadow: `0 0 0 4px ${pal.accent}30`,
          }}
        />
        <span style={{ fontSize: 12, color: pal.muted, flex: 1 }}>
          {session.opponent.name.split(" ")[0]} {t("on question")}{" "}
          {Math.max(1, opponentQ)} ·{" "}
          {opponentLastResult === "correct" ? (
            <span style={{ color: pal.good, fontWeight: 700 }}>
              {t("answered")} ✓
            </span>
          ) : (
            <span style={{ color: pal.bad, fontWeight: 700 }}>
              {t("answered")} ✗
            </span>
          )}
        </span>
        <span
          style={{
            fontSize: 11,
            color: pal.muted,
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {(opponentAvgMs / 1000).toFixed(1)}s {t("avg")}
        </span>
      </div>

      {/* Question card */}
      <Card
        pal={pal}
        dark
        pad={22}
        style={{ background: pal.battleSurface, borderColor: pal.battleLine }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <Pill
            pal={pal}
            tone="ghost"
            dark
            style={{ background: pal.battleLine, color: pal.battleInk }}
          >
            {t("Closed · 1 correct")}
          </Pill>
          <Pill
            pal={pal}
            tone="ghost"
            dark
            style={{ background: pal.battleLine, color: pal.battleInk }}
          >
            {q.weight.toFixed(1)} {t("ball")}
          </Pill>
          <Pill
            pal={pal}
            tone="ghost"
            dark
            style={{
              background: "transparent",
              color: pal.muted,
              border: `1px solid ${pal.battleLine}`,
            }}
          >
            {q.topic}
          </Pill>
        </div>
        <div
          style={{
            fontSize: 19,
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: 14,
            color: pal.battleInk,
            letterSpacing: "-0.015em",
          }}
        >
          {q.prompt}
        </div>
        {q.expression && (
          <MathPill pal={pal} dark block>
            {q.expression}
          </MathPill>
        )}

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
          {q.options.map((opt) => {
            const sel = selected === opt.letter;
            return (
              <button
                key={opt.letter}
                type="button"
                onClick={() => setSelected(opt.letter)}
                disabled={locking}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: sel ? `${pal.primary}33` : pal.battleSurface,
                  border: `1.5px solid ${sel ? pal.primary : pal.battleLine}`,
                  color: pal.battleInk,
                  cursor: locking ? "default" : "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  transition: "background 0.15s, border-color 0.15s",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: sel ? pal.primary : pal.battleLine,
                    color: sel ? pal.primaryInk : pal.muted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {opt.letter}
                </div>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: pal.battleInk,
                    fontFamily: '"Newsreader", serif',
                  }}
                >
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Submit */}
      <Btn
        pal={pal}
        tone="primary"
        size="lg"
        full
        iconAfter={<Icon name="arrow-right" size={18} />}
        onClick={() => advanceQuestion(selected)}
      >
        {locking
          ? t("Locking…")
          : selected
            ? t("Lock in answer")
            : t("Skip question")}
      </Btn>

      {/* Forfeit hint */}
      <div style={{ textAlign: "center", fontSize: 11, color: pal.muted, marginTop: 4 }}>
        {t("Tap and hold to forfeit")}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <button
          type="button"
          onClick={() => {
            if (confirm(t("Forfeit this match? You will lose ELO."))) {
              navigate("/app/battle", { replace: true });
            }
          }}
          style={{
            background: "transparent",
            border: "none",
            color: pal.muted,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "inherit",
            textDecoration: "underline",
          }}
        >
          {t("Forfeit match")}
        </button>
      </div>

      {/* Correct/incorrect summary */}
      <div
        style={{
          marginTop: 4,
          display: "flex",
          justifyContent: "center",
          gap: 18,
          fontSize: 12,
          color: pal.muted,
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        <span>
          {t("You")}: {yourCorrectCount}/{qIndex + 1}
        </span>
        <span>·</span>
        <span>
          {session.opponent.name.split(" ")[0]}: {opponentCorrectCount}/
          {Math.max(0, opponentQ)}
        </span>
      </div>
    </div>
  );
}
