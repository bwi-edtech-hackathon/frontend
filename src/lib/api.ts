// Backend API client. The TypeScript types here are the contract between
// pages and the FastAPI backend. Each function calls a real endpoint when
// `VITE_USE_MOCK_DATA=false` (the default), otherwise falls back to a sample
// fixture so the UI keeps working in offline-demo mode.

import axios, { type AxiosInstance } from "axios";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
const USE_MOCK = (import.meta.env.VITE_USE_MOCK_DATA ?? "false") === "true";

export const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    // Bypass ngrok-free.dev's browser interstitial when the backend is tunneled
    // through ngrok — without this header ngrok returns its warning HTML page
    // (200, no CORS) instead of proxying the request, which surfaces as a
    // confusing "not allowed by Access-Control-Allow-Origin" error.
    "ngrok-skip-browser-warning": "true",
  },
});

/** Absolute backend URL (for EventSource / WebSocket which can't use axios). */
export function backendUrl(path: string): string {
  if (BASE_URL) return `${BASE_URL.replace(/\/$/, "")}${path}`;
  return path;
}

/** WebSocket URL helper — flips http→ws / https→wss. */
export function wsUrl(path: string): string {
  const base = BASE_URL || `${location.protocol}//${location.host}`;
  return base.replace(/^http/, "ws").replace(/\/$/, "") + path;
}

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
  index: number;
  section: "A" | "B";
  type: "closed" | "open_a" | "open_b";
  domain: string;
  topic: string;
  prompt: string;
  expression?: string;
  options?: { letter: "A" | "B" | "C" | "D"; text: string }[];
  weight: number;
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
  raschScore: number;
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

export type ExamHistoryItem = {
  id: string;
  slug: string;
  subject: SubjectCode;
  subjectLabel: string;
  kind: "diagnostic" | "full_mock" | "checkpoint";
  status: "in_progress" | "submitted" | "graded" | "abandoned";
  grade: string | null;
  raschScore: number | null;
  rawScore: number | null;
  totalCorrect: number;
  totalQuestions: number;
  startedAt: number;
  submittedAt: number | null;
};

export type FormulaItem = { name: string; eq: string; href?: string | null };
export type FormulaGroup = {
  title: string;
  items: FormulaItem[];
  // "formula" (default) renders as a LaTeX-style pill; "reference" renders
  // as an external link — used for humanities subjects where formulas aren't
  // meaningful.
  kind?: "formula" | "reference";
};

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
  // Subject code so the chat sidebar can show the right reference panel.
  subject?: SubjectCode | string;
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

export async function createExamSession(subject: SubjectCode): Promise<ExamSession> {
  if (USE_MOCK) return sampleExamSession(subject);
  const res = await http.post<ExamSession>("/api/v1/exam/sessions", {
    subject,
    kind: "full_mock",
  });
  return res.data;
}

export async function getExamSession(id: string): Promise<ExamSession> {
  if (USE_MOCK) return sampleExamSession("MATH", id);
  const res = await http.get<ExamSession>(`/api/v1/exam/sessions/${id}`);
  return res.data;
}

export async function saveAnswer(
  sessionId: string,
  qIndex: number,
  answer: string | null,
  flagged: boolean,
): Promise<void> {
  if (USE_MOCK) return;
  await http.patch(`/api/v1/exam/sessions/${sessionId}/answer`, {
    qIndex,
    answer,
    flagged,
  });
}

export async function submitExam(sessionId: string): Promise<{ jobId: string }> {
  if (USE_MOCK) return { jobId: `analysis-${sessionId}` };
  const res = await http.post<{ jobId: string; sessionId: string }>(
    `/api/v1/exam/sessions/${sessionId}/submit`,
  );
  return { jobId: res.data.jobId };
}

export async function getExamResult(sessionId: string): Promise<ExamSummary> {
  if (USE_MOCK) return sampleResult(sessionId);
  const res = await http.get<ExamSummary>(
    `/api/v1/exam/sessions/${sessionId}/result`,
  );
  return res.data;
}

export async function getExamHistory(limit = 20): Promise<ExamHistoryItem[]> {
  if (USE_MOCK) return sampleExamHistory();
  const res = await http.get<ExamHistoryItem[]>("/api/v1/exam/history", {
    params: { limit },
  });
  return res.data;
}

