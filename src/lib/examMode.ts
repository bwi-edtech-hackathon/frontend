import type { SubjectCode } from "@/lib/api";

export type ExamMode = "app" | "quick";

export function examModeFromPath(pathname: string): ExamMode {
  return pathname.startsWith("/quick-exam") ? "quick" : "app";
}

export function examBasePath(mode: ExamMode): string {
  return mode === "quick" ? "/quick-exam" : "/app/exam";
}

export function examSubPath(
  mode: ExamMode,
  suffix: "active" | "analyzing" | "result",
): string {
  return `${examBasePath(mode)}/${suffix}`;
}

export function exitPathFor(mode: ExamMode): string {
  return mode === "quick" ? "/" : "/app/exam";
}

export function dashboardPathFor(mode: ExamMode): string {
  return mode === "quick" ? "/" : "/app";
}

const SUBJECT_LABELS: Record<SubjectCode, string> = {
  MATH: "Mathematics",
  PHYS: "Physics",
  CHEM: "Chemistry",
  BIO: "Biology",
  HIST: "History",
  GEOG: "Geography",
  UZB_LIT: "Uzbek lit",
  RUS_LIT: "Russian lit",
  KAR_LIT: "Karakalpak",
};

const SUBJECT_BY_SLUG: Record<string, SubjectCode> = {
  math: "MATH",
  mathematics: "MATH",
  physics: "PHYS",
  phys: "PHYS",
  chem: "CHEM",
  chemistry: "CHEM",
  bio: "BIO",
  biology: "BIO",
  hist: "HIST",
  history: "HIST",
  geog: "GEOG",
  geography: "GEOG",
  "uzbek-lit": "UZB_LIT",
  uzbek: "UZB_LIT",
  uzb: "UZB_LIT",
  "russian-lit": "RUS_LIT",
  russian: "RUS_LIT",
  rus: "RUS_LIT",
  karakalpak: "KAR_LIT",
  kar: "KAR_LIT",
};

export function subjectFromSlug(slug?: string): SubjectCode {
  if (!slug) return "MATH";
  return SUBJECT_BY_SLUG[slug.toLowerCase()] ?? "MATH";
}

export function slugForSubject(code: SubjectCode): string {
  const map: Record<SubjectCode, string> = {
    MATH: "math",
    PHYS: "physics",
    CHEM: "chemistry",
    BIO: "biology",
    HIST: "history",
    GEOG: "geography",
    UZB_LIT: "uzbek-lit",
    RUS_LIT: "russian-lit",
    KAR_LIT: "karakalpak",
  };
  return map[code];
}

export function labelForSubject(code: SubjectCode): string {
  return SUBJECT_LABELS[code];
}
