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

export type BattleTier = "Bronze" | "Silver" | "Gold" | "Plat";

export type Match = {
  id: string;
  subject: SubjectCode;
  mode: "ranked" | "friend" | "ai";
  opponentId: string;
  opponentName: string;
  startsAt: number;
};

export type BattleHistoryItem = {
  id: string;
  opponentName: string;
  subject: SubjectCode;
  score: string;
  won: boolean;
  delta: number;
  ago: string;
  result: string;
};

export type LiveBattle = {
  id: string;
  a: { name: string; elo: number };
  b: { name: string; elo: number };
  question: number;
  total: number;
};

export type FriendOnline = {
  id: string;
  name: string;
  elo: number;
  status: string;
};

export type LeaderboardScope = "global" | "weekly" | "friends" | "region" | "school";

export type LeaderboardRow = {
  rank: number;
  name: string;
  school: string;
  elo: number;
  w: number;
  l: number;
  streak: number;
  isYou?: boolean;
};

export type ChatSessionSummary = {
  id: string;
  topic: string;
  preview: string;
  when: string;
  status: "active" | "mastered" | "struggling" | "in_progress";
};

export type ChatMessage = {
  id: string;
  role: "coach" | "user";
  text: string;
  createdAt: number;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  when: string;
  read: boolean;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  plan: "free" | "standard" | "premium";
};

export type BattleLetter = "A" | "B" | "C" | "D";

export type BattleOpponent = {
  id: string;
  name: string;
  elo: number;
  avatarHue: number;
};

export type BattleQuestion = {
  id: string;
  index: number;
  topic: string;
  prompt: string;
  expression?: string;
  options: { letter: BattleLetter; text: string }[];
  correctLetter: BattleLetter;
  weight: number;
};

export type BattleSession = {
  id: string;
  subject: SubjectCode;
  mode: "ranked" | "friend" | "ai";
  perQuestionMs: number;
  totalQuestions: number;
  opponent: BattleOpponent;
  questions: BattleQuestion[];
};

export type BattleAnswer = {
  qIndex: number;
  topic: string;
  yourLetter: BattleLetter | null;
  yourCorrect: boolean;
  yourTimeMs: number;
  opponentLetter: BattleLetter | null;
  opponentCorrect: boolean;
  opponentTimeMs: number;
};

export type BattleSummary = {
  sessionId: string;
  subject: SubjectCode;
  opponent: BattleOpponent;
  outcome: "won" | "lost" | "draw";
  yourScore: number;
  opponentScore: number;
  yourCorrect: number;
  opponentCorrect: number;
  totalQuestions: number;
  eloDelta: number;
  streak: number;
  breakdown: BattleAnswer[];
};

// ─────────────────────────── Exam endpoints ───────────────────────────

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

// ─────────────────────────── Auth ───────────────────────────

/** POST /api/auth/sign-up — register a new account. */
export async function signUp(payload: { name: string; emailOrPhone: string; password: string }): Promise<AuthUser> {
  // TODO(backend): return http.post<AuthUser>("/api/auth/sign-up", payload).then(r => r.data);
  return { id: "user-1", name: payload.name || "Diana", email: payload.emailOrPhone, plan: "free" };
}

/** POST /api/auth/sign-in — log in. */
export async function signIn(payload: { emailOrPhone: string; password: string }): Promise<AuthUser> {
  // TODO(backend): return http.post<AuthUser>("/api/auth/sign-in", payload).then(r => r.data);
  return { id: "user-1", name: "Diana M.", email: payload.emailOrPhone, plan: "free" };
}

/** POST /api/auth/sign-out — log out and clear session. */
export async function signOut(): Promise<void> {
  // TODO(backend): await http.post("/api/auth/sign-out");
}

/** POST /api/billing/checkout — start a checkout flow for the chosen plan. */
export async function startCheckout(plan: "free" | "standard" | "premium"): Promise<{ url: string }> {
  // TODO(backend): return http.post("/api/billing/checkout", { plan }).then(r => r.data);
  return { url: `/checkout/${plan}` };
}

