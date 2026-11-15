import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { curriculum } from "../lib/content/curriculum";
import { lessonFrontmatterSchema, questionSchema } from "../lib/content/schema";
import { questions } from "../lib/content/question-bank";

const lessonDirectory = path.join(process.cwd(), "content", "lessons");
const ids = new Set<string>();
for (const file of fs.readdirSync(lessonDirectory).filter((name) => name.endsWith(".mdx"))) {
  const { data } = matter(fs.readFileSync(path.join(lessonDirectory, file), "utf8"));
  const lesson = lessonFrontmatterSchema.parse(data);
  if (ids.has(lesson.id)) throw new Error(`Duplicate lesson id: ${lesson.id}`);
  ids.add(lesson.id);
}
questions.forEach((question) => questionSchema.parse(question));
for (const question of questions) if (!curriculum.some((lesson) => lesson.id === question.lessonId)) throw new Error(`Unknown lesson for ${question.id}`);
for (const lesson of curriculum) for (const prerequisite of lesson.prerequisites) if (!curriculum.some((candidate) => candidate.id === prerequisite)) throw new Error(`Unknown prerequisite ${prerequisite}`);

const published = curriculum.filter((lesson) => lesson.published).length;
console.log(`Content valid: ${curriculum.length} mapped lessons, ${published} published lessons, ${questions.length} reviewed questions.`);
if (process.env.BETA_READY === "true" && (published < 80 || questions.length < 900)) {
  throw new Error("Private beta cannot open until at least 80 lessons and 900 reviewed questions pass validation.");
}
