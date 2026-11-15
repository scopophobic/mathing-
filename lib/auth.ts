import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentLearner() {
  if (isDemoMode()) return { id: "demo-learner", email: "demo@mathing.local", name: "Demo learner", role: "admin" as const };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const { data: profile } = await supabase.from("profiles").select("display_name, role").eq("id", user.id).maybeSingle();
  return {
    id: user.id,
    email: user.email,
    name: profile?.display_name || user.user_metadata.full_name || user.email.split("@")[0],
    role: (profile?.role ?? "learner") as "learner" | "admin",
  };
}

export async function requireLearner() {
  const learner = await getCurrentLearner();
  if (!learner) redirect("/login");
  return learner;
}

export async function requireAdmin() {
  const learner = await requireLearner();
  if (learner.role !== "admin") redirect("/today");
  return learner;
}
