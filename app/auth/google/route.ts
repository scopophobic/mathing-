import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.redirect(new URL("/login?error=setup", request.url));
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${appUrl}/auth/callback`, queryParams: { access_type: "offline", prompt: "consent" } },
  });
  return NextResponse.redirect(error || !data.url ? new URL("/login?error=oauth", request.url) : data.url);
}
