# Content guide

## A complete micro-lesson

Every lesson must include:

- one clear outcome and explicit prerequisites
- a plain-language mental model
- two fully worked examples
- one faded example with learner-supplied steps
- one prediction before calculation
- direct, mixed, transfer, and delayed-review questions
- authored feedback tied to plausible misconceptions
- source, licence, stable ID, and content version

The note should be readable in 4–12 minutes. It should explain why a method works before asking the learner to repeat it.

## Question review

Every question is recalculated independently. Distractors correspond to named reasoning errors rather than random values. Expression questions need equivalent and non-equivalent tests. A hint teaches the next move without revealing the answer. A solution names both the correct reasoning and the tempting wrong turn.

Questions adapted from open sources retain visible attribution and comply with the source licence. Proprietary questions and copied explanations are not allowed.

## Publishing

Set `published: true` only after the lesson and all required practice have passed review. Run `npm run content:validate` before committing. The release pipeline should set `BETA_READY=true`; that check intentionally fails until the complete curriculum threshold is met.
