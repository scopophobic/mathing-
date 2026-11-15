import { describe, expect, it } from "vitest";
import { buildSessionPlan, isRetained, nextReviewInterval, SESSION_ALLOCATIONS } from "./engine";

describe("session planning", () => {
  it("keeps every allocation inside its exact budget", () => {
    for (const [budget, allocation] of Object.entries(SESSION_ALLOCATIONS)) {
      expect(Object.values(allocation).reduce((total, minutes) => total + minutes, 0)).toBe(Number(budget));
    }
  });

  it("prioritises due work but caps review at thirty percent", () => {
    const plan = buildSessionPlan(30, [
      { id: "r1", kind: "review", minutes: 6, reason: "Due today" },
      { id: "r2", kind: "review", minutes: 6, reason: "Also due" },
      { id: "lesson", kind: "lesson", minutes: 10, reason: "Next ready lesson" },
    ]);
    expect(plan.reviewItems).toEqual(["r1"]);
    expect(plan.lessonId).toBe("lesson");
    expect(plan.reason).toBe("Due today");
  });
});

describe("review and mastery", () => {
  it("uses the authored interval sequence and repairs failure tomorrow", () => {
    expect(nextReviewInterval(0, true)).toBe(1);
    expect(nextReviewInterval(3, true)).toBe(14);
    expect(nextReviewInterval(5, true)).toBe(60);
    expect(nextReviewInterval(5, false)).toBe(1);
  });

  it("requires independent work across sessions and delayed evidence", () => {
    const attempts = Array.from({ length: 8 }, (_, index) => ({ correct: index > 1, sessionId: index < 4 ? "a" : "b", occurredAt: `2026-01-${String(index + 1).padStart(2, "0")}` }));
    expect(isRetained({ independentAttempts: attempts, delayedFreshSuccess: true, hasHighPriorityGap: false })).toBe(false);
    attempts[0].correct = true;
    attempts[1].correct = true;
    expect(isRetained({ independentAttempts: attempts, delayedFreshSuccess: true, hasHighPriorityGap: false })).toBe(true);
    expect(isRetained({ independentAttempts: attempts, delayedFreshSuccess: false, hasHighPriorityGap: false })).toBe(false);
  });
});
