// Backend API client. Each function below is the contract between frontend and backend.
// Today they return sample data so the UI is interactive end-to-end.
// When the backend is ready, swap the SAMPLE block for the real fetch call —
// the request/response shapes shouldn't change.

import axios, { type AxiosInstance } from "axios";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

export const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ─────────────────────────── Types ───────────────────────────

export type SubjectCode =
  | "MATH"
  | "PHYS"
  | "CHEM"
  | "BIO"
  | "HIST"
  | "GEOG"
  | "UZB_LIT"
  | "RUS_LIT"
  | "KAR_LIT";

export type ExamQuestion = {
  id: string;
  index: number; // 0-based
  section: "A" | "B";
  type: "closed" | "open_a" | "open_b";
  domain: string;
  topic: string;
  prompt: string; // may contain math notation
  options?: { letter: "A" | "B" | "C" | "D"; text: string }[];
  weight: number; // ball
};

export type ExamSession = {
  id: string;
  subject: SubjectCode;
  startedAt: number;
  durationMs: number;
  questions: ExamQuestion[];
};

export type ExamSummary = {
  sessionId: string;
  raschScore: number; // e.g. 56.4
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "—";
  totalCorrect: number;
  totalQuestions: number;
  sectionA: { correct: number; total: number; ball: number };
  sectionB: { correct: number; total: number; ball: number };
  weakTopics: { topic: string; domain: string; mastery: number; impact: number }[];
  strongTopics: { topic: string; domain: string; mastery: number }[];
  breakdown: {
    qIndex: number;
    topic: string;
    yourAnswer: string | null;
    correctAnswer: string;
    correct: boolean;
    timeSpentMs: number;
  }[];
  certificateReady: boolean;
};

export type FormulaItem = { name: string; eq: string };
export type FormulaGroup = { title: string; items: FormulaItem[] };

// ─────────────────────────── Endpoints ───────────────────────────

/** POST /api/exam/sessions — create a new mock exam session. */
export async function createExamSession(subject: SubjectCode): Promise<ExamSession> {
  // TODO(backend): return http.post<ExamSession>("/api/exam/sessions", { subject }).then(r => r.data);
  return sampleExamSession(subject);
}

/** GET /api/exam/sessions/:id — resume an in-progress session. */
export async function getExamSession(id: string): Promise<ExamSession> {
  // TODO(backend): return http.get<ExamSession>(`/api/exam/sessions/${id}`).then(r => r.data);
  return sampleExamSession("MATH", id);
}

/** PATCH /api/exam/sessions/:id/answer — autosave a single answer. */
export async function saveAnswer(
  sessionId: string,
  qIndex: number,
  answer: string | null,
  flagged: boolean,
): Promise<void> {
  // TODO(backend):
  // await http.patch(`/api/exam/sessions/${sessionId}/answer`, { qIndex, answer, flagged });
  void sessionId;
  void qIndex;
  void answer;
  void flagged;
}

/** POST /api/exam/sessions/:id/submit — finalize and trigger grading. Returns the analysis job. */
export async function submitExam(sessionId: string): Promise<{ jobId: string }> {
  // TODO(backend): return http.post(`/api/exam/sessions/${sessionId}/submit`).then(r => r.data);
  return { jobId: `analysis-${sessionId}` };
}

/** GET /api/exam/sessions/:id/result — fetch graded results (poll until ready). */
export async function getExamResult(sessionId: string): Promise<ExamSummary> {
  // TODO(backend): return http.get<ExamSummary>(`/api/exam/sessions/${sessionId}/result`).then(r => r.data);
  return sampleResult(sessionId);
}

/** GET /api/formulas?subject=MATH — formula sheet for the exam tool. */
export async function getFormulaSheet(
  subject: SubjectCode = "MATH",
): Promise<FormulaGroup[]> {
  // TODO(backend): return http.get<FormulaGroup[]>("/api/formulas", { params: { subject } }).then(r => r.data);
  void subject;
  return SAMPLE_FORMULAS;
}

/** POST /api/coach/sessions — start an AI-analysis session for the exam. */
export async function requestAIAnalysis(sessionId: string): Promise<{ chatId: string }> {
  // TODO(backend): return http.post("/api/coach/sessions", { context: "exam-review", sessionId }).then(r => r.data);
  return { chatId: `chat-${sessionId}` };
}

/** POST /api/roadmap/regenerate — request a roadmap rebuilt from the latest exam. */
export async function regenerateRoadmap(sessionId: string): Promise<{ roadmapId: string }> {
  // TODO(backend): return http.post("/api/roadmap/regenerate", { sessionId }).then(r => r.data);
  return { roadmapId: `roadmap-${sessionId}` };
}

// ─────────────────────────── Sample fixtures ───────────────────────────

