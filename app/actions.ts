"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, requireLearner } from "@/lib/auth";
import { curriculum } from "@/lib/content/curriculum";
import { getQuestion, questions } from "@/lib/content/questions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateAnswer } from "@/lib/learning/answers";

const attemptSchema = z.object({
  questionId: z.string(), contentVersion: z.number().int().positive(), answer: z.unknown(),
  confidence: z.enum(["low", "medium", "high"]), hintsUsed: z.number().int().min(0), elapsedSeconds: z.number().int().min(0),
});

export async function submitAttempt(input: unknown) {
  const learner = await requireLearner();
  const submission = attemptSchema.parse(input);
  const question = getQuestion(submission.questionId);
  if (!question || question.contentVersion !== submission.contentVersion) return { correct: false, explanation: "This question changed. Refresh the lesson before trying again." };
  const correct = validateAnswer(question, submission.answer);
  const supabase = await createSupabaseServerClient();
  if (supabase && learner.id !== "demo-learner") {
    const { data: attempt, error } = await supabase.from("attempts").insert({
      user_id: learner.id, question_id: question.id, content_version: question.contentVersion,
      submitted_answer: submission.answer, correct, confidence: submission.confidence,
      hints_used: submission.hintsUsed, elapsed_seconds: submission.elapsedSeconds,
    }).select("id").single();
    if (error) throw new Error("Your answer could not be saved.");
    if (!correct) await supabase.from("mistakes").insert({
      user_id: learner.id, attempt_id: attempt.id, category: question.misconceptionTag ?? "concept-gap",
      priority: submission.confidence === "high" ? "high" : "normal",
    });
    const due = new Date();
    due.setUTCDate(due.getUTCDate() + 1);
    await supabase.from("review_items").insert({ user_id: learner.id, lesson_id: question.lessonId, question_id: question.id, source: correct ? "practice" : "repair", due_at: due.toISOString(), interval_days: 1 });
  }
  revalidatePath("/memory");
  return { correct, explanation: question.explanation };
}

export async function saveOnboarding(formData: FormData) {
  const learner = await requireLearner();
  if (learner.id === "demo-learner") redirect("/today");
  const level = z.enum(["foundations", "refresher", "core"]).parse(formData.get("level"));
  const minutes = z.coerce.number().pipe(z.union([z.literal(15), z.literal(30), z.literal(45), z.literal(60)])).parse(formData.get("minutes"));
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("The database is not configured.");
  await admin.from("profiles").update({ starting_level: level, default_session_minutes: minutes, timezone: formData.get("timezone") || "UTC" }).eq("id", learner.id);
  await admin.from("enrollments").upsert({ user_id: learner.id, path_id: "mathematics-core", placement: { startingLevel: level, status: "not_assessed" } }, { onConflict: "user_id,path_id" });
  redirect("/diagnostic");
}

function betaReady() {
  return curriculum.every((lesson) => lesson.published) && questions.length >= 900;
}

export async function inviteLearner(formData: FormData) {
  const adminUser = await requireAdmin();
  if (!betaReady()) throw new Error("Invitations stay locked until the curriculum quality threshold is met.");
  const email = z.string().email().parse(formData.get("email")).trim().toLowerCase();
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("The database is not configured.");
  const { error } = await admin.from("beta_invites").upsert({ email, status: "active", invited_by: adminUser.id }, { onConflict: "email" });
  if (error) throw new Error("The invitation could not be saved.");
  revalidatePath("/admin/invites");
}

export async function revokeInvite(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().parse(formData.get("id"));
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  await admin.from("beta_invites").update({ status: "revoked", updated_at: new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin/invites");
}

export async function saveDoubt(formData: FormData) {
  const learner = await requireLearner();
  const input = z.object({ lessonId: z.string().min(1), body: z.string().trim().min(1).max(4000) }).parse({ lessonId: formData.get("lessonId"), body: formData.get("body") });
  if (learner.id === "demo-learner") return;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!.from("doubts").insert({ user_id: learner.id, lesson_id: input.lessonId, body: input.body });
  if (error) throw new Error("The doubt could not be saved.");
  revalidatePath("/memory");
}

export async function saveReflection(formData: FormData) {
  const learner = await requireLearner();
  const input = z.object({ lessonId: z.string(), explanation: z.string().trim().min(1).max(8000), clarity: z.enum(["foggy", "forming", "clear"]) }).parse({ lessonId: formData.get("lessonId"), explanation: formData.get("explanation"), clarity: formData.get("clarity") });
  if (learner.id === "demo-learner") return;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!.from("reflections").insert({ user_id: learner.id, lesson_id: input.lessonId, explanation: input.explanation, clarity: input.clarity });
  if (error) throw new Error("The reflection could not be saved.");
}

export async function completeLesson(formData: FormData) {
  const learner = await requireLearner();
  const lessonId = z.string().min(1).parse(formData.get("lessonId"));
  if (learner.id === "demo-learner") return;
  const supabase = await createSupabaseServerClient();
  await supabase!.from("lesson_progress").upsert({ user_id: learner.id, lesson_id: lessonId, state: "practicing", last_activity_at: new Date().toISOString() }, { onConflict: "user_id,lesson_id" });
  revalidatePath("/topics");
}

export async function resolveMistake(formData: FormData) {
  const learner = await requireLearner();
  const id = z.string().uuid().parse(formData.get("id"));
  if (learner.id === "demo-learner") return;
  const supabase = await createSupabaseServerClient();
  await supabase!.from("mistakes").update({ resolved_at: new Date().toISOString(), learner_note: String(formData.get("note") ?? "") }).eq("id", id).eq("user_id", learner.id);
  revalidatePath("/memory");
}

export async function completeSession(sessionId: string) {
  const learner = await requireLearner();
  if (learner.id === "demo-learner") return;
  const id = z.string().uuid().parse(sessionId);
  const supabase = await createSupabaseServerClient();
  await supabase!.from("study_sessions").update({ completed_at: new Date().toISOString(), current_step: "complete" }).eq("id", id).eq("user_id", learner.id);
}
