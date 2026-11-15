import { NextResponse } from "next/server";
import { normalizedAdminEmails } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const supabase = await createSupabaseServerClient();
  if (!code || !supabase) return NextResponse.redirect(new URL("/login?error=callback", url));
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  const email = data.user?.email?.trim().toLowerCase();
  if (error || !data.user || !email) return NextResponse.redirect(new URL("/login?error=callback", url));

  const isAdmin = normalizedAdminEmails().has(email);
  const admin = createSupabaseAdminClient();
  if (!admin) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/login?error=setup", url));
  }
  const { data: invite } = await admin.from("beta_invites").select("status").eq("email", email).eq("status", "active").maybeSingle();
  if (!isAdmin && !invite) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL(`/access-pending?email=${encodeURIComponent(email)}`, url));
  }

  await admin.from("profiles").upsert({
    id: data.user.id,
    email,
    display_name: data.user.user_metadata.full_name ?? email.split("@")[0],
    role: isAdmin ? "admin" : "learner",
  });
  return NextResponse.redirect(new URL("/onboarding", url));
}