export async function getFormulaSheet(
  subject: SubjectCode = "MATH",
): Promise<FormulaGroup[]> {
  if (USE_MOCK) return SAMPLE_FORMULAS;
  const res = await http.get<FormulaGroup[]>("/api/v1/formulas", { params: { subject } });
  return res.data;
}

export async function requestAIAnalysis(sessionId: string): Promise<{ chatId: string }> {
  // Spawn a NEW chat session seeded with the wrong-answer breakdown for this
  // exam — the backend pre-populates the session with a system summary + coach
  // opener so the chat lands with full context instead of a generic intro.
  if (USE_MOCK) return { chatId: `chat-${sessionId}` };
  const res = await http.post<{ id: string }>("/api/coach/sessions/from-exam", {
    exam_session_id: sessionId,
  });
  return { chatId: res.data.id };
}

/** Convert a SubjectCode to the slug the backend stores (e.g. "UZB_LIT" → "uzb-lit"). */
export function subjectSlug(subject: SubjectCode): string {
  return subject.toLowerCase().replace(/_/g, "-");
}

export async function regenerateRoadmap(
  subjectOrSession: SubjectCode | string,
  sessionId?: string,
): Promise<{ roadmapId: string }> {
  // Accept either a SubjectCode ("MATH", "PHYS", …) or a legacy session-id
  // string. The roadmap endpoint is keyed by subject slug.
  const isCode = /^[A-Z_]+$/.test(subjectOrSession);
  const slug = isCode
    ? subjectSlug(subjectOrSession as SubjectCode)
    : "math";
  const tag = sessionId ?? subjectOrSession;
  if (USE_MOCK) return { roadmapId: `roadmap-${tag}` };
  try {
    await http.post(`/api/v1/roadmap/${slug}/regenerate`);
  } catch {
    /* roadmap module is optional in demo */
  }
  return { roadmapId: `roadmap-${tag}` };
}

export type RoadmapMilestone = {
  topicId: string;
  topicSlug: string;
  topicNameEn: string;
  topicNameUz: string;
  order: number;
  status: "mastered" | "in_progress" | "active" | "locked";
  masteryPct: number;
  estMinutes: number;
  weekBucket: number;
  lane: number;
  weight: number;
};

export type Roadmap = {
  id: string;
  subjectId: string;
  subjectSlug: string;
  generatedAt: string;
  weeksTotal: number;
  onTrack: boolean;
  milestones: RoadmapMilestone[];
};

type RoadmapResponseRaw = {
  id: string;
  subject_id: string;
  subject_slug: string;
  user_id: string;
  generated_at: string;
  weeks_total: number;
  on_track: boolean;
  milestones: {
    topic_id: string;
    topic_slug: string;
    topic_name_uz: string;
    topic_name_en: string;
    order: number;
    status: string;
    mastery_pct: number;
    est_minutes: number;
    week_bucket: number;
    lane?: number;
    weight: number;
  }[];
};

function normalizeRoadmap(raw: RoadmapResponseRaw): Roadmap {
  return {
    id: raw.id,
    subjectId: raw.subject_id,
    subjectSlug: raw.subject_slug,
    generatedAt: raw.generated_at,
    weeksTotal: raw.weeks_total,
    onTrack: raw.on_track,
    milestones: (raw.milestones ?? []).map((m) => ({
      topicId: m.topic_id,
      topicSlug: m.topic_slug,
      topicNameEn: m.topic_name_en,
      topicNameUz: m.topic_name_uz,
      order: m.order,
      status: m.status as RoadmapMilestone["status"],
      masteryPct: Number(m.mastery_pct),
      estMinutes: m.est_minutes,
      weekBucket: m.week_bucket,
      lane: typeof m.lane === "number" ? m.lane : 0,
      weight: Number(m.weight),
    })),
  };
}

/** Fetch the persisted roadmap for a subject. The backend lazily generates
 * the plan on first request, so subjects with no prior roadmap row still
 * return a populated milestone list. */
export async function getRoadmap(subject: SubjectCode): Promise<Roadmap> {
  const slug = subjectSlug(subject);
  if (USE_MOCK) return mockRoadmap(subject);
  const res = await http.get<RoadmapResponseRaw>(`/api/v1/roadmap/${slug}`);
  return normalizeRoadmap(res.data);
}