// ─────────────────────────── Battle ───────────────────────────

/** POST /api/battles/match — find a ranked opponent. */
export async function findRankedMatch(subject: SubjectCode): Promise<Match> {
  // TODO(backend): return http.post<Match>("/api/battles/match", { subject }).then(r => r.data);
  return {
    id: `battle-${Date.now()}`,
    subject,
    mode: "ranked",
    opponentId: "u-202",
    opponentName: "Sardor Akhmedov",
    startsAt: Date.now() + 5_000,
  };
}

/** POST /api/battles/ai — start a match against an AI bot at the given tier. */
export async function startAIBattle(subject: SubjectCode, tier: BattleTier): Promise<Match> {
  // TODO(backend): return http.post<Match>("/api/battles/ai", { subject, tier }).then(r => r.data);
  return {
    id: `battle-ai-${Date.now()}`,
    subject,
    mode: "ai",
    opponentId: `ai-${tier.toLowerCase()}`,
    opponentName: `AI · ${tier} bot`,
    startsAt: Date.now() + 1_000,
  };
}

/** POST /api/battles/friend — create an invite link for a friend battle. */
export async function createFriendBattleInvite(subject: SubjectCode): Promise<{ inviteId: string; url: string }> {
  // TODO(backend): return http.post("/api/battles/friend", { subject }).then(r => r.data);
  void subject;
  const inviteId = `invite-${Math.random().toString(36).slice(2, 8)}`;
  return { inviteId, url: `${location.origin}/battle/invite/${inviteId}` };
}

/** POST /api/battles/friend/:friendId/challenge — challenge a specific friend. */
export async function challengeFriend(friendId: string, subject: SubjectCode): Promise<Match> {
  // TODO(backend): return http.post<Match>(`/api/battles/friend/${friendId}/challenge`, { subject }).then(r => r.data);
  return {
    id: `battle-fr-${Date.now()}`,
    subject,
    mode: "friend",
    opponentId: friendId,
    opponentName: friendId,
    startsAt: Date.now() + 1_000,
  };
}

/** POST /api/battles/sessions — start a live battle session (10 questions). */
export async function startBattleSession(args: {
  subject: SubjectCode;
  mode: "ranked" | "friend" | "ai";
  opponentId?: string;
  opponentName?: string;
}): Promise<BattleSession> {
  // TODO(backend): return http.post<BattleSession>("/api/battles/sessions", args).then(r => r.data);
  return sampleBattleSession(args);
}

/** GET /api/battles/sessions/:id — resume an in-flight battle. */
export async function getBattleSession(id: string): Promise<BattleSession> {
  // TODO(backend): return http.get<BattleSession>(`/api/battles/sessions/${id}`).then(r => r.data);
  return sampleBattleSession({ subject: "MATH", mode: "ranked" }, id);
}

/** POST /api/battles/sessions/:id/answer — submit one answer + record time. */
export async function submitBattleAnswer(
  sessionId: string,
  qIndex: number,
  letter: BattleLetter | null,
  timeMs: number,
): Promise<{ correct: boolean }> {
  // TODO(backend): return http.post(`/api/battles/sessions/${sessionId}/answer`, { qIndex, letter, timeMs }).then(r => r.data);
  void sessionId;
  void timeMs;
  return { correct: sampleIsCorrect(qIndex, letter) };
}

/** GET /api/battles/sessions/:id/result — final scoreboard once both players finish. */
export async function getBattleResult(sessionId: string): Promise<BattleSummary> {
  // TODO(backend): return http.get<BattleSummary>(`/api/battles/sessions/${sessionId}/result`).then(r => r.data);
  return sampleBattleResult(sessionId);
}

