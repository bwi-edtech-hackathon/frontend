import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Btn, Card, MathPill, Pill, Progress } from "@/components/ui/Primitives";
import { CoachMessage } from "@/components/ui/CoachMessage";
import { useIsAtMostTablet, useIsMobile } from "@/hooks/useMediaQuery";
import {
  createChatSession,
  endChatSession,
  getChatHistory,
  listChatSessions,
  markUnderstood,
  streamChatMessage,
  type ChatSessionSummary,
} from "@/lib/api";

type LocalMessage =
  | { id: string; role: "coach"; nodes: React.ReactNode }
  | { id: string; role: "user"; text: string };

export default function ChatLesson() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isAtMostTablet = useIsAtMostTablet();
  const navState = (location.state ?? {}) as {
    chatId?: string;
    source?: string;
  };
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(
    navState.chatId ?? null,
  );
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [coachThinking, setCoachThinking] = useState(true);
  const [messages, setMessages] = useState<LocalMessage[]>(() =>
    navState.chatId ? [] : seedMessages(t),
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const streamAbortRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      streamAbortRef.current?.();
    };
  }, []);

  // If the user arrived from "Analyze with AI", switch to that exact session
  // even if the listSessions request hasn't returned yet — the navState id is
  // canonical.
  useEffect(() => {
    if (navState.chatId) setActiveId(navState.chatId);
    // We deliberately key on the id string so a back-and-forth nav with the
    // same id doesn't re-trigger the effect.
  }, [navState.chatId]);

  useEffect(() => {
    let live = true;
    listChatSessions().then((s) => {
      if (!live) return;
      setSessions(s);
      // Honour the routed chat id first; otherwise fall back to the most
      // recently active session.
      if (navState.chatId && s.some((x) => x.id === navState.chatId)) {
        setActiveId(navState.chatId);
      } else if (!activeId) {
        const active = s.find((x) => x.status === "active") ?? s[0];
        if (active) setActiveId(active.id);
      }
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navState.chatId]);

  // Load the real, persisted history whenever the active session changes.
  // Without this the page only shows the hardcoded seedMessages() after a
  // refresh, making it look like the user's typed messages were lost.
  useEffect(() => {
    if (!activeId) return;
    let live = true;
    getChatHistory(activeId)
      .then((history) => {
        if (!live || history.length === 0) return;
        setMessages(
          history.map((m) =>
            m.role === "user"
              ? { id: m.id, role: "user", text: m.text }
              : { id: m.id, role: "coach", nodes: m.text },
          ),
        );
        setCoachThinking(false);
      })
      .catch(() => {
        /* keep seed messages if the history call fails */
      });
    return () => {
      live = false;
    };
  }, [activeId]);

  useEffect(() => {
    const id = setTimeout(() => setCoachThinking(false), 1200);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, coachThinking]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    const userMsg: LocalMessage = { id: `u-${Date.now()}`, role: "user", text };
    const coachId = `c-${Date.now()}`;
    setMessages((m) => [
      ...m,
      userMsg,
      { id: coachId, role: "coach", nodes: "" },
    ]);
    setSending(true);
    setCoachThinking(true);

    // Stream coach reply from the WebSocket endpoint.
    let buffer = "";
    const appendCoach = (chunk: string) => {
      buffer += chunk;
      setMessages((m) =>
        m.map((msg) =>
          msg.id === coachId && msg.role === "coach"
            ? { ...msg, nodes: buffer }
            : msg,
        ),
      );
    };

    const cleanup = streamChatMessage(activeId ?? "current", text, {
      onToken: (content) => {
        setCoachThinking(false);
        appendCoach(content);
      },
      onMathInline: (latex) => appendCoach(`$${latex}$`),
      onMathBlock: (latex) => appendCoach(`\n\n$$${latex}$$\n\n`),
      onDiagram: (mermaid) => appendCoach(`\n\n[diagram]\n${mermaid}\n\n`),
      onDone: () => {
        setSending(false);
        setCoachThinking(false);
      },
      onError: (err) => {
        toast.error(
          t("Coach is offline. Try again in a moment.") +
            (err.message ? ` (${err.message})` : ""),
        );
        setSending(false);
        setCoachThinking(false);
      },
    });
    // Allow component unmount to abort the stream.
    streamAbortRef.current = cleanup;
  };

  const handleNewSession = async () => {
    const s = await createChatSession();
    const summary: ChatSessionSummary = {
      id: s.id,
      topic: s.topic,
      preview: t("Just started"),
      when: "Now",
      status: "active",
    };
    setSessions((prev) => [summary, ...prev]);
    setActiveId(s.id);
    setMessages([
      {
        id: "coach-intro",
        role: "coach",
        nodes: t("New session started. What topic should we work on?"),
      },
    ]);
    setCoachThinking(false);
  };

  const handlePickSession = (id: string) => {
    setActiveId(id);
    const s = sessions.find((x) => x.id === id);
    if (s) {
      setMessages([
        {
          id: `coach-resume-${id}`,
          role: "coach",
          nodes: t("Resumed: {topic}. Where did we leave off?").replace(
            "{topic}",
            s.topic,
          ),
        },
      ]);
    }
  };

  const handleUnderstood = async () => {
    if (!activeId) return;
    await markUnderstood(activeId);
    toast.success(t("Marked as understood — moving on."));
    setMessages((m) => [
      ...m,
      {
        id: `coach-ok-${Date.now()}`,
        role: "coach",
        nodes: t("Great. Let's try one more on your own before we move on."),
      },
    ]);
  };

  const handleEndSession = async () => {
    if (!activeId) return;
    await endChatSession(activeId);
    toast.success(t("Session ended."));
    navigate("/app");
  };

  const handleAttach = (name: IconName) => {
    if (name === "image") {
      toast.info(t("Image upload — connect once backend storage is ready."));
      return;
    }
    if (name === "mic") {
      toast.info(t("Voice notes coming soon."));
      return;
    }
    toast.info(t("Coach suggestions coming soon."));
  };

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      {/* Sessions left rail — hidden on small screens */}
      <div
        style={{
          width: 260,
          background: pal.surface,
          borderRight: `1px solid ${pal.line}`,
          padding: 16,
          display: isAtMostTablet ? "none" : "flex",
          flexDirection: "column",
          gap: 8,
          overflow: "auto",
        }}
      >
        <Btn
          pal={pal}
          tone="primary"
          size="md"
          full
          icon={<Icon name="plus" size={14} />}
          onClick={handleNewSession}
        >
          {t("New session")}
        </Btn>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: pal.muted,
            marginTop: 12,
            marginBottom: 6,
          }}
        >
          {t("Recent sessions")}
        </div>
        {sessions.map((s) => {
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handlePickSession(s.id)}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                background: active ? pal.primarySoft : "transparent",
                border: active
                  ? `1px solid ${pal.primary}`
                  : "1px solid transparent",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "inherit",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: active ? pal.primary : pal.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t(s.topic)}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color: pal.muted,
                    flexShrink: 0,
                  }}
                >
                  {s.when}
                </span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: pal.muted,
                  marginTop: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {s.preview}
              </div>
            </button>
          );
        })}
      </div>

      {/* Center — chat */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: isMobile ? "10px 14px" : "14px 28px",
            borderBottom: `1px solid ${pal.line}`,
            background: pal.surface,
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 8 : 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 11,
                color: pal.muted,
                letterSpacing: "0.04em",
              }}
            >
              {t("Topic")} · {t("Algebra")}
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: "-0.015em",
              }}
            >
              {t("Quadratic equations")}
            </div>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Progress
                value={70}
                pal={pal}
                height={6}
                color={pal.primary}
                style={{ width: 140 }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: pal.muted,
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                70%
              </span>
            </div>
          )}
          <Btn pal={pal} tone="soft" size="sm" onClick={handleUnderstood}>
            {t("I get it")}
          </Btn>
          {!isMobile && (
            <Btn pal={pal} tone="outline" size="sm" onClick={handleEndSession}>
              {t("End session")}
            </Btn>
          )}
        </div>

        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflow: "auto",
            padding: isMobile ? "20px 14px" : "32px 80px",
          }}
        >
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {messages.map((m) =>
              m.role === "coach" ? (
                <div key={m.id} style={{ display: "flex", gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background: pal.primarySoft,
                      color: pal.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="logo" size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        background: pal.surface,
                        border: `1px solid ${pal.line}`,
                        padding: "14px 18px",
                        borderRadius: 18,
                        borderTopLeftRadius: 6,
                        fontSize: 15,
                        lineHeight: 1.55,
                      }}
                    >
                      {typeof m.nodes === "string" ? (
                        <CoachMessage text={m.nodes} pal={pal} />
                      ) : (
                        m.nodes
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={m.id}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      background: pal.primary,
                      color: pal.primaryInk,
                      padding: "12px 18px",
                      borderRadius: 18,
                      borderTopRightRadius: 6,
                      fontSize: 15,
                      lineHeight: 1.4,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ),
            )}

            {coachThinking && (
              <div style={{ display: "flex", gap: 12, paddingLeft: 48 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: pal.muted,
                        opacity: 0.4 + i * 0.2,
                      }}
                    />
                  ))}
                  <span
                    style={{
                      fontSize: 12,
                      color: pal.muted,
                      marginLeft: 6,
                    }}
                  >
                    {t("Coach is thinking…")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div
          style={{
            padding: isMobile ? "10px 14px 16px" : "14px 28px 22px",
            borderTop: `1px solid ${pal.line}`,
            background: pal.surface,
          }}
        >
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: pal.surfaceAlt,
                border: `1px solid ${pal.line}`,
                borderRadius: 16,
                padding: "10px 14px",
              }}
            >
              <input
                placeholder={t("Type your answer…")}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 14,
                  fontFamily: "inherit",
                  color: pal.text,
                }}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleSend();
                  }
                }}
              />
              {(["sparkle", "image", "mic"] as const).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleAttach(name)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "transparent",
                    border: "none",
                    color: pal.muted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Icon name={name} size={16} />
                </button>
              ))}
            </div>
            <Btn
              pal={pal}
              tone="primary"
              size="md"
              icon={<Icon name="send" size={14} />}
              style={{ height: 50, width: 50, padding: 0 }}
              onClick={handleSend}
            />
          </div>
        </div>
      </main>

      {/* Right rail — hidden on small screens */}
      <div
        style={{
          width: 280,
          background: pal.surface,
          borderLeft: `1px solid ${pal.line}`,
          padding: 20,
          overflow: "auto",
          display: isAtMostTablet ? "none" : "block",
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
          {t("Related formulas")}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            {
              name: t("Quadratic formula"),
              eq: "x = (−b ± √(b² − 4ac)) / 2a",
            },
            { name: t("Discriminant"), eq: "D = b² − 4ac" },
            {
              name: t("Vieta's theorem"),
              eq: "x₁ + x₂ = −b/a · x₁·x₂ = c/a",
            },
          ].map((f, i) => (
            <Card key={i} pal={pal} pad={12}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: pal.muted,
                  marginBottom: 4,
                  letterSpacing: "0.02em",
                }}
              >
                {f.name}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontFamily: '"Newsreader", serif',
                  fontStyle: "italic",
                }}
              >
                {f.eq}
              </div>
            </Card>
          ))}
        </div>

        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: pal.muted,
            marginTop: 24,
            marginBottom: 12,
          }}
        >
          {t("Session progress")}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: 12,
          }}
        >
          {[
            { l: t("Identified equation type"), done: true, active: false },
            { l: t("Recognized coefficients"), done: true, active: false },
            { l: t("Compute discriminant"), done: false, active: true },
            { l: t("Apply quadratic formula"), done: false, active: false },
            { l: t("Verify with practice"), done: false, active: false },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: s.done ? pal.muted : s.active ? pal.text : pal.muted,
                opacity: s.done ? 0.6 : 1,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: s.done
                    ? pal.primary
                    : s.active
                      ? pal.accent
                      : "transparent",
                  border: s.done || s.active ? "none" : `1.5px solid ${pal.line}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {s.done && (
                  <Icon
                    name="check"
                    size={9}
                    color={pal.primaryInk}
                    stroke={3}
                  />
                )}
              </div>
              <span
                style={{
                  fontWeight: s.active ? 600 : 400,
                  textDecoration: s.done ? "line-through" : "none",
                }}
              >
                {s.l}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 24,
            padding: 14,
            background: pal.accentSoft,
            color: pal.accentInk,
            borderRadius: 12,
            fontSize: 12,
            lineHeight: 1.45,
          }}
        >
          <strong>{t("Tip:")}</strong>{" "}
          {t("Drop an image of your handwritten work — the coach will read it.")}
        </div>
        <div style={{ height: 20 }} />
        <Pill pal={pal} tone="outline">
          {t("Session")}
        </Pill>
      </div>
    </div>
  );
}

function seedMessages(t: (k: string) => string): LocalMessage[] {
  return [
    {
      id: "seed-c-1",
      role: "coach",
      nodes: (
        <>
          {t("I see you struggled with this on your checkpoint:")}
          <MathPill pal={pal} block>
            x² − 5x + 6 = 0
          </MathPill>
          {t("Before we solve it, can you tell me what")}{" "}
          <em>{t("type")}</em> {t("of equation this is?")}
        </>
      ),
    },
    { id: "seed-u-1", role: "user", text: t("Quadratic?") },
    {
      id: "seed-c-2",
      role: "coach",
      nodes: (
        <>
          {t("Right. The general form is")}
          <MathPill pal={pal} block>
            ax² + bx + c = 0
          </MathPill>
          {t("In your equation, what are")}{" "}
          <MathPill pal={pal}>a</MathPill>,{" "}
          <MathPill pal={pal}>b</MathPill> {t("and")}{" "}
          <MathPill pal={pal}>c</MathPill>?
        </>
      ),
    },
    { id: "seed-u-2", role: "user", text: "a = 1, b = −5, c = 6" },
  ];
}
