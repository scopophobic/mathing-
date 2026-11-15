import { describe, expect, it } from "vitest";
import type { Question } from "@/lib/content/schema";
import { validateAnswer } from "./answers";

const base = { id: "test-question", lessonId: "test", contentVersion: 1, prompt: "A sufficiently long test prompt.", explanation: "A sufficiently long explanation for the answer.", hints: [] };

describe("answer validation", () => {
  it("accepts equivalent numeric and fractional answers", () => {
    const question = { ...base, type: "numeric", answer: "2/3" } satisfies Question;
    expect(validateAnswer(question, "4/6")).toBe(true);
    expect(validateAnswer(question, "0.5")).toBe(false);
  });

  it("keeps ordered reasoning ordered", () => {
    const question = { ...base, type: "ordering", answer: ["first", "second"] } satisfies Question;
    expect(validateAnswer(question, ["first", "second"])).toBe(true);
    expect(validateAnswer(question, ["second", "first"])).toBe(false);
  });

  it("recognises algebraically equivalent expressions", () => {
    const question = { ...base, type: "expression", answer: "x^2+2x+1" } satisfies Question;
    expect(validateAnswer(question, "(x+1)^2")).toBe(true);
    expect(validateAnswer(question, "(x+2)^2")).toBe(false);
  });

  it("does not machine-grade reflections", () => {
    const question = { ...base, type: "reflection", answer: null } satisfies Question;
    expect(validateAnswer(question, "My explanation")).toBeNull();
  });
});
