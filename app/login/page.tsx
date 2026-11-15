import Link from "next/link";
import { hasSupabaseConfig, isDemoMode } from "@/lib/env";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const configured = hasSupabaseConfig();
  const demo = isDemoMode();
  return (
    <main id="main" className="entry-page">
      <section className="entry-copy">
        <Link className="wordmark-link" href="/">∴ Mathing</Link>
        <p className="entry-kicker">Read. Predict. Solve. Explain.</p>
        <h1>Mathematics gets clearer at the desk, not in the feed.</h1>
        <p>Short reading, deliberate practice, and reviews chosen from the evidence you leave behind.</p>
      </section>
      <section className="login-sheet" aria-labelledby="login-title">
        <span className="proof-mark">β</span>
        <h2 id="login-title">Private study room</h2>
        <p>Sign in with an invited Google account. Your work stays attached to your account and is never used for advertising.</p>
        {error ? <p className="error-note">Sign-in could not be completed. Check the setup and try again.</p> : null}
        {configured ? <a className="primary-button full-button" href="/auth/google">Continue with Google</a> : null}
        {demo ? <Link className="secondary-button full-button" href="/today">Open the local demo</Link> : null}
        {!configured && !demo ? <p className="setup-note">The owner still needs to connect authentication.</p> : null}
      </section>
    </main>
  );
}
