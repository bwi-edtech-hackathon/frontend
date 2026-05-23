import { Link } from "react-router-dom";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";
import {
  Avatar,
  Btn,
  Card,
  Logo,
  Pill,
  Ring,
} from "@/components/ui/Primitives";
import { LangSwitcher } from "@/components/app/LangSwitcher";

export default function Landing() {
  const t = useT();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: pal.bg,
        color: pal.text,
        fontFamily: '"Inter", -apple-system, system-ui, sans-serif',
        letterSpacing: "-0.01em",
      }}
    >
      {/* Top nav */}
      <nav
        style={{
          padding: "18px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${pal.line}`,
        }}
      >
        <Logo pal={pal} size={20} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            fontSize: 13,
            color: pal.muted,
            fontWeight: 500,
          }}
        >
          <span>{t("How it works")}</span>
          <span>{t("Mock exams")}</span>
          <span>{t("Pricing")}</span>
          <span style={{ color: pal.text }}>{t("Sign in")}</span>
          <LangSwitcher />
          <Link to="/app" style={{ textDecoration: "none" }}>
            <Btn pal={pal} tone="primary" size="sm">
              {t("Start free")}
            </Btn>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: "60px 48px 40px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div>
          <Pill pal={pal} tone="primarySoft" style={{ marginBottom: 18 }}>
            <Icon name="sparkle" size={12} /> {t("Milliy Sertifikat 2026")}
          </Pill>
          <h1
            style={{
              margin: 0,
              fontSize: 64,
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              fontWeight: 800,
              maxWidth: 560,
            }}
          >
            {t("BMBA prep, rebuilt with AI.")}
          </h1>
          <p
            style={{
              marginTop: 22,
              fontSize: 17,
              lineHeight: 1.5,
              color: pal.muted,
              maxWidth: 480,
            }}
          >
            {t(
              "A diagnostic that finds your weak topics in 30 minutes. A roadmap that rewrites itself after every mock. A Socratic coach when you're stuck. And ranked battles when you're bored.",
            )}
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
            <Link to="/app" style={{ textDecoration: "none" }}>
              <Btn
                pal={pal}
                tone="primary"
                size="lg"
                iconAfter={<Icon name="arrow-right" size={16} />}
              >
                {t("Start free")}
              </Btn>
            </Link>
            <Btn
              pal={pal}
              tone="outline"
              size="lg"
              icon={<Icon name="play" size={14} />}
            >
              {t("See how it works")}
            </Btn>
          </div>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ display: "flex" }}>
              {[20, 200, 100, 320].map((h, i) => (
                <div
                  key={i}
                  style={{
                    marginLeft: i ? -10 : 0,
                    borderRadius: "50%",
                    boxShadow: `0 0 0 2px ${pal.bg}`,
                  }}
                >
                  <Avatar name={["A", "B", "J", "M"][i]} size={28} hue={h} />
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: pal.muted, lineHeight: 1.4 }}>
              <strong style={{ color: pal.text }}>5,200+</strong>{" "}
              {t("studying right now")}
              <br />
              {t("across 14 viloyats")}
            </div>
          </div>
        </div>

        {/* Hero visual */}
        <div style={{ position: "relative", height: 480 }}>
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 0,
              width: 380,
              height: 280,
              background: pal.primary,
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 30px 70px rgba(0,0,0,0.16)",
              transform: "rotate(2deg)",
              color: pal.primaryInk,
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                opacity: 0.8,
              }}
            >
              {t("Today's lesson")}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                marginTop: 6,
                letterSpacing: "-0.02em",
              }}
            >
              {t("Quadratic equations")}
            </div>
            <div
              style={{
                marginTop: 16,
                height: 6,
                background: "rgba(255,255,255,0.2)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{ width: "62%", height: "100%", background: pal.accent }}
              />
            </div>
            <div style={{ marginTop: 30 }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{t("Estimated grade")}</div>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  fontFamily: '"JetBrains Mono", monospace',
                  lineHeight: 1,
                }}
              >
                B+
              </div>
            </div>
          </div>

          {/* phone */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 30,
              width: 240,
              height: 460,
              borderRadius: 32,
              background: pal.surface,
              boxShadow: "0 40px 80px rgba(0,0,0,0.18), 0 0 0 8px #111",
              overflow: "hidden",
              transform: "rotate(-4deg)",
            }}
          >
            <div style={{ padding: "28px 18px 0" }}>
              <div style={{ fontSize: 9, color: pal.muted, marginBottom: 2 }}>
                {t("Salom, Diana")}
              </div>
              <Logo pal={pal} size={13} />
            </div>
            <div style={{ padding: 14 }}>
              <div
                style={{
                  background: pal.accent,
                  color: pal.accentInk,
                  padding: 14,
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    opacity: 0.8,
                  }}
                >
                  {t("Quick Match")}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginTop: 4,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {t("Math · 5 min")}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    padding: "6px 10px",
                    background: "rgba(0,0,0,0.12)",
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    display: "inline-block",
                  }}
                >
                  {t("+18 ELO")}
                </div>
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {["Vieta's formulas", "Logarithms", "Trigonometry"].map(
                  (s, i) => (
                    <div
                      key={s}
                      style={{
                        background: pal.surfaceAlt,
                        border: `1px solid ${pal.line}`,
                        padding: "8px 12px",
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          border: `2px solid ${i === 0 ? pal.primary : pal.line}`,
                          background: i === 0 ? pal.primary : "transparent",
                        }}
                      />
                      {s}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section
        style={{
          background: pal.text,
          color: pal.surface,
          padding: "36px 48px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 32,
        }}
      >
        {[
          { v: "143,400", l: t("applicants used Milliy Sertifikat 2025/26") },
          { v: "+180%", l: t("YoY growth in certificate usage") },
          { v: "311%", l: t("growth in general-subject certificates") },
          {
            v: "50%",
            l: t("salary bonus for teachers with C1+ certificate"),
          },
        ].map((s, i) => (
          <div key={i}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                fontFamily: '"JetBrains Mono", monospace',
                color: pal.accent,
              }}
            >
              {s.v}
            </div>
            <div
              style={{
                fontSize: 12,
                opacity: 0.7,
                marginTop: 6,
                lineHeight: 1.4,
                maxWidth: 220,
              }}
            >
              {s.l}
            </div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ padding: "80px 48px" }}>
        <div style={{ marginBottom: 40 }}>
          <Pill pal={pal} tone="outline" style={{ marginBottom: 12 }}>
            {t("What's inside")}
          </Pill>
          <h2
            style={{
              margin: 0,
              fontSize: 44,
              letterSpacing: "-0.035em",
              fontWeight: 800,
              maxWidth: 600,
            }}
          >
            {t("The first prep platform that")}{" "}
            <span
              style={{
                color: pal.primary,
                fontStyle: "italic",
                fontFamily: '"Newsreader", serif',
                fontWeight: 500,
              }}
            >
              {t("knows you")}
            </span>
            .
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {(
            [
              {
                icon: "sparkle",
                tone: "primary",
                title: t("Diagnostic exam"),
                desc: t(
                  "Adaptive 30-min test that estimates your Rasch score and identifies your 5 weakest topics.",
                ),
                decor: (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <Ring
                      value={56.4}
                      max={70}
                      size={64}
                      stroke={6}
                      label="B"
                      color={pal.primary}
                      pal={pal}
                    />
                    <div>
                      <div style={{ fontSize: 11, color: pal.muted }}>
                        {t("Estimated")}
                      </div>
                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 800,
                          letterSpacing: "-0.02em",
                          fontFamily: '"JetBrains Mono", monospace',
                        }}
                      >
                        56.4
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                icon: "map",
                tone: "accent",
                title: t("AI Roadmap"),
                desc: t(
                  "Sequenced topics + checkpoints, regenerated as you master each one. Calibrated to your exam date.",
                ),
                decor: (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    {[
                      { l: t("Linear equations"), done: true, active: false },
                      {
                        l: t("Quadratic equations"),
                        active: true,
                        done: false,
                      },
                      { l: t("Logarithms"), done: false, active: false },
                    ].map((r, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 11,
                          color: r.active ? pal.text : pal.muted,
                          fontWeight: r.active ? 700 : 400,
                        }}
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: r.done
                              ? pal.primary
                              : r.active
                                ? pal.accent
                                : "transparent",
                            border:
                              r.done || r.active
                                ? "none"
                                : `1.5px solid ${pal.line}`,
                          }}
                        />
                        {r.l}
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                icon: "chat",
                tone: "primary",
                title: t("Socratic AI Coach"),
                desc: t(
                  "When you fail a checkpoint, the Coach asks questions — never lectures. Math via KaTeX, diagrams via Mermaid.",
                ),
                decor: (
                  <div
                    style={{
                      background: pal.surfaceAlt,
                      border: `1px solid ${pal.line}`,
                      padding: 10,
                      borderRadius: 12,
                      fontSize: 12,
                      lineHeight: 1.4,
                    }}
                  >
                    {t("In your equation, what are")}{" "}
                    {["a", "b", "c"].map((v, i) => (
                      <span key={v}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 6px",
                            background: pal.surface,
                            border: `1px solid ${pal.line}`,
                            borderRadius: 4,
                            fontFamily: '"Newsreader", serif',
                            fontStyle: "italic",
                          }}
                        >
                          {v}
                        </span>
                        {i < 2 ? ", " : "?"}
                      </span>
                    ))}
                  </div>
                ),
              },
              {
                icon: "swords",
                tone: "accent",
                title: t("Ranked battles"),
                desc: t(
                  "5-minute head-to-head duels with subject-specific ELO. Leaderboards by school and region.",
                ),
                decor: (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <Avatar name="D" size={36} hue={20} />
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: pal.primary,
                          fontFamily: '"JetBrains Mono", monospace',
                          marginTop: 2,
                        }}
                      >
                        1240
                      </div>
                    </div>
                    <Icon name="swords" size={20} color={pal.muted} />
                    <div style={{ textAlign: "center" }}>
                      <Avatar name="S" size={36} hue={200} />
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: pal.muted,
                          fontFamily: '"JetBrains Mono", monospace',
                          marginTop: 2,
                        }}
                      >
                        980
                      </div>
                    </div>
                  </div>
                ),
              },
            ] as const
          ).map((f, i) => (
            <Card
              key={i}
              pal={pal}
              pad={28}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background:
                      f.tone === "primary" ? pal.primarySoft : pal.accentSoft,
                    color: f.tone === "primary" ? pal.primary : pal.accentInk,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name={f.icon} size={22} />
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {f.title}
                </h3>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: pal.muted,
                  lineHeight: 1.55,
                  maxWidth: 460,
                }}
              >
                {f.desc}
              </p>
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: 12,
                  borderTop: `1px dashed ${pal.line}`,
                }}
              >
                {f.decor}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "40px 48px 80px" }}>
        <h2
          style={{
            margin: "0 0 28px",
            fontSize: 32,
            letterSpacing: "-0.03em",
            fontWeight: 700,
          }}
        >
          {t("How it works")}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 24,
              left: "16%",
              right: "16%",
              height: 2,
              background: pal.line,
              borderTop: `2px dashed ${pal.line}`,
              borderRadius: 1,
              zIndex: 0,
            }}
          />
          {[
            {
              n: "01",
              t: t("Take the diagnostic"),
              d: t("30 minutes. Adaptive. Covers 80% of the topic tree."),
            },
            {
              n: "02",
              t: t("Get your roadmap"),
              d: t("A personalized sequence of topics, mocks and checkpoints."),
            },
            {
              n: "03",
              t: t("Study, battle, repeat"),
              d: t(
                "Lessons, mocks, and 5-minute battles until you hit your target grade.",
              ),
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{ padding: "0 18px", position: "relative", zIndex: 1 }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: pal.surface,
                  border: `2px solid ${pal.primary}`,
                  color: pal.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 14,
                  fontFamily: '"JetBrains Mono", monospace',
                  marginBottom: 16,
                }}
              >
                {s.n}
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.t}
              </h3>
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: 13,
                  color: pal.muted,
                  lineHeight: 1.5,
                  maxWidth: 280,
                }}
              >
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section style={{ padding: "0 48px 60px" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: pal.muted,
            marginBottom: 16,
          }}
        >
          {t("All BMBA subjects")}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            t("Mathematics"),
            t("Physics"),
            t("Chemistry"),
            t("Biology"),
            t("History"),
            t("Geography"),
            t("Uzbek lit"),
            t("Russian lit"),
            t("Karakalpak"),
          ].map((s) => (
            <Pill
              key={s}
              pal={pal}
              tone="outline"
              style={{ fontSize: 14, padding: "8px 16px" }}
            >
              {s}
            </Pill>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: "40px 48px 80px" }}>
        <h2
          style={{
            margin: "0 0 28px",
            fontSize: 32,
            letterSpacing: "-0.03em",
            fontWeight: 700,
          }}
        >
          {t("Pricing")}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
          }}
        >
          {[
            {
              name: t("Free"),
              price: "0",
              desc: t("Diagnostic + 3 checkpoints/week + 5 battles/day"),
              cta: t("Get started"),
              highlight: false,
            },
            {
              name: t("Standard"),
              price: "49,000",
              desc: t("1 subject unlimited + full roadmap + 30 battles/day"),
              cta: t("Get started"),
              highlight: false,
            },
            {
              name: t("Premium"),
              price: "99,000",
              desc: t(
                "All subjects + unlimited chat lesson + unlimited battles",
              ),
              cta: t("Choose Premium"),
              highlight: true,
            },
          ].map((p, i) => (
            <Card
              key={i}
              pal={pal}
              pad={28}
              style={{
                background: p.highlight ? pal.primary : pal.surface,
                color: p.highlight ? pal.primaryInk : pal.text,
                border: p.highlight ? "none" : `1px solid ${pal.line}`,
                position: "relative",
              }}
            >
              {p.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    padding: "3px 10px",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    background: pal.accent,
                    color: pal.accentInk,
                    borderRadius: 999,
                  }}
                >
                  {t("Recommended")}
                </div>
              )}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  opacity: p.highlight ? 0.85 : 1,
                  color: p.highlight ? pal.primaryInk : pal.text,
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {p.price}
                </span>
                <span style={{ fontSize: 13, opacity: 0.7 }}>
                  UZS {t("/month")}
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  marginTop: 16,
                  opacity: 0.85,
                }}
              >
                {p.desc}
              </div>
              <div style={{ marginTop: 24 }}>
                <Btn
                  pal={pal}
                  tone={p.highlight ? "accent" : "outline"}
                  size="md"
                  full
                  iconAfter={<Icon name="arrow-right" size={14} />}
                >
                  {p.cta}
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <footer
        style={{
          borderTop: `1px solid ${pal.line}`,
          padding: "36px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: pal.muted,
          fontSize: 12,
        }}
      >
        <Logo pal={pal} size={16} />
        <div>{t("© 2026 CoachAI · BMBA prep platform · Tashkent, UZ")}</div>
      </footer>
    </div>
  );
}