/** GET /api/battles/history — recent battles for the current user. */
export async function getBattleHistory(): Promise<BattleHistoryItem[]> {
  // TODO(backend): return http.get<BattleHistoryItem[]>("/api/battles/history").then(r => r.data);
  return [
    { id: "b-1", opponentName: "Sardor Akhmedov", subject: "MATH", score: "1240–980", won: true, delta: 18, ago: "2h", result: "8–6" },
    { id: "b-2", opponentName: "AI · Gold bot", subject: "MATH", score: "880–1120", won: false, delta: -8, ago: "5h", result: "6–7" },
    { id: "b-3", opponentName: "Madina Yusupova", subject: "MATH", score: "1340–910", won: true, delta: 22, ago: "Y.", result: "9–5" },
    { id: "b-4", opponentName: "Jasur Tursunov", subject: "PHYS", score: "1080–1080", won: false, delta: -2, ago: "Y.", result: "7–7" },
  ];
}

/** GET /api/battles/live — battles currently in progress. */
export async function getLiveBattles(): Promise<LiveBattle[]> {
  // TODO(backend): return http.get<LiveBattle[]>("/api/battles/live").then(r => r.data);
  return [
    { id: "lb-1", a: { name: "Aziz K.", elo: 2104 }, b: { name: "Lola R.", elo: 1980 }, question: 7, total: 10 },
    { id: "lb-2", a: { name: "Otabek S.", elo: 1955 }, b: { name: "AI · Plat", elo: 2000 }, question: 3, total: 10 },
    { id: "lb-3", a: { name: "Nodira A.", elo: 1902 }, b: { name: "Sardor X.", elo: 1802 }, question: 9, total: 10 },
  ];
}

/** GET /api/friends/online — currently-online friends list. */
export async function getFriendsOnline(): Promise<FriendOnline[]> {
  // TODO(backend): return http.get<FriendOnline[]>("/api/friends/online").then(r => r.data);
  return [
    { id: "f-1", name: "Bekzod", elo: 1612, status: "In Math lobby" },
    { id: "f-2", name: "Madina", elo: 1340, status: "Studying" },
    { id: "f-3", name: "Jasur", elo: 1455, status: "Online" },
  ];
}

// ─────────────────────────── Leaderboard ───────────────────────────

/** GET /api/leaderboard?scope=global&subject=MATH — paginated leaderboard rows. */
export async function getLeaderboard(
  scope: LeaderboardScope,
  subject: SubjectCode,
): Promise<{ rows: LeaderboardRow[]; you: LeaderboardRow }> {
  // TODO(backend): return http.get("/api/leaderboard", { params: { scope, subject } }).then(r => r.data);
  void scope;
  void subject;
  const rows: LeaderboardRow[] = [
    { rank: 1, name: "Aziz Karimov", school: "Lyceum #1, Tashkent", elo: 2104, w: 312, l: 64, streak: 8 },
    { rank: 2, name: "Lola Rashidova", school: "Westminster IUT", elo: 1980, w: 287, l: 71, streak: 4 },
    { rank: 3, name: "Otabek Saidov", school: "Presidential School", elo: 1955, w: 251, l: 80, streak: 12 },
    { rank: 4, name: "Nodira A.", school: "School #243", elo: 1902, w: 198, l: 62, streak: 2 },
    { rank: 5, name: "Jamshid T.", school: "Lyceum #1, Samarkand", elo: 1881, w: 220, l: 91, streak: 1 },
    { rank: 6, name: "Madina N.", school: "Lyceum #2", elo: 1820, w: 165, l: 64, streak: 0 },
    { rank: 7, name: "Sardor X.", school: "School #19", elo: 1802, w: 178, l: 74, streak: 3 },
    { rank: 8, name: "Dilshoda M.", school: "IB Tashkent", elo: 1781, w: 154, l: 60, streak: 5 },
  ];
  const you: LeaderboardRow = {
    rank: 47,
    name: "Diana M.",
    school: "Lyceum #1, Tashkent",
    elo: 1487,
    w: 23,
    l: 11,
    streak: 4,
    isYou: true,
  };
  return { rows, you };
}

// ─────────────────────────── Chat / Coach ───────────────────────────

