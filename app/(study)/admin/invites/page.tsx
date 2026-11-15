import { inviteLearner, revokeInvite } from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import { curriculum } from "@/lib/content/curriculum";
import { questions } from "@/lib/content/questions";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function InvitePage() {
  await requireAdmin();
  const admin = createSupabaseAdminClient();
  const { data: invites } = admin ? await admin.from("beta_invites").select("id, email, status, created_at").order("created_at", { ascending: false }) : { data: [] };
  const published = curriculum.filter((lesson) => lesson.published).length; const ready = published >= 80 && questions.length >= 900;
  return <div className="page-stack"><header className="page-heading"><p className="plain-label">Private beta</p><h1>Access follows content quality.</h1><p>The invitation control unlocks only when every promised lesson and reviewed question passes the content checks.</p></header>
    <section className="quality-threshold"><div><strong>{published}/80</strong><span>reviewed lessons</span></div><div><strong>{questions.length}/900</strong><span>reviewed questions</span></div><p className={ready ? "threshold-open" : "threshold-locked"}>{ready ? "Quality threshold met" : "Quality threshold pending"}</p></section>
    <form action={inviteLearner} className="invite-form"><label><span>Google account email</span><input type="email" name="email" required disabled={!ready} placeholder="learner@example.com" /></label><button className="primary-button" disabled={!ready}>Add to beta</button></form>
    <section className="invite-list"><h2>Access list</h2>{invites?.length ? invites.map((invite) => <article key={invite.id}><div><strong>{invite.email}</strong><span>{invite.status}</span></div>{invite.status === "active" ? <form action={revokeInvite}><input type="hidden" name="id" value={invite.id} /><button className="quiet-button">Revoke</button></form> : null}</article>) : <div className="empty-state"><span>∅</span><p>No learner accounts have been invited.</p></div>}</section>
  </div>;
}
