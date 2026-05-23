import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAppStore } from "@/store/useAppStore";
import type { Subject } from "@/types";

export default function Diagnostic() {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const selectSubject = useAppStore((s) => s.selectSubject);
  const questions = useAppStore((s) => s.questions);
  const loadState = useAppStore((s) => s.loadState);

  useEffect(() => {
    if (subject !== "english" && subject !== "math") {
      toast.error("That subject isn't available yet.");
      navigate("/app");
      return;
    }
    void selectSubject(subject as Subject);
  }, [subject, selectSubject, navigate]);

  return (
    <div className="animate-fade-in">
      <div className="max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Diagnostic
        </span>
        <h1 className="font-display mt-2 text-4xl font-bold tracking-tight">
          Loading your diagnostic…
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          {loadState === "loading"
            ? "Preparing questions adapted to you."
            : loadState === "ready"
              ? `${questions.length} questions ready. (Question UI coming next pass.)`
              : "—"}
        </p>
      </div>
    </div>
  );
}
