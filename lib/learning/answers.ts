import { ComputeEngine } from "@cortex-js/compute-engine";
import type { Question } from "@/lib/content/schema";

const computeEngine = new ComputeEngine();

function parseNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return Number.NaN;
  const compact = value.trim().replace(/\s/g, "");
  const fraction = compact.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (fraction) return Number(fraction[1]) / Number(fraction[2]);
  return Number(compact);
}

export function validateAnswer(question: Question, submitted: unknown) {
  switch (question.type) {
    case "numeric": {
      const actual = parseNumber(submitted);
      const expected = parseNumber(question.answer);
      return Number.isFinite(actual) && Number.isFinite(expected) && Math.abs(actual - expected) < 1e-9;
    }
    case "choice":
      return submitted === question.answer;
    case "multi_select":
    case "ordering":
      return Array.isArray(submitted) && Array.isArray(question.answer) && JSON.stringify(submitted) === JSON.stringify(question.answer);
    case "expression": {
      if (typeof submitted !== "string" || typeof question.answer !== "string") return false;
      try {
        const difference = computeEngine.box([
          "Subtract",
          computeEngine.parse(submitted),
          computeEngine.parse(question.answer),
        ]).simplify();
        return difference.is(0);
      } catch {
        return false;
      }
    }
    case "reflection":
      return null;
  }
}
