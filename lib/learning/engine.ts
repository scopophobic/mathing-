import type { MasteryEvidence, RecommendationCandidate, SessionPlan } from "./types";

export const SESSION_ALLOCATIONS = {
  15: { recall: 2, read: 4, practice: 7, reflect: 2 },
  30: { recall: 4, read: 6, practice: 16, reflect: 4 },
  45: { recall: 6, read: 9, practice: 23, reflect: 7 },
  60: { recall: 8, read: 12, practice: 31, reflect: 9 },
} as const;

export const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60] as const;

const recommendationOrder: Record<RecommendationCandidate["kind"], number> = {
  review: 1,
  confident_error: 2,
  mistake: 3,
  prerequisite: 4,
  lesson: 5,
  interleave: 6,
};

export function buildSessionPlan(
  budgetMinutes: SessionPlan["budgetMinutes"],
  candidates: RecommendationCandidate[],
  options: { reviewOnly?: boolean } = {},
): SessionPlan {
  const allocation = SESSION_ALLOCATIONS[budgetMinutes];
  const sorted = candidates.toSorted((a, b) =>
    recommendationOrder[a.kind] - recommendationOrder[b.kind] || (b.priority ?? 0) - (a.priority ?? 0),
  );
  const reviewLimit = options.reviewOnly ? budgetMinutes : Math.floor(budgetMinutes * 0.3);
  let reviewMinutes = 0;
  const selected: RecommendationCandidate[] = [];

  for (const item of sorted) {
    const isReview = item.kind === "review" || item.kind === "confident_error" || item.kind === "mistake";
    if (isReview && reviewMinutes + item.minutes > reviewLimit) continue;
    if (isReview) reviewMinutes += item.minutes;
    selected.push(item);
    if (selected.reduce((total, candidate) => total + candidate.minutes, 0) >= allocation.practice) break;
  }

  const lesson = selected.find((item) => item.kind === "lesson" || item.kind === "prerequisite");
  const first = selected[0];
  return {
    budgetMinutes,
    reason: first?.reason ?? "Continue the next ready idea in your path.",
    reviewItems: selected.filter((item) => item.kind === "review" || item.kind === "mistake" || item.kind === "confident_error").map((item) => item.id),
    lessonId: lesson?.id,
    practiceQuestionIds: selected.filter((item) => item.kind === "interleave").map((item) => item.id),
    reflectionMinutes: allocation.reflect,
    allocation,
  };
}

export function nextReviewInterval(previousSuccessfulReviews: number, correct: boolean) {
  return correct ? REVIEW_INTERVALS[Math.min(previousSuccessfulReviews, REVIEW_INTERVALS.length - 1)] : 1;
}

export function isRetained(evidence: MasteryEvidence) {
  const attempts = evidence.independentAttempts;
  if (attempts.length < 8 || evidence.hasHighPriorityGap || !evidence.delayedFreshSuccess) return false;
  if (new Set(attempts.map((attempt) => attempt.sessionId)).size < 2) return false;
  const latest = attempts.toSorted((a, b) => b.occurredAt.localeCompare(a.occurredAt)).slice(0, 10);
  return latest.filter((attempt) => attempt.correct).length / latest.length >= 0.8;
}