function mockRoadmap(subject: SubjectCode): Roadmap {
  const seed = ["Linear equations", "Quadratic equations", "Logarithms", "Functions", "Trigonometry", "Sequences & series"];
  return {
    id: `mock-${subject}`,
    subjectId: `mock-${subject}`,
    subjectSlug: subjectSlug(subject),
    generatedAt: new Date().toISOString(),
    weeksTotal: 6,
    onTrack: true,
    milestones: seed.map((name, i) => ({
      topicId: `mock-t-${i}`,
      topicSlug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      topicNameEn: name,
      topicNameUz: name,
      order: i,
      status: i === 0 ? "mastered" : i === 1 ? "active" : "locked",
      masteryPct: i === 0 ? 90 : i === 1 ? 60 : 0,
      estMinutes: 60,
      weekBucket: Math.floor(i / 2) + 1,
      lane: i % 3,
      weight: 0.8,
    })),
  };
}

// ─────────────────────────── Auth ───────────────────────────
// The backend runs in demo-user mode when no Authorization header is sent,
// so these mock signs in are still fine.

export async function signUp(payload: { name: string; emailOrPhone: string; password: string }): Promise<AuthUser> {
  return { id: "user-1", name: payload.name || "Diana", email: payload.emailOrPhone, plan: "free" };
}

export async function signIn(payload: { emailOrPhone: string; password: string }): Promise<AuthUser> {
  return { id: "user-1", name: "Diana M.", email: payload.emailOrPhone, plan: "free" };
}

export async function signOut(): Promise<void> {
  /* no-op in demo */
}

export async function startCheckout(plan: "free" | "standard" | "premium"): Promise<{ url: string }> {
  return { url: `/checkout/${plan}` };
}

// ─────────────────────────── Battle ───────────────────────────

export async function findRankedMatch(subject: SubjectCode): Promise<Match> {
  if (USE_MOCK)
    return {
      id: `battle-${Date.now()}`,
      subject,
      mode: "ranked",
      opponentId: "u-202",
      opponentName: "Sardor Akhmedov",
      startsAt: Date.now() + 5_000,
    };
  // No human matchmaking on the demo — fall back to a vs-AI session.
  const session = await startBattleSession({ subject, mode: "ai" });
  return {
    id: session.id,
    subject,
    mode: "ranked",
    opponentId: session.opponent.id,
    opponentName: session.opponent.name,
    startsAt: Date.now() + 1500,
  };
}

export async function startAIBattle(subject: SubjectCode, tier: BattleTier): Promise<Match> {
  if (USE_MOCK)
    return {
      id: `battle-ai-${Date.now()}`,
      subject,
      mode: "ai",
      opponentId: `ai-${tier.toLowerCase()}`,
      opponentName: `AI · ${tier} bot`,
      startsAt: Date.now() + 1_000,
    };
  const session = await startBattleSession({
    subject,
    mode: "ai",
  });
  return {
    id: session.id,
    subject,
    mode: "ai",
    opponentId: session.opponent.id,
    opponentName: session.opponent.name,
    startsAt: Date.now() + 1_000,
  };
}

export async function createFriendBattleInvite(subject: SubjectCode): Promise<{ inviteId: string; url: string }> {
  void subject;
  const inviteId = `invite-${Math.random().toString(36).slice(2, 8)}`;
  return { inviteId, url: `${location.origin}/battle/invite/${inviteId}` };
}

export async function challengeFriend(friendId: string, subject: SubjectCode): Promise<Match> {
  if (USE_MOCK)
    return {
      id: `battle-fr-${Date.now()}`,
      subject,
      mode: "friend",
      opponentId: friendId,
      opponentName: friendId,
      startsAt: Date.now() + 1_000,
    };
  const session = await startBattleSession({ subject, mode: "ai" });
  return {
    id: session.id,
    subject,
    mode: "friend",
    opponentId: friendId,
    opponentName: friendId,
    startsAt: Date.now() + 1_000,
  };
}

export async function startBattleSession(args: {
  subject: SubjectCode;
  mode: "ranked" | "friend" | "ai";
  opponentId?: string;
  opponentName?: string;
}): Promise<BattleSession> {
  if (USE_MOCK) return sampleBattleSession(args);
  const res = await http.post<BattleSession>("/api/v1/battles/sessions", {
    subject: args.subject,
    mode: args.mode,
    bot_tier: "SILVER",
    opponent_id: args.opponentId,
    opponent_name: args.opponentName,
  });
  return res.data;
}

export async function getBattleSession(id: string): Promise<BattleSession> {
  if (USE_MOCK) return sampleBattleSession({ subject: "MATH", mode: "ranked" }, id);
  const res = await http.get<BattleSession>(`/api/v1/battles/sessions/${id}`);
  return res.data;
}

