"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { submitAttempt } from "@/app/actions";
import { SESSION_ALLOCATIONS } from "@/lib/learning/engine";

type Budget = keyof typeof SESSION_ALLOCATIONS;
type PublicQuestion = { id: string; contentVersion: number; prompt: string; type: string; choices?: string[]; hints: string[] };

export function StudyDesk({ questions, initialReason }: { questions: PublicQuestion[]; initialReason: string }) {
  const [budget, setBudget] = useState<Budget>(30);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [confidence, setConfidence] = useState<"low" | "medium" | "high">("medium");
  const [hintShown, setHintShown] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean | null; explanation: string } | null>(null);
  const [pending, setPending] = useState(false);
  const startedAt = useRef(Date.now());
  const allocation = SESSION_ALLOCATIONS[budget];
  const question = questions[questionIndex];
  const segments = useMemo(() => Object.entries(allocation), [allocation]);

  async function checkAnswer() {
    if (!answer.trim() || pending) return;
    setPending(true);
    const result = await submitAttempt({
      questionId: question.id, contentVersion: question.contentVersion, answer,
      confidence, hintsUsed: hintShown ? 1 : 0, elapsedSeconds: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)),
    });
    setFeedback(result);
    setPending(false);
  }

  function nextQuestion() {
    setQuestionIndex((current) => (current + 1) % questions.length);
    setAnswer(""); setFeedback(null); setHintShown(false); startedAt.current = Date.now();
  }

  return <>
    <section className="session-heading">
      <div><p className="date-line">Your next useful hour starts smaller than an hour.</p><h1>Make one idea clearer.</h1><p>Choose the time you actually have. The work will fit inside it.</p></div>
      <fieldset className="budget-picker"><legend>I have</legend>{([15, 30, 45, 60] as Budget[]).map((value) => <button className={budget === value ? "selected" : ""} onClick={() => setBudget(value)} type="button" key={value}>{value} min</button>)}</fieldset>
    </section>
    <section className="recommendation">
      <div className="proof-margin"><span>Because</span><p>{initialReason}</p></div>
      <div className="recommendation-main"><p className="plain-label">Suggested next</p><h2>Conditional probability</h2><p>Learn to change the possible world when new information arrives.</p><div className="allocation" aria-label="Session allocation">{segments.map(([name, minutes]) => <span style={{ flex: minutes }} key={name}>{name} {minutes}</span>)}</div><Link className="primary-button" href="/lesson/conditional-probability">Read the lesson</Link></div>
    </section>
    <section className="practice-sheet">
      <div className="sheet-index"><span>Practice</span><strong>{questionIndex + 1}/{questions.length}</strong></div>
      <div className="practice-copy"><h2>Test the smaller world</h2><p className="problem">{question.prompt}</p>
        {question.choices ? <fieldset className="choice-list"><legend>Your answer</legend>{question.choices.map((choice) => <label key={choice}><input type="radio" name="answer" value={choice} checked={answer === choice} onChange={(event) => setAnswer(event.target.value)} /><span>{choice}</span></label>)}</fieldset> : <label className="answer-field"><span>Your answer</span><input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="e.g. 2/3" /></label>}
        <fieldset className="confidence"><legend>How sure are you?</legend>{(["low", "medium", "high"] as const).map((value) => <label key={value}><input type="radio" checked={confidence === value} onChange={() => setConfidence(value)} /><span>{value === "low" ? "Not sure" : value === "medium" ? "Fairly sure" : "Very sure"}</span></label>)}</fieldset>
        {hintShown ? <p className="hint"><strong>One hint:</strong> {question.hints[0]}</p> : null}
        {feedback ? <div className={`feedback ${feedback.correct ? "correct" : "wrong"}`} role="status"><strong>{feedback.correct ? "That holds." : "Not yet."}</strong><p>{feedback.explanation}</p></div> : null}
        <div className="button-row">{!feedback ? <><button className="quiet-button" type="button" onClick={() => setHintShown(true)}>Give me one hint</button><button className="primary-button" type="button" disabled={!answer.trim() || pending} onClick={checkAnswer}>{pending ? "Checking…" : "Check answer"}</button></> : <button className="primary-button" type="button" onClick={nextQuestion}>Try a fresh question</button>}</div>
      </div>
    </section>
  </>;
}
