export type StartingLevel = "foundations" | "refresher" | "core";
export type TopicState = "not_started" | "learning" | "practicing" | "review_due" | "retained";
export type Confidence = "low" | "medium" | "high";
export type QuestionType = "numeric" | "choice" | "multi_select" | "expression" | "ordering" | "reflection";

export interface AttemptSubmission {
  questionId: string;
  contentVersion: number;
  answer: unknown;
  confidence: Confidence;
  hintsUsed: number;
  elapsedSeconds: number;
}

export interface SessionPlan {
  budgetMinutes: 15 | 30 | 45 | 60;
  reason: string;
  reviewItems: string[];
  lessonId?: string;
  practiceQuestionIds: string[];
  reflectionMinutes: number;
  allocation: { recall: number; read: number; practice: number; reflect: number };
}

export interface LessonSummary {
  id: string;
  path: "foundations" | "probability" | "linear-algebra" | "calculus";
  order: number;
  title: string;
  summary: string;
  prerequisites: string[];
  estimatedMinutes: number;
  contentVersion: number;
  published: boolean;
}

export interface RecommendationCandidate {
  id: string;
  kind: "review" | "confident_error" | "mistake" | "prerequisite" | "lesson" | "interleave";
  minutes: number;
  reason: string;
  priority?: number;
}

export interface MasteryEvidence {
  independentAttempts: Array<{ correct: boolean; sessionId: string; occurredAt: string }>;
  delayedFreshSuccess: boolean;
  hasHighPriorityGap: boolean;
}