export async function submitBattleAnswer(
  sessionId: string,
  qIndex: number,
  letter: BattleLetter | null,
  timeMs: number,
): Promise<{ correct: boolean }> {
  if (USE_MOCK) return { correct: sampleIsCorrect(qIndex, letter) };
  const res = await http.post<{ correct: boolean }>(
    `/api/v1/battles/sessions/${sessionId}/answer`,
    { qIndex, letter, timeMs },
  );
  return res.data;
}

export async function getBattleResult(sessionId: string): Promise<BattleSummary> {
  if (USE_MOCK) return sampleBattleResult(sessionId);
  // /result auto-finishes the battle if not yet finished, so a single GET is
  // enough — no polling required.
  const res = await http.get<BattleSummary>(`/api/v1/battles/sessions/${sessionId}/result`);
  return res.data;
}

/** Open a live WebSocket for a battle. Returns the raw socket — caller is
 * responsible for wiring up message handlers. Useful for live-duel mode. */
export function openBattleWebSocket(battleId: string, token?: string): WebSocket {
  const qs = token ? `?token=${encodeURIComponent(token)}` : "";
  return new WebSocket(wsUrl(`/ws/battles/${battleId}${qs}`));
}

export async function getBattleHistory(): Promise<BattleHistoryItem[]> {
  if (USE_MOCK)
    return [
      { id: "b-1", opponentName: "Sardor Akhmedov", subject: "MATH", score: "1240–980", won: true, delta: 18, ago: "2h", result: "8–6" },
      { id: "b-2", opponentName: "AI · Gold bot", subject: "MATH", score: "880–1120", won: false, delta: -8, ago: "5h", result: "6–7" },
      { id: "b-3", opponentName: "Madina Yusupova", subject: "MATH", score: "1340–910", won: true, delta: 22, ago: "Y.", result: "9–5" },
      { id: "b-4", opponentName: "Jasur Tursunov", subject: "PHYS", score: "1080–1080", won: false, delta: -2, ago: "Y.", result: "7–7" },
    ];
  const res = await http.get<BattleHistoryItem[]>("/api/v1/battles/sessions/history");
  return res.data;
}

export async function getLiveBattles(): Promise<LiveBattle[]> {
  if (USE_MOCK)
    return [
      { id: "lb-1", a: { name: "Aziz K.", elo: 2104 }, b: { name: "Lola R.", elo: 1980 }, question: 7, total: 10 },
      { id: "lb-2", a: { name: "Otabek S.", elo: 1955 }, b: { name: "AI · Plat", elo: 2000 }, question: 3, total: 10 },
      { id: "lb-3", a: { name: "Nodira A.", elo: 1902 }, b: { name: "Sardor X.", elo: 1802 }, question: 9, total: 10 },
    ];
  const res = await http.get<LiveBattle[]>("/api/v1/battles/sessions/live");
  return res.data;
}

export async function getFriendsOnline(): Promise<FriendOnline[]> {
  // Friends graph isn't modeled in the backend yet — return a static set.
  return [
    { id: "f-1", name: "Bekzod", elo: 1612, status: "In Math lobby" },
    { id: "f-2", name: "Madina", elo: 1340, status: "Studying" },
    { id: "f-3", name: "Jasur", elo: 1455, status: "Online" },
  ];
}

// ─────────────────────────── Leaderboard ───────────────────────────

