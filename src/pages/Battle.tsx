import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { Avatar, Btn, Card, Pill } from "@/components/ui/Primitives";
import { useIsAtMostTablet, useIsMobile } from "@/hooks/useMediaQuery";
import {
  challengeFriend,
  createFriendBattleInvite,
  findRankedMatch,
  getBattleHistory,
  getFriendsOnline,
  getLiveBattles,
  startAIBattle,
  type BattleHistoryItem,
  type BattleTier,
  type FriendOnline,
  type LiveBattle,
  type SubjectCode,
} from "@/lib/api";

const SUBJECT_OPTIONS: { code: SubjectCode; label: string }[] = [
  { code: "MATH", label: "Mathematics" },
  { code: "PHYS", label: "Physics" },
  { code: "CHEM", label: "Chemistry" },
  { code: "BIO", label: "Biology" },
  { code: "HIST", label: "History" },
  { code: "GEOG", label: "Geography" },
  { code: "UZB_LIT", label: "Uzbek lit" },
];

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

export default function Battle() {
  const t = useT();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isAtMostTablet = useIsAtMostTablet();
  const [subject, setSubject] = useState<SubjectCode>("MATH");
  const [tier, setTier] = useState<BattleTier>("Silver");
  const [busy, setBusy] = useState<string | null>(null);
  const [liveBattles, setLiveBattles] = useState<LiveBattle[]>([]);
  const [history, setHistory] = useState<BattleHistoryItem[]>([]);
  const [friends, setFriends] = useState<FriendOnline[]>([]);

  useEffect(() => {
    let live = true;
    (async () => {
      const [lb, hist, fr] = await Promise.all([
        getLiveBattles(),
        getBattleHistory(),
        getFriendsOnline(),
      ]);
      if (!live) return;
      setLiveBattles(lb);
      setHistory(hist);
      setFriends(fr);
    })();
    return () => {
      live = false;
    };
  }, []);

  const handleFindOpponent = async () => {
    if (busy) return;
    setBusy("ranked");
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
      toast.error(t("Could not find a match. Try again."));
    } finally {
      setBusy(null);
    }
  };

  const handleAIBattle = async () => {
    if (busy) return;
    setBusy("ai");
    try {
      const m = await startAIBattle(subject, tier);
      navigate("/app/battle/matchmaking", {
        state: {
          subject,
          mode: "ai",
          opponentId: m.opponentId,
          opponentName: m.opponentName,
        },
      });
    } catch {
      toast.error(t("Could not start AI battle."));
    } finally {
      setBusy(null);
    }
  };

  const handleInviteFriend = async () => {
    if (busy) return;
    setBusy("invite");
    try {
      const { url } = await createFriendBattleInvite(subject);
      try {
        await navigator.clipboard.writeText(url);
        toast.success(t("Invite link copied to clipboard"));
      } catch {
        toast(t("Invite link"), { description: url });
      }
    } catch {
      toast.error(t("Could not create invite."));
    } finally {
      setBusy(null);
    }
  };

  const handleChallengeFriend = async (friendId: string, name: string) => {
    if (busy) return;
    setBusy(`fr-${friendId}`);
    try {
      await challengeFriend(friendId, subject);
      navigate("/app/battle/matchmaking", {
        state: {
          subject,
          mode: "friend",
          opponentId: friendId,
          opponentName: name,
        },
      });
    } catch {
      toast.error(t("Could not send challenge."));
    } finally {
      setBusy(null);
    }
  };

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
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            {t("Find a match")}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Pill
            pal={pal}
            tone="accentSoft"
            icon={<Icon name="bolt" size={12} />}
          >
            17/30 {t("Daily battles played")}
          </Pill>
          <Pill
            pal={pal}
            tone="outline"
            icon={<Icon name="trophy" size={12} />}
          >
            #47 {t("Tashkent")}
          </Pill>
        </div>
      </div>

      <div
        style={{
          padding: isMobile ? "16px" : "24px 32px",
          display: "grid",
          gridTemplateColumns: isAtMostTablet ? "1fr" : "1.4fr 1fr",
          gap: 20,
        }}
      >
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SUBJECT_OPTIONS.map((s) => {
              const on = s.code === subject;
              return (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => setSubject(s.code)}
                  style={{
                    padding: "6px 14px",
                    fontSize: 13,
                    borderRadius: 999,
                    border: `1px solid ${on ? pal.primary : pal.line}`,
                    background: on ? pal.primary : "transparent",
                    color: on ? pal.primaryInk : pal.text,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  {t(s.label)}
                </button>
              );
            })}
          </div>

          {/* Quick match hero */}
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
                right: -30,
                top: -30,
                opacity: 0.18,
              }}
            >
              <Icon name="swords" size={280} color={pal.primaryInk} />
            </div>
            <div
              style={{
                position: "absolute",
                right: 40,
                bottom: -10,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: pal.accent,
                opacity: 0.4,
                filter: "blur(40px)",
              }}
            />
            <div style={{ position: "relative", padding: isMobile ? 20 : 32 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  opacity: 0.85,
                }}
              >
                {t("Ranked")} · {t("Quick Match")}
              </div>
              <div
                style={{
                  fontSize: isMobile ? 26 : 40,
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  marginTop: 8,
                  lineHeight: 1.05,
                }}
              >
                {t(SUBJECT_LABELS[subject])} · 10 Q
              </div>
              <div
                style={{
                  fontSize: 14,
                  opacity: 0.85,
                  marginTop: 8,
                  maxWidth: 380,
                }}
              >
                {t("10 questions · 5 min · find opponent in 30s")}
              </div>
              <div style={{ marginTop: 22, display: "flex", gap: 24 }}>
                {[
                  { label: "ELO", value: "1487" },
                  { label: t("Streak"), value: "4W" },
                  { label: t("Tier"), value: t("Silver") },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontSize: 11,
                        opacity: 0.7,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        fontFamily: '"JetBrains Mono", monospace',
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
                <Btn
                  pal={pal}
                  tone="accent"
                  size="lg"
                  iconAfter={<Icon name="arrow-right" size={16} />}
                  onClick={handleFindOpponent}
                >
                  {busy === "ranked" ? t("Finding opponent…") : t("Find opponent")}
                </Btn>
                <Btn
                  pal={pal}
                  tone="ghost"
                  size="lg"
                  dark
                  style={{ color: pal.primaryInk, opacity: 0.85 }}
                  onClick={() =>
                    toast.info(
                      t("Topic filter coming soon — for now we match across all topics."),
                    )
                  }
                >
                  {t("Sequences & series")}
                </Btn>
              </div>
            </div>
          </Card>

          {/* Friend + AI */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 12,
            }}
          >
            <Card pal={pal} pad={22}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: pal.accentSoft,
                  color: pal.accentInk,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <Icon name="users" size={20} />
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {t("Friend Battle")}
              </div>
              <div style={{ fontSize: 12, color: pal.muted, marginTop: 4 }}>
                {t("Invite by link · unranked")}
              </div>
              <div style={{ marginTop: 14, display: "flex", gap: 6 }}>
                <Btn
                  pal={pal}
                  tone="outline"
                  size="sm"
                  full
                  onClick={handleInviteFriend}
                >
                  {busy === "invite" ? t("Creating link…") : t("Invite friend")}
                </Btn>
              </div>
            </Card>
            <Card pal={pal} pad={22}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: pal.surfaceAlt,
                  border: `1px solid ${pal.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <Icon name="sparkle" size={20} />
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {t("vs AI bot")}
              </div>
              <div style={{ fontSize: 12, color: pal.muted, marginTop: 4 }}>
                {t("Instant start · ranked (capped)")}
              </div>
              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 4,
                }}
              >
                {(["Bronze", "Silver", "Gold", "Plat"] as const).map((b) => {
                  const on = b === tier;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setTier(b)}
                      style={{
                        padding: "6px 0",
                        textAlign: "center",
                        borderRadius: 8,
                        border: `1px solid ${on ? pal.primary : pal.line}`,
                        background: on ? pal.primarySoft : "transparent",
                        color: on ? pal.primary : pal.muted,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {t(b)}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 10 }}>
                <Btn
                  pal={pal}
                  tone="outline"
                  size="sm"
                  full
                  onClick={handleAIBattle}
                >
                  {busy === "ai" ? t("Starting…") : t("Start AI battle")}
                </Btn>
              </div>
            </Card>
          </div>

          {/* Recent battles */}
          <Card pal={pal} pad={0}>
            <div
              style={{
                padding: "16px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderBottom: `1px solid ${pal.line}`,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                {t("Recent battles")}
              </div>
              <button
                type="button"
                onClick={() => navigate("/app/leaderboard")}
                style={{
                  fontSize: 12,
                  color: pal.primary,
                  fontWeight: 600,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {t("History")} →
              </button>
            </div>
            {history.map((b, i, arr) => (
              <div
                key={b.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile
                    ? "36px 1fr 60px"
                    : "40px 1fr 100px 80px 60px 60px",
                  alignItems: "center",
                  gap: 10,
                  padding: isMobile ? "12px 14px" : "14px 22px",
                  borderBottom:
                    i < arr.length - 1 ? `1px solid ${pal.line}` : "none",
                }}
              >
                <Avatar name={b.opponentName} size={36} hue={(i * 71) % 360} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{b.opponentName}</div>
                  <div style={{ fontSize: 11, color: pal.muted }}>
                    {t(SUBJECT_LABELS[b.subject])} · {b.ago}
                  </div>
                </div>
                {!isMobile && (
                  <div
                    style={{
                      fontSize: 12,
                      color: pal.muted,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    {b.score}
                  </div>
                )}
                {!isMobile && (
                  <div
                    style={{
                      fontSize: 12,
                      color: pal.muted,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    {b.result}
                  </div>
                )}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: b.won ? pal.good : pal.bad,
                    fontFamily: '"JetBrains Mono", monospace',
                    textAlign: isMobile ? "right" : "left",
                  }}
                >
                  {b.won ? "+" : ""}
                  {b.delta}
                </span>
                {!isMobile && <Icon name="chev-right" size={16} color={pal.muted} />}
              </div>
            ))}
          </Card>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Live */}
          <Card pal={pal} pad={20}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: pal.bad,
                  boxShadow: `0 0 0 4px ${pal.bad}30`,
                }}
              />
              <div style={{ fontSize: 14, fontWeight: 700 }}>
                {t("Live now")}
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: pal.muted,
                  marginLeft: "auto",
                }}
              >
                248 {t("in progress")}
              </span>
            </div>
            {liveBattles.map((lb, i) => {
              const m = {
                a: lb.a.name,
                b: lb.b.name,
                ae: lb.a.elo,
                be: lb.b.elo,
                q: lb.question,
              };
              return (
              <div
                key={lb.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 0",
                  borderTop: i ? `1px solid ${pal.line}` : "none",
                }}
              >
                <Avatar name={m.a} size={26} hue={(i * 50) % 360} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>{m.a}</div>
                  <div
                    style={{
                      fontSize: 10,
                      color: pal.muted,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    {m.ae}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: pal.muted,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  Q{m.q}/10
                </span>
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: "right",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600 }}>{m.b}</div>
                  <div
                    style={{
                      fontSize: 10,
                      color: pal.muted,
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    {m.be}
                  </div>
                </div>
                <Avatar name={m.b} size={26} hue={((i + 5) * 50) % 360} />
              </div>
              );
            })}
          </Card>

          {/* Friends online */}
          <Card pal={pal} pad={20}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700 }}>
                {t("Friends online")}
              </div>
              <span style={{ fontSize: 11, color: pal.muted }}>3 of 12</span>
            </div>
            {friends.map((f, i) => (
              <div
                key={f.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                }}
              >
                <div style={{ position: "relative" }}>
                  <Avatar name={f.name} size={32} hue={[20, 320, 100][i % 3]} />
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: pal.good,
                      border: `2px solid ${pal.surface}`,
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{f.name}</div>
                  <div style={{ fontSize: 10, color: pal.muted }}>
                    {t(f.status)} · ELO {f.elo}
                  </div>
                </div>
                <Btn
                  pal={pal}
                  tone="soft"
                  size="sm"
                  onClick={() => handleChallengeFriend(f.id, f.name)}
                >
                  {busy === `fr-${f.id}` ? t("Starting…") : t("Challenge")}
                </Btn>
              </div>
            ))}
          </Card>

          {/* Tier */}
          <Card pal={pal} pad={20} style={{ background: pal.surfaceAlt }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: pal.muted,
                marginBottom: 6,
              }}
            >
              {t("Tier")}
            </div>
            <div
              style={{ display: "flex", alignItems: "baseline", gap: 8 }}
            >
              <span style={{ fontSize: 22, fontWeight: 700 }}>
                {t("Silver")}
              </span>
              <span style={{ fontSize: 12, color: pal.muted }}>
                → {t("Gold")} {t("at")} 1600
              </span>
            </div>
            <div
              style={{
                marginTop: 10,
                height: 10,
                borderRadius: 999,
                background: pal.line,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "72%",
                  height: "100%",
                  background: pal.primary,
                }}
              />
            </div>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 10,
                color: pal.muted,
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              <span>1200</span>
              <span style={{ color: pal.primary, fontWeight: 700 }}>1487</span>
              <span>1600</span>
            </div>
            <div
              style={{
                fontSize: 12,
                color: pal.muted,
                marginTop: 12,
              }}
            >
              {t("You're 8 wins from Gold tier (1600)")}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
