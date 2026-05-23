import axios from "axios";
import type {
  DiagnosticAnswer,
  DiagnosticResult,
  Question,
  Subject,
  Week,
} from "@/types";
import {
  questionsFor,
  resultFor,
  roadmapFor,
  SOCRATIC_TEMPLATE_REPLIES,
} from "@/lib/mockData";
import { delay } from "@/lib/utils";

const USE_MOCK = (import.meta.env.VITE_USE_MOCK_DATA ?? "true") === "true";
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function isCorrect(question: Question, answer: string): boolean {
  if (question.type === "voice") return true;
  if (!question.correctAnswer) return false;
  const normalizedAnswer = normalize(answer);
  const correct = normalize(question.correctAnswer);
  if (normalizedAnswer === correct) return true;
  const altForms = correct.split(/\s*\/\s*/);
  return altForms.some((alt) => normalize(alt) === normalizedAnswer);
}

export const api = {
  async getDiagnosticQuestions(subject: Subject): Promise<Question[]> {
    if (USE_MOCK) {
      await delay(200);
      return questionsFor(subject);
    }
    const { data } = await http.get<{ questions: Question[] }>(
      `/api/diagnostic/${subject}/questions`,
    );
    return data.questions;
  },

  async submitAnswer(
    subject: Subject,
    questionId: string,
    answer: string,
    timeSpentMs: number,
  ): Promise<{ correct: boolean }> {
    if (USE_MOCK) {
      await delay(150);
      const q = questionsFor(subject).find((x) => x.id === questionId);
      if (!q) return { correct: false };
      return { correct: isCorrect(q, answer) };
    }
    const { data } = await http.post<{ correct: boolean }>(
      `/api/diagnostic/${subject}/answer`,
      { questionId, answer, timeSpentMs },
    );
    return data;
  },

  async submitVoiceAnswer(
    subject: Subject,
    questionId: string,
    blob: Blob,
  ): Promise<{ transcript: string; score: number; correct: boolean }> {
    if (USE_MOCK) {
      await delay(1500);
      return {
        transcript:
          "I grew up in Tashkent. It's a, um, beautiful city with many parks and good food.",
        score: 6.5,
        correct: true,
      };
    }
    const form = new FormData();
    form.append("audio", blob, "answer.webm");
    form.append("questionId", questionId);
    const { data } = await http.post<{
      transcript: string;
      score: number;
      correct: boolean;
    }>(`/api/diagnostic/${subject}/voice-answer`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async finalizeDiagnostic(
    subject: Subject,
    _answers: DiagnosticAnswer[],
  ): Promise<{ result: DiagnosticResult; roadmap: Week[] }> {
    if (USE_MOCK) {
      await delay(800);
      return { result: resultFor(subject), roadmap: roadmapFor(subject) };
    }
    const { data } = await http.post<{
      result: DiagnosticResult;
      roadmap: Week[];
    }>(`/api/diagnostic/${subject}/finalize`, { answers: _answers });
    return data;
  },

  async chatTurn(
    _lessonId: string,
    _sessionId: string,
    _message: string,
    turnCount: number,
  ): Promise<{ aiResponse: string; finished: boolean; solution?: string }> {
    if (USE_MOCK) {
      await delay(700);
      if (turnCount >= 4) {
        return {
          aiResponse:
            "You've got it. Can you write the final answer in simplest form?",
          finished: true,
          solution:
            "Final step: combine like terms and solve. The full solution is shown above your last message.",
        };
      }
      const reply =
        SOCRATIC_TEMPLATE_REPLIES[turnCount % SOCRATIC_TEMPLATE_REPLIES.length];
      return { aiResponse: reply, finished: false };
    }
    const { data } = await http.post<{
      aiResponse: string;
      finished: boolean;
      solution?: string;
    }>(`/api/lesson/${_lessonId}/chat/turn`, {
      sessionId: _sessionId,
      message: _message,
    });
    return data;
  },
};

export const USE_MOCK_DATA = USE_MOCK;