export async function getLeaderboard(
  scope: LeaderboardScope,
  subject: SubjectCode,
): Promise<{ rows: LeaderboardRow[]; you: LeaderboardRow }> {
  // Leaderboards aren't wired to the backend yet — but the filters above the
  // table should still feel alive. We synthesise a deterministic pool per
  // (scope, subject) so the UI re-renders distinct rows on each filter change.
  const base: LeaderboardRow[] = [
    { rank: 1, name: "Aziz Karimov", school: "Lyceum #1, Tashkent", elo: 2104, w: 312, l: 64, streak: 8 },
    { rank: 2, name: "Lola Rashidova", school: "Westminster IUT", elo: 1980, w: 287, l: 71, streak: 4 },
    { rank: 3, name: "Otabek Saidov", school: "Presidential School", elo: 1955, w: 251, l: 80, streak: 12 },
    { rank: 4, name: "Nodira A.", school: "School #243", elo: 1902, w: 198, l: 62, streak: 2 },
    { rank: 5, name: "Jamshid T.", school: "Lyceum #1, Samarkand", elo: 1881, w: 220, l: 91, streak: 1 },
    { rank: 6, name: "Madina N.", school: "Lyceum #2", elo: 1820, w: 165, l: 64, streak: 0 },
    { rank: 7, name: "Sardor X.", school: "School #19", elo: 1802, w: 178, l: 74, streak: 3 },
    { rank: 8, name: "Dilshoda M.", school: "IB Tashkent", elo: 1781, w: 154, l: 60, streak: 5 },
    { rank: 9, name: "Bekzod K.", school: "Lyceum #3, Tashkent", elo: 1740, w: 142, l: 71, streak: 0 },
    { rank: 10, name: "Sevara M.", school: "School #178", elo: 1722, w: 138, l: 80, streak: 2 },
    { rank: 11, name: "Anvar G.", school: "Lyceum #1, Bukhara", elo: 1701, w: 130, l: 75, streak: 1 },
    { rank: 12, name: "Zarina H.", school: "Westminster IUT", elo: 1688, w: 121, l: 70, streak: 4 },
  ];
  const SUBJECT_INDEX: Record<SubjectCode, number> = {
    MATH: 0, PHYS: 1, CHEM: 2, BIO: 3, HIST: 4,
    GEOG: 5, UZB_LIT: 6, RUS_LIT: 7, KAR_LIT: 8,
  };
  const subjectShift = SUBJECT_INDEX[subject] ?? 0;
  // Pin city/school filters by name keywords so the toggle visibly narrows
  // the list rather than just reshuffling it.
  let pool: LeaderboardRow[] = base.slice();
  if (scope === "friends") {
    // Limit to a friend-shaped subset.
    pool = pool.filter((r) =>
      ["Bekzod K.", "Madina N.", "Sardor X.", "Anvar G.", "Zarina H."].includes(
        r.name,
      ),
    );
  } else if (scope === "region") {
    pool = pool.filter((r) => /Tashkent/i.test(r.school));
  } else if (scope === "school") {
    pool = pool.filter((r) => /Lyceum #1, Tashkent/i.test(r.school));
  }
  const eloDelta =
    scope === "weekly" ? -120 : scope === "friends" ? -200 : scope === "region" ? -60 : 0;
  const rotated = pool.map((r, i) => ({
    ...r,
    // Stable per-subject shuffle: small ELO perturbation that still preserves
    // ordering most of the time, plus a name swap so the table looks different.
    elo: r.elo - eloDelta - subjectShift * 7 + ((i * (subjectShift + 1)) % 9),
  }));
  rotated.sort((a, b) => b.elo - a.elo);
  const rows: LeaderboardRow[] = rotated.map((r, i) => ({ ...r, rank: i + 1 }));

  // "You" row tracks both filters so the user sees their rank move when they
  // change subject/scope.
  const youBaseElo = 1487;
  const youSchool =
    scope === "school"
      ? "Lyceum #1, Tashkent"
      : scope === "region"
        ? "Lyceum #1, Tashkent"
        : scope === "friends"
          ? "Lyceum #1, Tashkent"
          : "Lyceum #1, Tashkent";
  const youElo = youBaseElo - subjectShift * 18 + (scope === "weekly" ? 24 : 0);
  const youRank =
    scope === "school"
      ? 4
      : scope === "friends"
        ? Math.min(rows.length, 3)
        : scope === "region"
          ? 12
          : scope === "weekly"
            ? 38
            : 47;
  const you: LeaderboardRow = {
    rank: youRank,
    name: "Diana M.",
    school: youSchool,
    elo: youElo,
    w: 23,
    l: 11,
    streak: 4,
    isYou: true,
  };
  return { rows, you };
}

// ─────────────────────────── Chat / Coach ───────────────────────────

export async function listChatSessions(): Promise<ChatSessionSummary[]> {
  if (USE_MOCK)
    return [
      { id: "cs-1", topic: "Quadratic equations", preview: "a = 1, b = -5, c = 6…", when: "Now", status: "active" },
      { id: "cs-2", topic: "Logarithms", preview: "Master · 8 exchanges", when: "2h", status: "in_progress" },
      { id: "cs-3", topic: "Vieta's theorem", preview: "Mastered · 5 exchanges", when: "Yest.", status: "mastered" },
    ];
  const res = await http.get<ChatSessionSummary[]>("/api/coach/sessions");
  return res.data;
}

export async function createChatSession(topic?: string): Promise<{ id: string; topic: string }> {
  if (USE_MOCK) return { id: `cs-${Date.now()}`, topic: topic ?? "New session" };
  const res = await http.post<ChatSessionSummary>("/api/coach/sessions", { topic });
  return { id: res.data.id, topic: res.data.topic };
}

type ChatHistoryMessageRaw = {
  id: string;
  role: string;
  content: string;
  parts: unknown[];
  token_count: number;
  created_at: string;
};

type ChatHistoryRaw = {
  session: { id: string };
  messages: ChatHistoryMessageRaw[];
};

/** Fetch the persisted message history for a chat session. Returns the
 * messages in chronological order, normalized to the same `ChatMessage`
 * shape that `sendChatMessage` returns. */
export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  if (USE_MOCK) return [];
  const res = await http.get<ChatHistoryRaw>(
    `/api/v1/chat-lesson/sessions/${sessionId}`,
  );
  return (res.data.messages ?? [])
    .filter((m) => m.role === "user" || m.role === "coach")
    .map((m) => ({
      id: m.id,
      role: m.role === "user" ? "user" : "coach",
      text: m.content,
      createdAt: new Date(m.created_at).getTime(),
    }));
}

