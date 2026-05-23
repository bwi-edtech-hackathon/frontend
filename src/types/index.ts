export type Subject = "english" | "math";

export type LanguageCode =
  | "english"
  | "russian"
  | "chinese"
  | "japanese"
  | "arabic"
  | "french"
  | "spanish"
  | "korean";

export type QuestionType = "mcq" | "text" | "voice";
export type Difficulty = 1 | 2 | 3;

export type Question = {
  id: string;
  subject: Subject;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  difficulty: Difficulty;
  topic: string;
  /** For voice questions: instructions or cue card. */
  cue?: string;
};

export type DiagnosticAnswer = {
  questionId: string;
  answer: string;
  correct: boolean;
  difficulty: Difficulty;
  topic: string;
  timeSpentMs?: number;
};

export type SubSkillScore = {
  label: string;
  score: number;
};

export type DiagnosticResult = {
  level: string;
  percentile: number;
  durationMs: number;
  questionCount: number;
  strengths: string[];
  weaknesses: string[];
  subSkillScores: SubSkillScore[];
};

export type LessonType = "voice" | "text" | "chat";
export type LessonStatus = "locked" | "available" | "completed";

export type Lesson = {
  id: string;
  weekIndex: number;
  title: string;
  description: string;
  type: LessonType;
  durationMin: number;
  targetsWeakArea: boolean;
  difficulty: "easy" | "medium" | "hard";
  problemStatement?: string;
};

export type Week = {
  index: number;
  title: string;
  focus: string;
  lessons: Lesson[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: number;
};

export type VoiceTurn = {
  id: string;
  role: "user" | "ai";
  text: string;
  audioUrl?: string;
  timestamp: number;
};

export type VoiceSessionFeedback = {
  overallBand: number;
  subScores: { label: string; score: number }[];
  specifics: { quote: string; comment: string }[];
};
