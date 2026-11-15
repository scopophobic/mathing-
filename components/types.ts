import type { getCurrentLearner } from "@/lib/auth";
export type AwaitedLearner = NonNullable<Awaited<ReturnType<typeof getCurrentLearner>>>;
