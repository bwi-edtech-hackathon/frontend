// sessionStorage-backed state for the in-progress mock exam.
// Survives reloads within a tab, gone on tab close — matches "auto-save" expectation.

export const EXAM_DURATION_MS = 150 * 60 * 1000; // 150 min spec
export const SECTION_A_COUNT = 35;
export const SECTION_B_COUNT = 10;
export const TOTAL_Q = SECTION_A_COUNT + SECTION_B_COUNT;

const KEY = "coachai.exam";

export type ExamState = {
  startedAt: number;
  durationMs: number;
  answers: Record<number, string>; // qIndex (0-based) -> letter "A".."D"
  flagged: number[];
  current: number;
  finishedAt?: number;
};

function isExamState(v: unknown): v is ExamState {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.startedAt === "number" &&
    typeof o.durationMs === "number" &&
    typeof o.current === "number" &&
    typeof o.answers === "object" &&
    Array.isArray(o.flagged)
  );
}

export function readExam(): ExamState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isExamState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeExam(state: ExamState) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function startExam(durationMs = EXAM_DURATION_MS): ExamState {
  const state: ExamState = {
    startedAt: Date.now(),
    durationMs,
    answers: {},
    flagged: [],
    current: 0,
  };
  writeExam(state);
  return state;
}

export function clearExam() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function formatHMS(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
