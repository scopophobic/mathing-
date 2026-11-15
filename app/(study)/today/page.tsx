import { StudyDesk } from "@/components/study-desk";
import { getPublicQuestion, questions } from "@/lib/content/questions";
import { getTodayPlan } from "@/lib/learning/today";

export default async function TodayPage() {
  const plan = await getTodayPlan();
  return <StudyDesk initialReason={plan.reason} questions={questions.filter((question) => question.lessonId === "conditional-probability" && question.type !== "expression").map(getPublicQuestion)} />;
}