/** GET /api/coach/sessions — current user's recent chat sessions. */
export async function listChatSessions(): Promise<ChatSessionSummary[]> {
  // TODO(backend): return http.get<ChatSessionSummary[]>("/api/coach/sessions").then(r => r.data);
  return [
    { id: "cs-1", topic: "Quadratic equations", preview: "a = 1, b = -5, c = 6…", when: "Now", status: "active" },
    { id: "cs-2", topic: "Logarithms", preview: "Master · 8 exchanges", when: "2h", status: "in_progress" },
    { id: "cs-3", topic: "Vieta's theorem", preview: "Mastered · 5 exchanges", when: "Yest.", status: "mastered" },
    { id: "cs-4", topic: "Discriminant", preview: "Still struggling", when: "2d", status: "struggling" },
    { id: "cs-5", topic: "Linear equations", preview: "Mastered · 4 exch.", when: "5d", status: "mastered" },
  ];
}

/** POST /api/coach/sessions — start a new chat session for a topic. */
export async function createChatSession(topic?: string): Promise<{ id: string; topic: string }> {
  // TODO(backend): return http.post("/api/coach/sessions", { topic }).then(r => r.data);
  return { id: `cs-${Date.now()}`, topic: topic ?? "New session" };
}

/** POST /api/coach/sessions/:id/messages — send a message and receive the coach's reply. */
export async function sendChatMessage(sessionId: string, text: string): Promise<ChatMessage> {
  // TODO(backend): return http.post(`/api/coach/sessions/${sessionId}/messages`, { text }).then(r => r.data);
  void sessionId;
  return {
    id: `msg-${Date.now()}`,
    role: "coach",
    text: sampleCoachReply(text),
    createdAt: Date.now(),
  };
}

/** POST /api/coach/sessions/:id/end — end the session and persist progress. */
export async function endChatSession(sessionId: string): Promise<void> {
  // TODO(backend): await http.post(`/api/coach/sessions/${sessionId}/end`);
  void sessionId;
}

/** POST /api/coach/sessions/:id/understood — mark current step as understood. */
export async function markUnderstood(sessionId: string): Promise<void> {
  // TODO(backend): await http.post(`/api/coach/sessions/${sessionId}/understood`);
  void sessionId;
}

// ─────────────────────────── Notifications ───────────────────────────

/** GET /api/notifications — recent notifications. */
export async function getNotifications(): Promise<Notification[]> {
  // TODO(backend): return http.get<Notification[]>("/api/notifications").then(r => r.data);
  return [
    { id: "n-1", title: "Madina challenged you", body: "5-min Math battle waiting.", when: "2m", read: false },
    { id: "n-2", title: "Roadmap updated", body: "We rebuilt your study path after mock #7.", when: "1h", read: false },
    { id: "n-3", title: "Weekly leaderboard reset", body: "You finished #47 in Math.", when: "3d", read: true },
  ];
}

// ─────────────────────────── Search ───────────────────────────

