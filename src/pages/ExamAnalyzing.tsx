import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Primitives";
import { getExamResult } from "@/lib/api";

type LocationState = { sessionId?: string; auto?: boolean };

type Stage = {
  key: string;
  label: string;
  icon: IconName;
  duration: number;
};

export default function ExamAnalyzing() {
  const t = useT();
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state ?? {}) as LocationState;
  const sessionId = state.sessionId ?? "pending";

  const STAGES = useMemo<Stage[]>(
    () => [
      { key: "scoring", label: t("Scoring closed-type answers…"), icon: "check", duration: 900 },
      { key: "open", label: t("Grading open-type responses with AI…"), icon: "sparkle", duration: 1400 },
      { key: "rasch", label: t("Calibrating Rasch score against item difficulty…"), icon: "bolt", duration: 1100 },
      { key: "topics", label: t("Identifying weakest topics & impact ranking…"), icon: "search", duration: 900 },
      { key: "report", label: t("Building your diagnostic report…"), icon: "book", duration: 700 },
    ],
    [t],
  );

  const [stageIdx, setStageIdx] = useState(0);

  // Advance through the stages
  useEffect(() => {
    let cancelled = false;
    let cumulative = 0;
    const timers: number[] = [];

    STAGES.forEach((s, i) => {
      cumulative += s.duration;
      const id = window.setTimeout(() => {
        if (!cancelled) setStageIdx(i + 1);
      }, cumulative);
      timers.push(id);
    });

    // Kick off the real backend result fetch in parallel; navigate after both stages + fetch complete.
    const animTotal = STAGES.reduce((sum, s) => sum + s.duration, 0);
    const fetchPromise = getExamResult(sessionId);
    const animPromise = new Promise<void>((resolve) =>
      timers.push(window.setTimeout(() => resolve(), animTotal)),
    );

    Promise.all([fetchPromise, animPromise]).then(([result]) => {
      if (cancelled) return;
      navigate("/app/exam/result", {
        replace: true,
        state: { sessionId, result },
      });
    });

    return () => {
      cancelled = true;
      timers.forEach(window.clearTimeout);
    };
  }, [navigate, sessionId, STAGES]);

  const progress = Math.min(100, (stageIdx / STAGES.length) * 100);

  return (
    <div
      style={{
        height: "100%",
        background: pal.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div style={{ marginBottom: 28 }}>
        <Logo pal={pal} size={20} />
      </div>

      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          marginBottom: 10,
          textAlign: "center",
          maxWidth: 540,
        }}
      >
        {t("Analyzing your answers…")}
      </div>
      <div
        style={{
          fontSize: 14,
          color: pal.muted,
          textAlign: "center",
          maxWidth: 460,
          lineHeight: 1.55,
          marginBottom: 36,
        }}
      >
        {t(
          "Hold tight — we're running your answers through the same Rasch-calibrated engine the BMBA uses and generating a diagnostic report.",
        )}
      </div>

      <div
        style={{
          width: "min(540px, 100%)",
          background: pal.surface,
          border: `1px solid ${pal.line}`,
          borderRadius: 20,
          padding: 22,
          boxShadow: "0 30px 70px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            height: 6,
            background: pal.line,
            borderRadius: 999,
            overflow: "hidden",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: pal.primary,
              transition: "width 0.5s ease",
            }}
          />
        </div>

        {STAGES.map((s, i) => {
          const done = i < stageIdx;
          const active = i === stageIdx;
          const pending = i > stageIdx;
          return (
            <div
              key={s.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                opacity: pending ? 0.45 : 1,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: done
                    ? pal.primary
                    : active
                      ? pal.accent
                      : pal.surfaceAlt,
                  color: done
                    ? pal.primaryInk
                    : active
                      ? pal.accentInk
                      : pal.muted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                {done ? (
                  <Icon name="check" size={14} stroke={2.5} />
                ) : active ? (
                  <span
                    style={{
                      display: "block",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      border: `2px solid ${pal.accentInk}`,
                      borderTopColor: "transparent",
                      animation: "coachai-spin 0.9s linear infinite",
                    }}
                  />
                ) : (
                  <Icon name={s.icon} size={13} color={pal.muted} />
                )}
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  color: done ? pal.muted : pal.text,
                  letterSpacing: "-0.01em",
                  textDecoration: done ? "line-through" : "none",
                }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`@keyframes coachai-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