export async function sendChatMessage(sessionId: string, text: string): Promise<ChatMessage> {
  if (USE_MOCK) {
    return {
      id: `msg-${Date.now()}`,
      role: "coach",
      text: sampleCoachReply(text),
      createdAt: Date.now(),
    };
  }
  const res = await http.post<ChatMessage>(
    `/api/coach/sessions/${sessionId}/messages`,
    { text },
  );
  return res.data;
}

/** Stream a Gemini-powered reply over a WebSocket.
 *
 * Each server frame is a JSON object `{event, data}` carrying one of:
 *   token | math_inline | math_block | diagram | done | error
 *
 * We previously used SSE (POST + text/event-stream) but proxies in front of
 * the backend were buffering the response, so the chat appeared to hang —
 * WS gives us per-frame delivery without that fragility.
 *
 * Returns a cleanup function the caller should run on unmount to close the
 * socket. */
export function streamChatMessage(
  sessionId: string,
  text: string,
  handlers: {
    onToken?: (content: string) => void;
    onMathInline?: (latex: string) => void;
    onMathBlock?: (latex: string) => void;
    onDiagram?: (mermaid: string) => void;
    onDone?: (info: { messageId: string; tokenCount: number }) => void;
    onError?: (err: { code: string; message: string }) => void;
  },
): () => void {
  if (USE_MOCK) {
    let cancelled = false;
    (async () => {
      const parts = [
        "Let's take a look — what type of equation is ",
        "x² − 5x + 6 = 0? ",
        "Tell me the form you recognise.",
      ];
      for (const p of parts) {
        if (cancelled) return;
        handlers.onToken?.(p);
        await new Promise((r) => setTimeout(r, 250));
      }
      handlers.onDone?.({ messageId: `mock-${Date.now()}`, tokenCount: 32 });
    })();
    return () => {
      cancelled = true;
    };
  }

  let closed = false;
  const ws = new WebSocket(wsUrl(`/ws/chat-lesson/sessions/${sessionId}`));

  const finish = () => {
    if (closed) return;
    closed = true;
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      try {
        ws.close();
      } catch {
        /* ignore close errors */
      }
    }
  };

  ws.onopen = () => {
    try {
      ws.send(JSON.stringify({ type: "message", content: text }));
    } catch (e) {
      handlers.onError?.({
        code: "SEND_FAILED",
        message: e instanceof Error ? e.message : String(e),
      });
      finish();
    }
  };

  ws.onmessage = (evt) => {
    let frame: { event?: string; data?: Record<string, unknown> };
    try {
      frame = JSON.parse(typeof evt.data === "string" ? evt.data : "");
    } catch {
      return;
    }
    if (!frame?.event) return;
    dispatchWsEvent(frame.event, frame.data ?? {}, handlers);
    if (frame.event === "done" || frame.event === "error") {
      finish();
    }
  };

  ws.onerror = () => {
    if (closed) return;
    handlers.onError?.({
      code: "WS_ERROR",
      message: "WebSocket connection failed",
    });
    finish();
  };

  ws.onclose = (evt) => {
    if (closed) return;
    // The server closes 1000 after `done`; anything else implies the stream
    // was cut short before we got a terminal event.
    if (evt.code !== 1000) {
      handlers.onError?.({
        code: "WS_CLOSED",
        message: evt.reason || `WebSocket closed (${evt.code})`,
      });
    }
    closed = true;
  };

  return finish;
}

