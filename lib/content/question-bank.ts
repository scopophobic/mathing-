import type { Question } from "./schema";

export const questions: Question[] = [
  {
    id: "conditional-tea-denominator", lessonId: "conditional-probability", contentVersion: 1, type: "choice",
    prompt: "Twelve of twenty people drink tea and five drink both tea and coffee. Given that a selected person drinks tea, which denominator belongs in the conditional probability?",
    choices: ["20", "12", "8", "5"], answer: "12",
    explanation: "The condition restricts the possible world to the twelve tea drinkers, so twelve is the denominator.",
    hints: ["Count only the people who remain possible after the condition is known."], misconceptionTag: "condition-does-not-change-sample-space",
  },
  {
    id: "conditional-die-even", lessonId: "conditional-probability", contentVersion: 1, type: "numeric",
    prompt: "A fair die result is known to be greater than 3. What is the probability that it is even?", answer: "2/3",
    explanation: "The remaining outcomes are 4, 5, and 6. Two of the three remaining outcomes are even.",
    hints: ["List the outcomes greater than three before counting even outcomes."], misconceptionTag: "uses-original-denominator",
  },
  {
    id: "conditional-symbolic", lessonId: "conditional-probability", contentVersion: 1, type: "expression",
    prompt: "Write P(A given B) using intersection and P(B).", answer: "P(A\\cap B)/P(B)",
    explanation: "Inside the world B, the favourable part is the intersection of A and B; division by P(B) rescales that world.",
    hints: ["The numerator must describe outcomes that are in both events."],
  },
  {
    id: "linear-system-order", lessonId: "systems-of-equations", contentVersion: 1, type: "ordering",
    prompt: "Order the operations for solving a two-equation linear system by elimination.",
    answer: ["align", "eliminate", "solve", "substitute", "check"],
    explanation: "Align like terms, eliminate one variable, solve the remaining equation, substitute back, then check both originals.",
    hints: ["Checking belongs after both variables have been found."],
  },
];

export function getPublicQuestion(question: Question) {
  const { answer: _answer, explanation: _explanation, ...publicQuestion } = question;
  return publicQuestion;
}

export function getQuestion(id: string) {
  return questions.find((question) => question.id === id);
}
