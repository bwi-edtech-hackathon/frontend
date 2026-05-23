import { create } from "zustand";
import { api } from "@/lib/api";
import type {
  DiagnosticAnswer,
  DiagnosticResult,
  Question,
  Subject,
  Week,
} from "@/types";

type LoadState = "idle" | "loading" | "ready" | "error";

type AppState = {
  selectedSubject: Subject | null;

  questions: Question[];
  currentQuestionIndex: number;
  diagnosticStartedAt: number | null;
  answers: DiagnosticAnswer[];

  result: DiagnosticResult | null;
  roadmap: Week[] | null;
  completedLessons: Set<string>;

  loadState: LoadState;

  selectSubject: (subject: Subject) => Promise<void>;
  submitAnswer: (answer: string, correct: boolean) => void;
  resetDiagnostic: () => void;
  finalizeDiagnostic: () => Promise<void>;
  markLessonComplete: (lessonId: string) => void;
  hardReset: () => void;
};

const initial = {
  selectedSubject: null as Subject | null,
  questions: [] as Question[],
  currentQuestionIndex: 0,
  diagnosticStartedAt: null as number | null,
  answers: [] as DiagnosticAnswer[],
  result: null as DiagnosticResult | null,
  roadmap: null as Week[] | null,
  completedLessons: new Set<string>(),
  loadState: "idle" as LoadState,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initial,

  async selectSubject(subject) {
    set({
      selectedSubject: subject,
      loadState: "loading",
      currentQuestionIndex: 0,
      answers: [],
      result: null,
      roadmap: null,
    });
    try {
      const questions = await api.getDiagnosticQuestions(subject);
      set({
        questions,
        diagnosticStartedAt: Date.now(),
        loadState: "ready",
      });
    } catch {
      set({ loadState: "error" });
    }
  },

  submitAnswer(answer, correct) {
    const { questions, currentQuestionIndex, answers, diagnosticStartedAt } =
      get();
    const q = questions[currentQuestionIndex];
    if (!q) return;
    const now = Date.now();
    const prev = answers.at(-1);
    const timeSpentMs = prev
      ? now - (diagnosticStartedAt ?? now)
      : (diagnosticStartedAt ? now - diagnosticStartedAt : 0);
    const record: DiagnosticAnswer = {
      questionId: q.id,
      answer,
      correct,
      difficulty: q.difficulty,
      topic: q.topic,
      timeSpentMs,
    };
    set({
      answers: [...answers, record],
      currentQuestionIndex: currentQuestionIndex + 1,
    });
  },

  resetDiagnostic() {
    set({
      questions: [],
      currentQuestionIndex: 0,
      diagnosticStartedAt: null,
      answers: [],
      result: null,
      roadmap: null,
      loadState: "idle",
    });
  },

  async finalizeDiagnostic() {
    const { selectedSubject, answers } = get();
    if (!selectedSubject) return;
    set({ loadState: "loading" });
    try {
      const { result, roadmap } = await api.finalizeDiagnostic(
        selectedSubject,
        answers,
      );
      set({ result, roadmap, loadState: "ready" });
    } catch {
      set({ loadState: "error" });
    }
  },

  markLessonComplete(lessonId) {
    const next = new Set(get().completedLessons);
    next.add(lessonId);
    set({ completedLessons: next });
  },

  hardReset() {
    set({ ...initial, completedLessons: new Set<string>() });
  },
}));
