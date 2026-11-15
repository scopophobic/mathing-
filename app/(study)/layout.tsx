import { AppShell } from "@/components/app-shell";
import { requireLearner } from "@/lib/auth";

export default async function StudyLayout({ children }: { children: React.ReactNode }) {
  const learner = await requireLearner();
  return <AppShell learner={learner}>{children}</AppShell>;
}
