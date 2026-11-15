import "server-only";
import { requireLearner } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildSessionPlan } from "./engine";
import type { RecommendationCandidate, SessionPlan } from "./types";

export async function getTodayPlan(budgetMinutes: SessionPlan["budgetMinutes"] = 30) {
  const learner = await requireLearner();
  const candidates: RecommendationCandidate[] = [];
  const supabase = await createSupabaseServerClient();
  if (supabase && learner.id !== "demo-learner") {
    const now = new Date().toISOString();
    const [{ data: reviews }, { data: mistakes }] = await Promise.all([
      supabase.from("review_items").select("id, lesson_id, source").lte("due_at", now).is("completed_at", null).limit(8),
      supabase.from("mistakes").select("id, category, priority").is("resolved_at", null).limit(8),
    ]);
    reviews?.forEach((item) => candidates.push({ id: item.id, kind: "review", minutes: 4, reason: `A ${item.lesson_id.replaceAll("-", " ")} review is due today.` }));
    mistakes?.forEach((item) => candidates.push({ id: item.id, kind: item.priority === "high" ? "confident_error" : "mistake", minutes: 5, reason: `Repair the ${item.category.replaceAll("-", " ")} turn before moving on.`, priority: item.priority === "high" ? 2 : 1 }));
  }
  candidates.push({ id: "conditional-probability", kind: "lesson", minutes: 12, reason: "This idea unlocks later probability reasoning and exposes denominator mistakes." });
  candidates.push({ id: "conditional-die-even", kind: "interleave", minutes: 4, reason: "Apply the idea in a fresh setting." });
  return buildSessionPlan(budgetMinutes, candidates);
}