function dispatchWsEvent(
  event: string,
  payload: Record<string, unknown>,
  h: Parameters<typeof streamChatMessage>[2],
) {
  switch (event) {
    case "token":
      h.onToken?.(String(payload.content ?? ""));
      break;
    case "math_inline":
      h.onMathInline?.(String(payload.latex ?? ""));
      break;
    case "math_block":
    case "math_pill":
      h.onMathBlock?.(String(payload.latex ?? ""));
      break;
    case "diagram":
      h.onDiagram?.(String(payload.mermaid ?? ""));
      break;
    case "done":
      h.onDone?.({
        messageId: String(payload.messageId ?? ""),
        tokenCount: Number(payload.tokenCount ?? 0),
      });
      break;
    case "error":
      h.onError?.({
        code: String(payload.code ?? "UNKNOWN"),
        message: String(payload.message ?? ""),
      });
      break;
  }
}

export async function endChatSession(sessionId: string): Promise<void> {
  if (USE_MOCK) return;
  await http.post(`/api/coach/sessions/${sessionId}/end`);
}

export async function markUnderstood(sessionId: string): Promise<void> {
  if (USE_MOCK) return;
  await http.post(`/api/coach/sessions/${sessionId}/understood`);
}

// ─────────────────────────── Notifications ───────────────────────────

export async function getNotifications(): Promise<Notification[]> {
  // Notifications aren't modeled in the backend yet — static fixture.
  return [
    { id: "n-1", title: "Madina challenged you", body: "5-min Math battle waiting.", when: "2m", read: false },
    { id: "n-2", title: "Roadmap updated", body: "We rebuilt your study path after mock #7.", when: "1h", read: false },
    { id: "n-3", title: "Weekly leaderboard reset", body: "You finished #47 in Math.", when: "3d", read: true },
  ];
}

// ─────────────────────────── Search ───────────────────────────

export async function searchTopics(q: string): Promise<{ topics: string[] }> {
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

// ─────────────────────────── Sample fixtures (mock mode) ───────────────────────────

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
  const stems: { prompt: string; expression?: string }[] = [
    {
      prompt: "Find the value of k such that the system has exactly two real solutions:",
      expression: "{ x² + y² = 25     y = kx + 3 }",
    },
    {
      prompt: "Evaluate the expression for the smallest positive integer x satisfying:",
      expression: "2x − 3 ≥ 7",
    },
    { prompt: "Determine the domain of the function f(x) = √(x − 4)" },
    { prompt: "Find the sum of the first 10 terms of the sequence 3, 7, 11, …" },
    { prompt: "If logₐ b = 3, what is the value of a^(2 log_a b) ?" },
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
    const stem = stems[i % stems.length];
    questions.push({
      id: `q-${i}`,
      index: i,
      section: "A",
      type: "closed",
      domain: i < 15 ? "Algebra" : i < 25 ? "Geometry" : "Functions",
      topic: topics[i % topics.length],
      prompt: stem.prompt,
      expression: stem.expression,
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

function sampleExamHistory(): ExamHistoryItem[] {
  const now = Date.now();
  return [
    {
      id: "ex-1",
      slug: "math-mock-7",
      subject: "MATH",
      subjectLabel: "Mathematics",
      kind: "full_mock",
      status: "graded",
      grade: "B",
      raschScore: 58.2,
      rawScore: 64.5,
      totalCorrect: 31,
      totalQuestions: 45,
      startedAt: now - 2 * 24 * 3600 * 1000,
      submittedAt: now - 2 * 24 * 3600 * 1000 + 90 * 60 * 1000,
    },
    {
      id: "ex-2",
      slug: "math-mock-6",
      subject: "MATH",
      subjectLabel: "Mathematics",
      kind: "full_mock",
      status: "graded",
      grade: "B",
      raschScore: 54.1,
      rawScore: 60.0,
      totalCorrect: 28,
      totalQuestions: 45,
      startedAt: now - 9 * 24 * 3600 * 1000,
      submittedAt: now - 9 * 24 * 3600 * 1000 + 100 * 60 * 1000,
    },
  ];
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
