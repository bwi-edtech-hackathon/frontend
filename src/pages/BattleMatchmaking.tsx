import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { Btn, Pill } from "@/components/ui/Primitives";
import { startBattleSession, type SubjectCode } from "@/lib/api";

type LocationState = {
  subject?: SubjectCode;
  mode?: "ranked" | "friend" | "ai";
  opponentId?: string;
  opponentName?: string;
};

const SUBJECT_LABELS: Record<SubjectCode, string> = {
  MATH: "Mathematics",
  PHYS: "Physics",
  CHEM: "Chemistry",
  BIO: "Biology",
  HIST: "History",
  GEOG: "Geography",
  UZB_LIT: "Uzbek lit",
  RUS_LIT: "Russian lit",
  KAR_LIT: "Karakalpak",
};

export default function BattleMatchmaking() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const subject: SubjectCode = state.subject ?? "MATH";
  const mode = state.mode ?? "ranked";
  const cancelled = useRef(false);
  const [eta, setEta] = useState(12);

  useEffect(() => {
    let live = true;
    cancelled.current = false;

    const tick = setInterval(() => {
      setEta((v) => (v > 0 ? v - 1 : 0));
    }, 1000);

    // Hard ceiling: if matchmaking hasn't produced a battle in 15s, fall back
    // to the Battle landing page so the user is never left staring at the
    // pulsing avatar.
    const watchdog = setTimeout(() => {
      if (!live || cancelled.current) return;
      toast.info(t("No match found — try AI bot instead."));
      navigate("/app/battle", { replace: true });
    }, 15_000);

    (async () => {
      let session;
      try {
        session = await startBattleSession({
          subject,
          // If matchmaking can't pair humans (mode === "ranked" / "friend"),
          // fall back to the Default-level AI so the flow doesn't stall.
          mode: mode === "ranked" || mode === "friend" ? "ai" : mode,
          opponentId: state.opponentId,
          opponentName: state.opponentName,
        });
      } catch (err) {
        if (!live || cancelled.current) return;
        clearTimeout(watchdog);
        const message = err instanceof Error ? err.message : "";
        toast.error(
          t("Could not start battle.") + (message ? ` (${message})` : ""),
        );
        navigate("/app/battle", { replace: true });
        return;
      }
      // Brief delay so the matchmaking animation has a moment to play.
      setTimeout(() => {
        if (!live || cancelled.current) return;
        clearTimeout(watchdog);
        navigate("/app/battle/active", {
          replace: true,
          state: { sessionId: session.id, subject, mode },
        });
      }, 2000);
    })();

    return () => {
      live = false;
      cancelled.current = true;
      clearInterval(tick);
      clearTimeout(watchdog);
    };
  }, [subject, mode, state.opponentId, state.opponentName, navigate, t]);

  const handleCancel = () => {
    cancelled.current = true;
    navigate("/app/battle", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: pal.bg,
        color: pal.text,
        padding: "32px 20px 110px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes mm-pulse {
          0% { transform: scale(0.7); opacity: 0.6; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes mm-rotate {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
      `}</style>

      {/* Subject pills */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        <Pill pal={pal} tone="outline">
          {t(SUBJECT_LABELS[subject])}
        </Pill>
        <Pill pal={pal} tone="primarySoft">
          {mode === "ai" ? t("AI bot") : t("Silver tier")}
        </Pill>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          {t("Finding opponent…")}
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: pal.muted }}>
          {t("Matching skill level near ELO 1487")}
        </p>
      </div>

      {/* Pulsing avatar */}
      <div
        style={{
          position: "relative",
          width: 240,
          height: 240,
          margin: "60px auto 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {[0, 0.5, 1].map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              border: `2px solid ${pal.primary}`,
              borderRadius: "50%",
              animation: `mm-pulse 1.8s ease-out ${d}s infinite`,
            }}
          />
        ))}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: pal.primary,
            color: pal.primaryInk,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 48,
            letterSpacing: "-0.03em",
            boxShadow: `0 14px 40px ${pal.primary}40`,
            animation: "mm-rotate 4s ease-in-out infinite",
          }}
        >
          D
        </div>
      </div>

      {/* Wait estimate */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: pal.muted,
            marginBottom: 6,
          }}
        >
          {t("Estimated wait")}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          ~{eta}s
        </div>
      </div>

      {/* Fallback note */}
      <div style={{ textAlign: "center", marginTop: 20, padding: "0 32px" }}>
        <span style={{ fontSize: 12, color: pal.muted }}>
          {t("No human match in 30s? We'll offer a Silver AI bot.")}
        </span>
      </div>

      {/* Cancel */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Btn
          pal={pal}
          tone="outline"
          size="md"
          icon={<Icon name="x" size={16} />}
          onClick={handleCancel}
        >
          {t("Cancel search")}
        </Btn>
      </div>
    </div>
  );
}
