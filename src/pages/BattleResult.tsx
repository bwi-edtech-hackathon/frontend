import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { Avatar, Btn, Card, Pill } from "@/components/ui/Primitives";
import {
  challengeFriend,
  findRankedMatch,
  getBattleResult,
  type BattleSummary,
  type SubjectCode,
} from "@/lib/api";

type LocationState = { sessionId?: string; subject?: SubjectCode };

const SUBJECT_LABELS: Record<SubjectCode, string> = {
  MATH: "Math",
  PHYS: "Physics",
  CHEM: "Chemistry",
  BIO: "Biology",
  HIST: "History",
  GEOG: "Geography",
  UZB_LIT: "Uzbek lit",
  RUS_LIT: "Russian lit",
  KAR_LIT: "Karakalpak",
};

export default function BattleResult() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const [summary, setSummary] = useState<BattleSummary | null>(null);
  const [matching, setMatching] = useState(false);
  const [rematching, setRematching] = useState(false);

  useEffect(() => {
    let live = true;
    getBattleResult(state.sessionId ?? "latest").then((s) => {
      if (live) setSummary(s);
    });
    return () => {
      live = false;
    };
  }, [state.sessionId]);

  const handleRematch = async () => {
    if (!summary || rematching) return;
    setRematching(true);
    try {
      await challengeFriend(summary.opponent.id, summary.subject);
      navigate("/app/battle/matchmaking", {
        state: {
          subject: summary.subject,
          mode: "friend",
          opponentId: summary.opponent.id,
          opponentName: summary.opponent.name,
        },
      });
    } catch {
      toast.error(t("Could not start rematch."));
    } finally {
      setRematching(false);
    }
  };

  const handleQuickAgain = async () => {
    if (!summary || matching) return;
    setMatching(true);
    try {
      const m = await findRankedMatch(summary.subject);
      navigate("/app/battle/matchmaking", {
        state: {
          subject: summary.subject,
          mode: "ranked",
          opponentName: m.opponentName,
        },
      });
    } catch {
      toast.error(t("Could not find a match."));
    } finally {
      setMatching(false);
    }
  };

  const handleShare = async () => {
    if (!summary) return;
    const text = t("I beat {name} {y}–{o} in {subj} on CoachAI ⚔️")
      .replace("{name}", summary.opponent.name.split(" ")[0])
      .replace("{y}", String(summary.yourCorrect))
      .replace("{o}", String(summary.opponentCorrect))
      .replace("{subj}", t(SUBJECT_LABELS[summary.subject]));
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      toast.success(t("Result copied to clipboard"));
    } catch {
      toast(t("Share"), { description: text });
    }
  };

  if (!summary) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: pal.muted,
          fontSize: 14,
        }}
      >
        {t("Tallying the scoreboard…")}
      </div>
    );
  }

  const won = summary.outcome === "won";
  const draw = summary.outcome === "draw";
  const headline = won ? t("Victory") : draw ? t("Draw") : t("Defeat");
  const headlineColor = won ? pal.primary : draw ? pal.text : pal.bad;
  const eloLabel =
    summary.eloDelta > 0
      ? `+${summary.eloDelta} ELO`
      : `${summary.eloDelta} ELO`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: pal.bg,
        color: pal.text,
        padding: "28px 20px 36px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {won && (
        <>
          <style>{`
            @keyframes coachai-confetti {
              0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            {Array.from({ length: 32 }).map((_, i) => {
              const colors = [pal.primary, pal.accent, pal.warn, pal.good];
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${(i * 37) % 100}%`,
                    top: "-5%",
                    width: 8 + (i % 4) * 2,
                    height: 12 + (i % 3) * 3,
                    background: colors[i % colors.length],
                    borderRadius: 2,
                    animation: `coachai-confetti ${3 + (i % 4) * 0.5}s ease-out ${(i % 6) * 0.2}s infinite`,
                  }}
                />
              );
            })}
          </div>
        </>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: pal.muted,
              marginBottom: 8,
            }}
          >
            {t("Quick Match")} · {t(SUBJECT_LABELS[summary.subject])}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: headlineColor,
              lineHeight: 1,
            }}
          >
            {headline}
          </h1>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Pill
              pal={pal}
              tone="accentSoft"
              icon={<Icon name="flame" size={13} />}
            >
              {summary.streak} {t("win streak")}
            </Pill>
            <Pill
              pal={pal}
              tone={summary.eloDelta >= 0 ? "primarySoft" : "bad"}
              icon={<Icon name="medal" size={13} />}
            >
              {eloLabel}
            </Pill>
          </div>
        </div>

        {/* Scoreboard */}
        <div style={{ padding: "28px 0 0", maxWidth: 520, margin: "0 auto" }}>
          <Card pal={pal} pad={20}>
            <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
              <ScorePanel
                avatarName="Diana"
                avatarHue={20}
                ringColor={pal.primary}
                label={t("You")}
                score={summary.yourScore}
                scoreColor={pal.primary}
                sub={`${summary.yourCorrect}/${summary.totalQuestions} ${t("correct")}`}
              />
              <div style={{ width: 1, background: pal.line, margin: "0 8px" }} />
              <ScorePanel
                avatarName={summary.opponent.name}
                avatarHue={summary.opponent.avatarHue}
                label={summary.opponent.name.split(" ")[0]}
                score={summary.opponentScore}
                scoreColor={pal.text}
                scoreDim
                sub={`${summary.opponentCorrect}/${summary.totalQuestions} ${t("correct")}`}
              />
            </div>
          </Card>
        </div>

        {/* Per-question breakdown */}
        <div style={{ marginTop: 28, maxWidth: 520, margin: "28px auto 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: pal.muted,
              }}
            >
              {t("Question breakdown")}
            </div>
            <button
              type="button"
              onClick={() => navigate("/app/chat")}
              style={{
                fontSize: 12,
                color: pal.primary,
                fontWeight: 700,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {t("Review all")} →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {summary.breakdown.slice(0, 6).map((r) => {
              const youColor = r.yourCorrect ? "#E4F2E7" : "#FBE2DF";
              const opColor = r.opponentCorrect ? "#E4F2E7" : "#FBE2DF";
              return (
                <div
                  key={r.qIndex}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    background: pal.surface,
                    borderRadius: 12,
                    border: `1px solid ${pal.line}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: pal.muted,
                      fontFamily: '"JetBrains Mono", monospace',
                      width: 28,
                    }}
                  >
                    Q{r.qIndex + 1}
                  </span>
                  <div
                    title={t("You")}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: youColor,
                      color: r.yourCorrect ? pal.good : pal.bad,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={r.yourCorrect ? "check" : "x"} size={12} stroke={2.5} />
                  </div>
                  <div
                    title={summary.opponent.name}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: opColor,
                      color: r.opponentCorrect ? pal.good : pal.bad,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0.65,
                    }}
                  >
                    <Icon name={r.opponentCorrect ? "check" : "x"} size={12} stroke={2.5} />
                  </div>
                  <div style={{ flex: 1, fontSize: 12, color: pal.muted }}>
                    {!r.yourCorrect ? (
                      <button
                        type="button"
                        onClick={() => navigate("/app/chat")}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: pal.primary,
                          fontWeight: 700,
                          cursor: "pointer",
                          padding: 0,
                          font: "inherit",
                        }}
                      >
                        {t("Explain")} · {r.topic} →
                      </button>
                    ) : (
                      <span>{r.topic}</span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: pal.muted,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    {(r.yourTimeMs / 1000).toFixed(1)}s
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <div
          style={{
            marginTop: 28,
            maxWidth: 520,
            margin: "28px auto 0",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Btn
            pal={pal}
            tone="primary"
            size="lg"
            full
            icon={<Icon name="swords" size={18} />}
            onClick={handleRematch}
          >
            {rematching
              ? t("Starting…")
              : t("Rematch {name}").replace(
                  "{name}",
                  summary.opponent.name.split(" ")[0],
                )}
          </Btn>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn pal={pal} tone="outline" size="md" full onClick={handleQuickAgain}>
              {matching ? t("Finding opponent…") : t("Quick Match again")}
            </Btn>
            <Btn pal={pal} tone="outline" size="md" full onClick={handleShare}>
              {t("Share")}
            </Btn>
          </div>
          <Btn
            pal={pal}
            tone="ghost"
            size="md"
            full
            onClick={() => navigate("/app")}
          >
            {t("Back to dashboard")}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function ScorePanel({
  avatarName,
  avatarHue,
  ringColor,
  label,
  score,
  scoreColor,
  scoreDim,
  sub,
}: {
  avatarName: string;
  avatarHue: number;
  ringColor?: string;
  label: string;
  score: number;
  scoreColor: string;
  scoreDim?: boolean;
  sub: string;
}) {
  return (
    <div style={{ flex: 1, textAlign: "center", padding: "6px 0" }}>
      <Avatar name={avatarName} size={52} hue={avatarHue} ring={ringColor} />
      <div style={{ fontSize: 12, color: pal.muted, marginTop: 8 }}>{label}</div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: scoreColor,
          lineHeight: 1,
          marginTop: 4,
          opacity: scoreDim ? 0.6 : 1,
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        {score}
      </div>
      <div style={{ fontSize: 11, color: pal.muted, marginTop: 4 }}>{sub}</div>
    </div>
  );
}