const SAMPLE_FORMULAS: FormulaGroup[] = [
  {
    title: "Algebra",
    items: [
      { name: "Quadratic formula", eq: "x = (−b ± √(b² − 4ac)) / 2a" },
      { name: "Discriminant", eq: "D = b² − 4ac" },
      { name: "Vieta's theorem", eq: "x₁ + x₂ = −b/a, x₁·x₂ = c/a" },
      { name: "Difference of squares", eq: "a² − b² = (a − b)(a + b)" },
      { name: "Sum of cubes", eq: "a³ + b³ = (a + b)(a² − ab + b²)" },
      { name: "Binomial square", eq: "(a ± b)² = a² ± 2ab + b²" },
    ],
  },
  {
    title: "Logarithms",
    items: [
      { name: "Product", eq: "logₐ(xy) = logₐ x + logₐ y" },
      { name: "Quotient", eq: "logₐ(x/y) = logₐ x − logₐ y" },
      { name: "Power", eq: "logₐ(xⁿ) = n·logₐ x" },
      { name: "Change of base", eq: "logₐ x = ln x / ln a" },
    ],
  },
  {
    title: "Trigonometry",
    items: [
      { name: "Pythagorean identity", eq: "sin²θ + cos²θ = 1" },
      { name: "Double angle (sin)", eq: "sin 2θ = 2 sinθ cosθ" },
      { name: "Double angle (cos)", eq: "cos 2θ = cos²θ − sin²θ" },
      { name: "Tangent", eq: "tan θ = sin θ / cos θ" },
      { name: "Law of cosines", eq: "c² = a² + b² − 2ab·cosγ" },
    ],
  },
  {
    title: "Geometry",
    items: [
      { name: "Circle area", eq: "A = πr²" },
      { name: "Circle circumference", eq: "C = 2πr" },
      { name: "Triangle area", eq: "A = ½·b·h" },
      { name: "Sphere volume", eq: "V = (4/3)πr³" },
      { name: "Cylinder volume", eq: "V = πr²h" },
    ],
  },
  {
    title: "Sequences & series",
    items: [
      { name: "Arithmetic n-th term", eq: "aₙ = a₁ + (n − 1)d" },
      { name: "Arithmetic sum", eq: "Sₙ = n/2 · (a₁ + aₙ)" },
      { name: "Geometric n-th term", eq: "aₙ = a₁ · qⁿ⁻¹" },
      { name: "Geometric sum", eq: "Sₙ = a₁ · (qⁿ − 1) / (q − 1)" },
    ],
  },
];

function sampleExamSession(subject: SubjectCode, id = `mock-${Date.now()}`): ExamSession {
  const SECTION_A = 35;
  const SECTION_B = 10;
  const topics = [
    "Quadratic equations",
    "Linear equations",
    "Inequalities",
    "Logarithms",
    "Functions",
    "Trigonometry",
    "Sequences & series",
    "Probability",
  ];
  const stems = [
    "Find the value of k such that the system has exactly two real solutions:",
    "Evaluate the expression for the smallest positive integer x satisfying:",
    "Determine the domain of the function f(x) =",
    "Find the sum of the first 10 terms of the sequence",
    "If logₐ b = 3, what is the value of a^(2 log_a b) ?",
  ];
  const optionSets: { letter: "A" | "B" | "C" | "D"; text: string }[][] = [
    [
      { letter: "A", text: "k < −4/3 or k > 4/3" },
      { letter: "B", text: "−4/3 < k < 4/3" },
      { letter: "C", text: "|k| < 5/3" },
      { letter: "D", text: "k = ±4/3 only" },
    ],
    [
      { letter: "A", text: "x = 1" },
      { letter: "B", text: "x = 2" },
      { letter: "C", text: "x = 3" },
      { letter: "D", text: "no solution" },
    ],
  ];

  const questions: ExamQuestion[] = [];
  for (let i = 0; i < SECTION_A; i++) {
    questions.push({
      id: `q-${i}`,
      index: i,
      section: "A",
      type: "closed",
      domain: i < 15 ? "Algebra" : i < 25 ? "Geometry" : "Functions",
      topic: topics[i % topics.length],
      prompt: stems[i % stems.length],
      options: optionSets[i % optionSets.length],
      weight: 2.2,
    });
  }
  for (let i = 0; i < SECTION_B; i++) {
    questions.push({
      id: `q-${SECTION_A + i}`,
      index: SECTION_A + i,
      section: "B",
      type: "open_a",
      domain: "Algebra",
      topic: topics[i % topics.length],
      prompt: "Find the smallest positive integer x for which the inequality holds:",
      weight: 3.2,
    });
  }
  return {
    id,
    subject,
    startedAt: Date.now(),
    durationMs: 150 * 60 * 1000,
    questions,
  };
}

function sampleResult(sessionId: string): ExamSummary {
  return {
    sessionId,
    raschScore: 58.6,
    grade: "B",
    totalCorrect: 31,
    totalQuestions: 45,
    sectionA: { correct: 28, total: 35, ball: 61.6 },
    sectionB: { correct: 3, total: 10, ball: 9.6 },
    weakTopics: [
      { topic: "Logarithms", domain: "Algebra", mastery: 28, impact: 4.4 },
      { topic: "Trigonometry", domain: "Geometry", mastery: 35, impact: 3.9 },
      { topic: "Probability", domain: "Functions", mastery: 22, impact: 3.5 },
      { topic: "Sequences & series", domain: "Algebra", mastery: 48, impact: 2.8 },
      { topic: "Inequalities", domain: "Algebra", mastery: 55, impact: 1.6 },
    ],
    strongTopics: [
      { topic: "Linear equations", domain: "Algebra", mastery: 92 },
      { topic: "Quadratic equations", domain: "Algebra", mastery: 84 },
      { topic: "Functions", domain: "Functions", mastery: 78 },
    ],
    breakdown: Array.from({ length: 15 }).map((_, i) => ({
      qIndex: i,
      topic: ["Quadratic equations", "Logarithms", "Trigonometry", "Linear equations"][i % 4],
      yourAnswer: i % 4 === 0 ? "B" : "C",
      correctAnswer: i % 4 === 1 ? "A" : "C",
      correct: i % 4 !== 1,
      timeSpentMs: 30_000 + ((i * 17) % 90) * 1000,
    })),
    certificateReady: true,
  };
}
