import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import { Btn, Card, MathPill, Pill, Progress } from "@/components/ui/Primitives";

export default function ChatLesson() {
  const t = useT();

  const sessions = [
    {
      topic: t("Quadratic equations"),
      msg: "a = 1, b = -5, c = 6…",
      when: "Now",
      active: true,
    },
    {
      topic: t("Logarithms"),
      msg: "Master · 8 exchanges",
      when: "2h",
      active: false,
    },
    {
      topic: t("Vieta's theorem"),
      msg: "Mastered · 5 exchanges",
      when: "Yest.",
      active: false,
    },
    {
      topic: t("Discriminant"),
      msg: "Still struggling",
      when: "2d",
      active: false,
    },
    {
      topic: t("Linear equations"),
      msg: "Mastered · 4 exch.",
      when: "5d",
      active: false,
    },
  ];

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Sessions left rail */}
      <div
        style={{
          width: 260,
          background: pal.surface,
          borderRight: `1px solid ${pal.line}`,
          padding: 16,
          display: "flex",
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
        {sessions.map((s, i) => (
          <div
            key={i}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              background: s.active ? pal.primarySoft : "transparent",
              border: s.active
                ? `1px solid ${pal.primary}`
                : "1px solid transparent",
              cursor: "pointer",
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
                  color: s.active ? pal.primary : pal.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {s.topic}
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
              {s.msg}
            </div>
          </div>
        ))}
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
            padding: "14px 28px",
            borderBottom: `1px solid ${pal.line}`,
            background: pal.surface,
            display: "flex",
            alignItems: "center",
            gap: 16,
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
          <Btn pal={pal} tone="soft" size="sm">
            {t("I get it")}
          </Btn>
          <Btn pal={pal} tone="outline" size="sm">
            {t("End session")}
          </Btn>
        </div>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "32px 80px",
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
            {/* Coach 1 */}
            <div style={{ display: "flex", gap: 12 }}>
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
                    fontSize: 11,
                    color: pal.muted,
                    marginBottom: 4,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {t("Coach")}
                </div>
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
                  {t("I see you struggled with this on your checkpoint:")}
                  <MathPill pal={pal} block>
                    x² − 5x + 6 = 0
                  </MathPill>
                  {t("Before we solve it, can you tell me what")}{" "}
                  <em>{t("type")}</em> {t("of equation this is?")}
                </div>
              </div>
            </div>

            {/* User */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                {t("Quadratic?")}
              </div>
            </div>

            {/* Coach 2 */}
            <div style={{ display: "flex", gap: 12 }}>
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
                  {t("Right. The general form is")}
                  <MathPill pal={pal} block>
                    ax² + bx + c = 0
                  </MathPill>
                  {t("In your equation, what are")}{" "}
                  <MathPill pal={pal}>a</MathPill>,{" "}
                  <MathPill pal={pal}>b</MathPill> {t("and")}{" "}
                  <MathPill pal={pal}>c</MathPill>?
                </div>
              </div>
            </div>

            {/* User */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                a = 1, b = −5, c = 6
              </div>
            </div>

            {/* Typing */}
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
          </div>
        </div>

        {/* Input */}
        <div
          style={{
            padding: "14px 28px 22px",
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
                defaultValue=""
              />
              {(["sparkle", "image", "mic"] as const).map((name) => (
                <button
                  key={name}
                  type="button"
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
            />
          </div>
        </div>
      </main>

      {/* Right rail */}
      <div
        style={{
          width: 280,
          background: pal.surface,
          borderLeft: `1px solid ${pal.line}`,
          padding: 20,
          overflow: "auto",
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
