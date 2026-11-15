import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { completeLesson, saveDoubt, saveReflection } from "@/app/actions";
import { getLesson } from "@/lib/content/lessons";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const lesson = await getLesson(id);
    return <div className="lesson-layout">
      <aside className="lesson-margin"><span>{lesson.frontmatter.estimatedMinutes} min read</span><h2>After this note</h2><ul>{lesson.frontmatter.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul><p>Version {lesson.frontmatter.contentVersion}</p></aside>
      <article className="lesson-paper"><MDXRemote source={lesson.source} options={{ mdxOptions: { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] } }} />
        <section className="lesson-response"><h2>Leave evidence for your future self</h2><form action={saveReflection}><input type="hidden" name="lessonId" value={id} /><label className="answer-field"><span>Explain the idea without copying the formula</span><textarea name="explanation" rows={4} required /></label><div className="radio-row">{["foggy", "forming", "clear"].map((clarity) => <label key={clarity}><input type="radio" name="clarity" value={clarity} defaultChecked={clarity === "forming"} /><span>{clarity}</span></label>)}</div><button className="primary-button">Save reflection</button></form><form action={saveDoubt}><input type="hidden" name="lessonId" value={id} /><label className="answer-field"><span>What remains unclear?</span><textarea name="body" rows={3} required /></label><button className="secondary-button">Save as a doubt</button></form><form action={completeLesson}><input type="hidden" name="lessonId" value={id} /><button className="primary-button">Mark reading complete</button></form></section>
        <footer className="source-note"><strong>Source trail</strong>{lesson.frontmatter.sources.map((source) => <p key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> · {source.licence}. Explanations and examples are original.</p>)}</footer>
      </article>
    </div>;
  } catch { notFound(); }
}