/** GET /api/search?q= — search topics, formulas, and lessons. */
export async function searchTopics(q: string): Promise<{ topics: string[] }> {
  // TODO(backend): return http.get("/api/search", { params: { q } }).then(r => r.data);
  const all = [
    "Quadratic equations",
    "Linear equations",
    "Inequalities",
    "Logarithms",
    "Trigonometry",
    "Sequences & series",
    "Probability",
    "Functions",
    "Vieta's theorem",
    "Discriminant",
  ];
  return { topics: all.filter((s) => s.toLowerCase().includes(q.toLowerCase())) };
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

const SAMPLE_BATTLE_QUESTIONS: BattleQuestion[] = [
  {
    id: "bq-1",
    index: 0,
    topic: "Quadratic equations",
    prompt: "What is the discriminant of the equation",
    expression: "x² − 5x + 6 = 0 ?",
    options: [
      { letter: "A", text: "D = 1" },
      { letter: "B", text: "D = 7" },
      { letter: "C", text: "D = −1" },
      { letter: "D", text: "D = 49" },
    ],
    correctLetter: "A",
    weight: 2.2,
  },
  {
    id: "bq-2",
    index: 1,
    topic: "Linear equations",
    prompt: "If 3x − 7 = 2x + 5, what is x?",
    options: [
      { letter: "A", text: "x = 12" },
      { letter: "B", text: "x = 2" },
      { letter: "C", text: "x = −12" },
      { letter: "D", text: "x = 5" },
    ],
    correctLetter: "A",
    weight: 2.0,
  },
  {
    id: "bq-3",
    index: 2,
    topic: "Vieta's theorem",
    prompt: "For x² − 7x + 12 = 0, what is x₁ · x₂?",
    options: [
      { letter: "A", text: "−12" },
      { letter: "B", text: "7" },
      { letter: "C", text: "12" },
      { letter: "D", text: "−7" },
    ],
    correctLetter: "C",
    weight: 2.4,
  },
  {
    id: "bq-4",
    index: 3,
    topic: "Logarithms",
    prompt: "Simplify",
    expression: "log₂(32) − log₂(4)",
    options: [
      { letter: "A", text: "1" },
      { letter: "B", text: "3" },
      { letter: "C", text: "5" },
      { letter: "D", text: "8" },
    ],
    correctLetter: "B",
    weight: 2.3,
  },
  {
    id: "bq-5",
    index: 4,
    topic: "Inequalities",
    prompt: "Solve for x:",
    expression: "2x − 3 ≥ 7",
    options: [
      { letter: "A", text: "x ≥ 2" },
      { letter: "B", text: "x ≥ 5" },
      { letter: "C", text: "x ≤ 5" },
      { letter: "D", text: "x ≥ 4" },
    ],
    correctLetter: "B",
    weight: 2.1,
  },
  {
    id: "bq-6",
    index: 5,
    topic: "Trigonometry",
    prompt: "If sin θ = 3/5 and θ is acute, what is cos θ?",
    options: [
      { letter: "A", text: "3/4" },
      { letter: "B", text: "4/5" },
      { letter: "C", text: "5/4" },
      { letter: "D", text: "1/5" },
    ],
    correctLetter: "B",
    weight: 2.5,
  },
  {
    id: "bq-7",
    index: 6,
    topic: "Functions",
    prompt: "If f(x) = 2x + 1, what is f(3)?",
    options: [
      { letter: "A", text: "5" },
      { letter: "B", text: "6" },
      { letter: "C", text: "7" },
      { letter: "D", text: "8" },
    ],
    correctLetter: "C",
    weight: 2.0,
  },
  {
    id: "bq-8",
    index: 7,
    topic: "Sequences",
    prompt: "Find the 5th term of the arithmetic sequence 3, 7, 11, …",
    options: [
      { letter: "A", text: "15" },
      { letter: "B", text: "19" },
      { letter: "C", text: "21" },
      { letter: "D", text: "23" },
    ],
    correctLetter: "B",
    weight: 2.2,
  },
  {
    id: "bq-9",
    index: 8,
    topic: "Geometry",
    prompt: "Area of a circle with radius 4 (use π ≈ 3.14):",
    options: [
      { letter: "A", text: "12.56" },
      { letter: "B", text: "25.12" },
      { letter: "C", text: "50.24" },
      { letter: "D", text: "100.48" },
    ],
    correctLetter: "C",
    weight: 2.1,
  },
  {
    id: "bq-10",
    index: 9,
    topic: "Probability",
    prompt: "Probability of rolling an even number on a fair die?",
    options: [
      { letter: "A", text: "1/6" },
      { letter: "B", text: "1/3" },
      { letter: "C", text: "1/2" },
      { letter: "D", text: "2/3" },
    ],
    correctLetter: "C",
    weight: 2.0,
  },
];

const SAMPLE_OPPONENTS: BattleOpponent[] = [
  { id: "u-202", name: "Sardor Akhmedov", elo: 1502, avatarHue: 200 },
  { id: "u-203", name: "Madina Yusupova", elo: 1340, avatarHue: 320 },
  { id: "u-204", name: "Jasur Tursunov", elo: 1455, avatarHue: 100 },
];

function sampleIsCorrect(qIndex: number, letter: BattleLetter | null): boolean {
  if (!letter) return false;
  const q = SAMPLE_BATTLE_QUESTIONS[qIndex % SAMPLE_BATTLE_QUESTIONS.length];
  return q?.correctLetter === letter;
}

function sampleBattleSession(
  args: { subject: SubjectCode; mode: "ranked" | "friend" | "ai"; opponentId?: string; opponentName?: string },
  id?: string,
): BattleSession {
  const fallback = SAMPLE_OPPONENTS[0];
  const opponent: BattleOpponent = args.opponentName
    ? {
        id: args.opponentId ?? `u-${Math.abs(hashString(args.opponentName)) % 9999}`,
        name: args.opponentName,
        elo: 1400 + (Math.abs(hashString(args.opponentName)) % 200),
        avatarHue: Math.abs(hashString(args.opponentName)) % 360,
      }
    : args.mode === "ai"
      ? { id: "ai-silver", name: "AI · Silver bot", elo: 1480, avatarHue: 280 }
      : fallback;
  return {
    id: id ?? `battle-${Date.now()}`,
    subject: args.subject,
    mode: args.mode,
    perQuestionMs: 30_000,
    totalQuestions: SAMPLE_BATTLE_QUESTIONS.length,
    opponent,
    questions: SAMPLE_BATTLE_QUESTIONS,
  };
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function sampleBattleResult(sessionId: string): BattleSummary {
  const opponent = SAMPLE_OPPONENTS[0];
  const breakdown: BattleAnswer[] = SAMPLE_BATTLE_QUESTIONS.map((q, i) => {
    const youRight = i % 4 !== 2;
    const oppRight = i % 4 !== 1 && i % 4 !== 3;
    return {
      qIndex: i,
      topic: q.topic,
      yourLetter: youRight ? q.correctLetter : "D",
      yourCorrect: youRight,
      yourTimeMs: 2_800 + ((i * 13) % 5_000),
      opponentLetter: oppRight ? q.correctLetter : "C",
      opponentCorrect: oppRight,
      opponentTimeMs: 3_400 + ((i * 17) % 5_500),
    };
  });
  const yourCorrect = breakdown.filter((b) => b.yourCorrect).length;
  const opponentCorrect = breakdown.filter((b) => b.opponentCorrect).length;
  const yourScore = yourCorrect * 155;
  const opponentScore = opponentCorrect * 155;
  const outcome: BattleSummary["outcome"] =
    yourScore > opponentScore ? "won" : yourScore < opponentScore ? "lost" : "draw";
  return {
    sessionId,
    subject: "MATH",
    opponent,
    outcome,
    yourScore,
    opponentScore,
    yourCorrect,
    opponentCorrect,
    totalQuestions: breakdown.length,
    eloDelta: outcome === "won" ? 18 : outcome === "lost" ? -8 : 0,
    streak: 4,
    breakdown,
  };
}

function sampleCoachReply(userText: string): string {
  const lc = userText.toLowerCase().trim();
  if (!lc) return "Take your time. What part of the problem feels stuck?";
  if (/\b(yes|yeah|yep|ok|okay)\b/.test(lc)) {
    return "Good. Now apply the discriminant formula D = b² − 4ac. What do you get with a = 1, b = -5, c = 6?";
  }
  if (/\b(no|don'?t|idk|not sure)\b/.test(lc)) {
    return "No problem — let's slow down. Start from the general form ax² + bx + c = 0. What are a, b, c in your equation?";
  }
  if (/=/.test(lc) || /\d/.test(lc)) {
    return "Nice work. Try one more step: plug those values into the quadratic formula and tell me what you get for x.";
  }
  return "Interesting. Can you walk me through the next step you'd try, and why?";
}
