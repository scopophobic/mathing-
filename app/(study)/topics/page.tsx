import Link from "next/link";
import { curriculumPaths } from "@/lib/content/curriculum";

export default function TopicsPage() {
  return <div className="page-stack">
    <header className="page-heading"><p className="plain-label">The whole path</p><h1>Ideas are easier when you can see what they rest on.</h1><p>Eighty-five small lessons, ordered by dependency. Only reviewed lessons can be opened.</p></header>
    <div className="path-list">{curriculumPaths.map((path) => <section className="path" key={path.id}>
      <div className="path-heading"><h2>{path.title}</h2><span>{path.lessons.length} ideas</span></div>
      <ol>{path.lessons.map((lesson) => <li className={lesson.published ? "available" : "planned"} key={lesson.id}>
        <span className="topic-number">{String(lesson.order).padStart(2, "0")}</span><div><strong>{lesson.title}</strong><p>{lesson.summary}</p></div>
        {lesson.published ? <Link href={`/lesson/${lesson.id}`}>Open</Link> : <span className="status">In review</span>}
      </li>)}</ol>
    </section>)}</div>
  </div>;
}
