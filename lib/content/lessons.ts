import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { lessonFrontmatterSchema, type LessonFrontmatter } from "./schema";

const lessonDirectory = path.join(process.cwd(), "content", "lessons");

export async function getLesson(id: string) {
  const safeId = id.replace(/[^a-z0-9-]/g, "");
  const source = await fs.readFile(path.join(lessonDirectory, `${safeId}.mdx`), "utf8");
  const parsed = matter(source);
  return { frontmatter: lessonFrontmatterSchema.parse(parsed.data), source: parsed.content };
}

export async function getPublishedLessons(): Promise<LessonFrontmatter[]> {
  const files = (await fs.readdir(lessonDirectory)).filter((file) => file.endsWith(".mdx"));
  const lessons = await Promise.all(files.map(async (file) => (await getLesson(file.slice(0, -4))).frontmatter));
  return lessons.filter((lesson) => lesson.published).toSorted((a, b) => a.order - b.order);
}
