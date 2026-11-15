export default async function AccessPending({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return <main id="main" className="center-page"><div className="paper-panel"><span className="proof-mark">?</span><h1>Access is not open yet.</h1><p>{email ? `${email} is not on the private beta list.` : "This Google account is not on the private beta list."} Ask the owner to add it, then sign in again.</p><a className="secondary-button" href="/login">Back to sign in</a></div></main>;
}
