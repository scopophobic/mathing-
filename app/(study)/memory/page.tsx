import { requireLearner } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveMistake } from "@/app/actions";

export default async function MemoryPage() {
  const learner = await requireLearner();
  const supabase = await createSupabaseServerClient();
  const [{ data: mistakes }, { data: reviews }, { data: doubts }] = supabase && learner.id !== "demo-learner" ? await Promise.all([
    supabase.from("mistakes").select("id, category, priority, learner_note, created_at").is("resolved_at", null).order("created_at", { ascending: false }),
    supabase.from("review_items").select("id, lesson_id, source, due_at").is("completed_at", null).order("due_at"),
    supabase.from("doubts").select("id, lesson_id, body, status").neq("status", "resolved").order("created_at", { ascending: false }),
  ]) : [{ data: [] }, { data: [] }, { data: [] }];
  return <div className="page-stack"><header className="page-heading"><p className="plain-label">Your mathematical memory</p><h1>Keep the useful friction.</h1><p>Wrong turns, unanswered questions, and due reviews return here as future work—not as a score.</p></header>
    <div className="memory-grid"><section><h2>Due reviews <span>{reviews?.length ?? 0}</span></h2>{reviews?.length ? reviews.map((item) => <article key={item.id}><strong>{item.lesson_id.replaceAll("-", " ")}</strong><p>{item.source === "repair" ? "Repair a recent mistake" : "Fresh delayed recall"}</p></article>) : <Empty text="No reviews are due yet. Complete practice to schedule the first one." />}</section>
    <section><h2>Mistakes to repair <span>{mistakes?.length ?? 0}</span></h2>{mistakes?.length ? mistakes.map((item) => <article key={item.id}><strong>{item.category.replaceAll("-", " ")}</strong><p>{item.priority === "high" ? "Confident error — return soon." : "A useful turn to inspect."}</p><form action={resolveMistake}><input type="hidden" name="id" value={item.id} /><input name="note" aria-label="Repair note" placeholder="What will you do differently?" /><button className="quiet-button">Mark repaired</button></form></article>) : <Empty text="Incorrect attempts will appear here with their likely misconception." />}</section>
    <section><h2>Open doubts <span>{doubts?.length ?? 0}</span></h2>{doubts?.length ? doubts.map((item) => <article key={item.id}><strong>{item.lesson_id.replaceAll("-", " ")}</strong><p>{item.body}</p></article>) : <Empty text="Mark an unclear idea during a lesson to keep it visible." />}</section></div>
  </div>;
}

function Empty({ text }: { text: string }) { return <div className="empty-state"><span>∅</span><p>{text}</p></div>; }
