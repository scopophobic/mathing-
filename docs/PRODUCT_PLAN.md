# Product plan

Working title: **Mathing**.

## Product idea

Mathing is a personal training desk for mathematics. On opening it, the learner selects a time budget—60, 90, or 120 minutes—and receives one achievable session with a clear reason. A recommendation might say:

> You confused independent and mutually exclusive events twice. Repair that idea before continuing conditional probability.

The learner can accept the session, swap it, or pin another priority. Each session follows a learning loop:

**Recall → understand → solve → explain the mistake → revisit with a fresh question.**

Initial recommendations will use visible rules rather than an opaque score.

## Innovative features

### 1. Mistake replay

A wrong answer becomes a repair card containing the original attempt, error category, corrected reasoning, and a later fresh problem. Retrying the identical problem is recorded separately from applying the idea to a new one.

### 2. Confidence calibration

Before checking an answer, the learner records low, medium, or high confidence. A confidently wrong answer receives extra attention. An answer reached with hints is useful learning evidence but does not count as independent mastery.

### 3. Maths microscope

Focused interactive explorations make abstract ideas tangible: transform vectors with a matrix, shade probability regions, move a point along a curve to observe slope, or compare a distribution with its cumulative probability. Each exploration ends with a prediction and a hand-solved question.

### 4. Foundation bridge

When a topic becomes difficult, the app identifies the smallest supporting skill: rearranging equations, reading function notation, sketching a graph, manipulating exponents, or explaining a definition. The bridge is short and returns the learner to the original topic.

### 5. Explain-it-back checks

The learner occasionally explains a concept in plain language or writes why a method applies. This prevents correct guesses and memorized procedures from being mistaken for understanding.

## Main views

| View | Purpose |
| --- | --- |
| Today | Suggested session, reason, selected time budget, reviews due, and start/swap/pin controls. |
| Topic map | Topics, supporting foundations, prerequisites, priority, and evidence of progress. |
| Practice desk | Problem, scratch notes, staged hints, confidence, solution, explanation, and attempt history. |
| Diagnostic | Short saveable baseline assessment with skipped and not-assessed states. |
| Revision queue | Due recall exercises and mistake repairs with rescheduling and completion history. |
| Mistakes and doubts | Searchable notes linked to topics, attempts, status, and future checks. |
| Plan | Editable weekday capacity, priorities, study dates, milestones, and overload warnings. |

## Daily session design

| Available time | Recall/review | Learn | Solve | Record and plan |
| --- | ---: | ---: | ---: | ---: |
| 60 minutes | 10 | 15 | 25 | 10 |
| 90 minutes | 15 | 20 | 40 | 15 |
| 120 minutes | 15 | 30 | 55 | 20 |

The first target is 4–8 carefully reviewed questions per session. Difficult problems may reduce that number. The system will never silently move all missed work onto the next day.

## Progress model

Topic states:

- Not started
- Learning
- Practicing
- Ready for review
- Retained

The app will display attempts, first-attempt accuracy, hints used, confidence, time spent, last practice, and next review separately. “Not assessed” must never appear as zero ability.

A proposed retained rule for discussion is:

- At least eight independent attempts across two or more sessions
- At least 80% accuracy on the most recent relevant set
- One successful delayed check

These are adjustable product defaults.

## Recommendation rules

The first recommendation engine will choose from this queue:

1. Reviews and mistake repairs that are due
2. Foundation gaps blocking the chosen topic
3. Topics manually pinned by the learner
4. The next ready topic in the learning path

Every recommendation includes its reason and can be overridden. Reviews are limited by the current time budget; overflow remains visible and moves to a later available weekday.

## Revision rules

Initial review intervals are 1, 3, 7, 14, and 30 days after a successful learning session. This is a starting heuristic. A failed review schedules repair and a new check; it does not erase the attempt history. Repeated misses trigger a prerequisite check.

Mistake categories:

- Concept gap
- Wrong method
- Algebra or arithmetic
- Misread question
- Time pressure
- Guess

Each mistake stores the topic, source problem, attempted reasoning, correction, next action, status, and review date. Doubts have open, investigating, and resolved states. Closing a doubt does not automatically mark a topic retained.

## Technical direction for the first build

Start with a small browser-local application using HTML, CSS, and JavaScript. Store the curriculum and original starter questions as versioned data. Store personal progress locally with JSON export/import and backup reminders.

Core records:

- Topic and prerequisite
- Question and question version
- Attempt
- Study session
- Review item
- Mistake or doubt
- User preferences
- Plan milestone

Attempt history is the source of learning evidence; progress is derived from it. Personal study data must not enter the Git repository.

## Build milestones

### Milestone 1 — usable planner

Topic catalogue, Today view, editable starter plan, session log, manual practice log, mistakes/doubts, and export/import.

### Milestone 2 — guided practice

Reviewed starter question set, saveable diagnostic, worked explanations, evidence-based progress, and recommendation rules.

### Milestone 3 — retention

Revision scheduling, repair queue, capacity-aware replanning, and mixed checkpoints.

### Milestone 4 — deeper learning

Maths visualizations, richer learning notes, and optional cross-device synchronization if personal use demonstrates the need.

## Acceptance checks for milestone 1

- Every learning topic belongs to the curriculum or is clearly marked as foundation support.
- A 60, 90, or 120 minute choice produces a session within that budget.
- A completed session and logged attempt survive a page reload.
- A wrong attempt can create a linked mistake and scheduled repair.
- Completing a lesson does not automatically mark a topic retained.
- Moving a study day preserves history and exposes any future overload.
- Pinning a topic changes the next recommendation with an understandable reason.
- Export/import restores records; invalid input cannot overwrite existing progress.
- Core flows work on mobile and with a keyboard.
- Mathematical expressions remain readable at common screen sizes.

## Decisions to discuss before implementation

- Current comfort with algebra, functions, probability, matrices, and derivatives
- Preferred learning resources and whether the app should link to them
- Preferred start date and default weekday duration
- Whether the first version needs to work across multiple devices
- Whether handwritten practice will be logged manually or with optional photo attachments later
