import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Btn, Card, Pill } from "@/components/ui/Primitives";
import { LangSwitcher } from "@/components/app/LangSwitcher";
import { createExamSession, type SubjectCode } from "@/lib/api";
import { startExam } from "@/lib/examState";
import { useIsAtMostTablet, useIsMobile } from "@/hooks/useMediaQuery";

const SUBJECTS: { code: SubjectCode; label: string }[] = [
  { code: "MATH", label: "Mathematics" },
  { code: "PHYS", label: "Physics" },
  { code: "CHEM", label: "Chemistry" },
  { code: "BIO", label: "Biology" },
  { code: "HIST", label: "History" },
  { code: "UZB_LIT", label: "Uzbek lit" },
];

export default function ExamLanding() {
  const t = useT();
  const navigate = useNavigate();
  const [subject, setSubject] = useState<SubjectCode>("MATH");
  const [starting, setStarting] = useState(false);
  const isMobile = useIsMobile();
  const isAtMostTablet = useIsAtMostTablet();

  const start = async () => {
    if (starting) return;
    setStarting(true);
    try {
      const session = await createExamSession(subject);
      startExam(session.durationMs);
      navigate("/app/exam/active", { state: { sessionId: session.id, subject, mode: "app" } });
    } catch {
      setStarting(false);
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
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: pal.muted, marginBottom: 2 }}>
            {t("Mock exams")}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.025em",
            }}
          >
            {t("Full Mock #8")}
          </h1>
        </div>
        <LangSwitcher />
      </div>

      <div
        style={{
          padding: isMobile ? "16px" : "24px 32px",
          display: "grid",
          gridTemplateColumns: isAtMostTablet ? "1fr" : "1.4fr 1fr",
          gap: 20,
        }}
      >
        {/* LEFT — hero + subject + rules */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                right: -40,
                top: -40,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: pal.accent,
                opacity: 0.35,
                filter: "blur(40px)",
              }}
            />
            <div style={{ position: "relative", padding: isMobile ? 22 : 32 }}>
              <Pill
                pal={pal}
                tone="accent"
                style={{ marginBottom: 12 }}
                icon={<Icon name="book" size={12} />}
              >
                {t("BMBA format")}
              </Pill>
              <div
                style={{
                  fontSize: isMobile ? 26 : 38,
                  fontWeight: 800,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.05,
                  maxWidth: 460,
                }}
              >
                {t("Realistic 150-minute simulation")}
              </div>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  opacity: 0.9,
                  lineHeight: 1.55,
                  maxWidth: 520,
                }}
              >
                {t(
                  "Same scoring engine as the real Milliy Sertifikat: Rasch-calibrated grading, section structure, proctor-style timer warnings, auto-save every 30 seconds.",
                )}
              </p>

              <div
                style={{
                  marginTop: 24,
                  display: "grid",
                  gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                  gap: 14,
                  maxWidth: 540,
                }}
              >
                {[
                  { label: t("Duration"), value: t("150 min"), icon: "clock" as const },
                  { label: t("Questions"), value: "45", icon: "book" as const },
                  { label: t("Section A"), value: t("35 closed"), icon: "check" as const },
                  { label: t("Section B"), value: t("10 open"), icon: "sparkle" as const },
                ].map((s) => (
                  <div key={s.label}>
                    <div
                      style={{
                        fontSize: 10,
                        opacity: 0.7,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Icon name={s.icon} size={11} color={pal.primaryInk} />
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: '"JetBrains Mono", monospace',
                        letterSpacing: "-0.02em",
                        marginTop: 2,
                      }}
                    >
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Subject picker */}
          <Card pal={pal} pad={22}>
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
              {t("Pick subject")}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SUBJECTS.map((s) => {
                const on = s.code === subject;
                return (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => setSubject(s.code)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 999,
                      border: `1px solid ${on ? pal.primary : pal.line}`,
                      background: on ? pal.primarySoft : pal.surface,
                      color: on ? pal.primary : pal.text,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    {t(s.label)}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Rules */}
          <Card pal={pal} pad={22}>
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
              {t("Before you start")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(
                [
                  {
                    icon: "clock",
                    title: t("Strict timer"),
                    body: t(
                      "150 minutes total with warnings at 30, 15, and 5 minutes remaining. Auto-submits at zero.",
                    ),
                  },
                  {
                    icon: "lock",
                    title: t("No going back"),
                    body: t(
                      "Once you submit Section A, you can't return to it. Section B opens immediately after.",
                    ),
                  },
                  {
                    icon: "sparkle",
                    title: t("Tools"),
                    body: t(
                      "Calculator, formula sheet, and scratch paper available from the right toolbar at any time.",
                    ),
                  },
                  {
                    icon: "shield",
                    title: t("Auto-save"),
                    body: t(
                      "Every answer and flag is saved as you go. Reload safely if your connection drops.",
                    ),
                  },
                ] as const
              ).map((r) => (
                <div
                  key={r.title}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 14px",
                    background: pal.surfaceAlt,
                    border: `1px solid ${pal.line}`,
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: pal.surface,
                      color: pal.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={r.icon as IconName} size={16} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {r.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: pal.muted,
                        marginTop: 2,
                        lineHeight: 1.5,
                      }}
                    >
                      {r.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT — start panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card pal={pal} pad={22}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: pal.muted,
                marginBottom: 8,
              }}
            >
              {t("Ready to begin?")}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
              }}
            >
              {t(SUBJECTS.find((s) => s.code === subject)?.label || "Mathematics")} {t("mock")}
            </div>
            <div
              style={{
                fontSize: 13,
                color: pal.muted,
                marginTop: 6,
                lineHeight: 1.55,
              }}
            >
              {t(
                "Once you press Start, the timer begins immediately and runs in the background even if you switch tabs.",
              )}
            </div>

            <div style={{ marginTop: 18 }}>
              <Btn
                pal={pal}
                tone="primary"
                size="lg"
                full
                iconAfter={<Icon name="arrow-right" size={16} />}
                onClick={start}
              >
                {starting ? t("Starting…") : t("Start exam")}
              </Btn>
              <div
                style={{
                  fontSize: 11,
                  color: pal.muted,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                {t("Find a quiet 2.5h window — exit closes the session.")}
              </div>
            </div>
          </Card>

          <Card pal={pal} pad={20}>
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
              {t("Grading scale")}
            </div>
            {(
              [
                { r: "70+", g: "A+", c: pal.primary },
                { r: "65–69.9", g: "A", c: pal.primary },
                { r: "60–64.9", g: "B+", c: pal.primary },
                { r: "55–59.9", g: "B", c: pal.text },
                { r: "50–54.9", g: "C+", c: pal.text },
                { r: "46–49.9", g: "C", c: pal.muted },
                { r: "< 46", g: "—", c: pal.bad },
              ] as const
            ).map((row, i) => (
              <div
                key={row.r}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 50px",
                  alignItems: "center",
                  padding: "8px 0",
                  borderTop: i ? `1px solid ${pal.line}` : "none",
                  fontSize: 12,
                }}
              >
                <span style={{ color: pal.muted, fontFamily: '"JetBrains Mono", monospace' }}>
                  {row.r}
                </span>
                <span
                  style={{
                    fontWeight: 800,
                    color: row.c,
                    fontFamily: '"JetBrains Mono", monospace',
                    textAlign: "right",
                  }}
                >
                  {row.g}
                </span>
              </div>
            ))}
            <div
              style={{
                fontSize: 11,
                color: pal.muted,
                marginTop: 10,
                lineHeight: 1.5,
              }}
            >
              {t("Minimum 46 points needed for any certificate.")}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
