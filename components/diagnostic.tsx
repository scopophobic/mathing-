"use client";

import { useState } from "react";

const items = [
  { area: "Algebra", prompt: "Solve 3x + 5 = 20", answer: "5" },
  { area: "Functions", prompt: "If f(x) = x² − 1, find f(3)", answer: "8" },
  { area: "Probability", prompt: "A fair coin is tossed twice. Find P(exactly one head)", answer: "1/2" },
  { area: "Linear algebra", prompt: "What is the dot product of (1, 2) and (3, 4)?", answer: "11" },
  { area: "Calculus", prompt: "Differentiate x³", answer: "3x^2" },
];

export function Diagnostic() {
  const [index, setIndex] = useState(0); const [answers, setAnswers] = useState<Record<number, string>>({}); const [done, setDone] = useState(false);
  const item = items[index];
  if (done) {
    const assessed = Object.values(answers).filter((value) => value !== "skipped").length;
    return <section className="diagnostic-card"><span className="proof-mark">✓</span><h2>Your bridge starts with algebra and functions.</h2><p>{assessed} of {items.length} areas assessed. {items.length - assessed} remain unassessed.</p><p>This starter diagnostic recommends foundations first, then an early probability bridge. You can override it at any time.</p><a className="primary-button" href="/today">Use this starting point</a></section>;
  }
  function move(value: string) { setAnswers((current) => ({ ...current, [index]: value })); if (index === items.length - 1) setDone(true); else setIndex(index + 1); }
  return <section className="diagnostic-card"><div className="diagnostic-progress"><span>{item.area}</span><span>{index + 1} of {items.length}</span></div><h2>{item.prompt}</h2><label className="answer-field"><span>Your answer</span><input autoFocus value={answers[index] === "skipped" ? "" : answers[index] ?? ""} onChange={(event) => setAnswers({ ...answers, [index]: event.target.value })} /></label><div className="button-row"><button className="quiet-button" onClick={() => move("skipped")} type="button">Skip for now</button><button className="primary-button" disabled={!answers[index]} onClick={() => move(answers[index])} type="button">Save and continue</button></div></section>;
}
