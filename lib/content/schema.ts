import { z } from "zod";

export const lessonFrontmatterSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(3),
  summary: z.string().min(20),
  path: z.enum(["foundations", "probability", "linear-algebra", "calculus"]),
  order: z.number().int().positive(),
  prerequisites: z.array(z.string()),
  estimatedMinutes: z.number().int().min(4).max(30),
  outcomes: z.array(z.string()).min(1),
  contentVersion: z.number().int().positive(),
  sources: z.array(z.object({ title: z.string(), url: z.string().url(), licence: z.string() })).min(1),
  misconceptionTags: z.array(z.string()),
  published: z.boolean(),
});

export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>;

export const questionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  lessonId: z.string(),
  contentVersion: z.number().int().positive(),
  type: z.enum(["numeric", "choice", "multi_select", "expression", "ordering", "reflection"]),
  prompt: z.string().min(10),
  answer: z.unknown(),
  explanation: z.string().min(20),
  hints: z.array(z.string()),
  misconceptionTag: z.string().optional(),
  choices: z.array(z.string()).optional(),
});

export type Question = z.infer<typeof questionSchema>;
