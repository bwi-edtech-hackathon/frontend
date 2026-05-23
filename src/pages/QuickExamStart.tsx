import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { palette as pal } from "@/lib/palette";
import { useT } from "@/lib/i18n";
import { Logo } from "@/components/ui/Primitives";
import { createExamSession } from "@/lib/api";
import { startExam } from "@/lib/examState";
import { subjectFromSlug, labelForSubject } from "@/lib/examMode";

export default function QuickExamStart() {
  const t = useT();
  const navigate = useNavigate();
  const { subject: slug } = useParams<{ subject: string }>();
  const booted = useRef(false);

  const subject = subjectFromSlug(slug);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    let live = true;
    (async () => {
      try {
        const session = await createExamSession(subject);
        startExam(session.durationMs);
        if (!live) return;
        navigate("/quick-exam/active", {
          replace: true,
          state: { sessionId: session.id, subject, mode: "quick" },
        });
      } catch {
        if (!live) return;
        navigate("/", { replace: true });
      }
    })();

    return () => {
      live = false;
    };
  }, [navigate, subject]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: pal.bg,
        color: pal.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: '"Inter", -apple-system, system-ui, sans-serif',
        letterSpacing: "-0.01em",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: 22 }}>
        <Logo pal={pal} size={20} />
      </div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: "-0.025em",
          marginBottom: 8,
        }}
      >
        {t("Preparing your quick mock…")}
      </div>
      <div
        style={{
          fontSize: 14,
          color: pal.muted,
          maxWidth: 420,
          lineHeight: 1.5,
        }}
      >
        {t(labelForSubject(subject))} · {t("No registration needed")}
      </div>
      <div
        style={{
          marginTop: 28,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: `3px solid ${pal.line}`,
          borderTopColor: pal.primary,
          animation: "coachai-spin 0.9s linear infinite",
        }}
      />
      <style>{`@keyframes coachai-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
