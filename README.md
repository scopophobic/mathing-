# Mathing

Mathing is a private, reading-first mathematics study desk for people with limited time. It turns available time and learning evidence into one explainable next session:

**Recall → read → predict → solve → explain → schedule**

The application is independent of any AI product. It does not require a language model or model API.

## What is implemented

- Next.js App Router and TypeScript
- Google sign-in through Supabase Auth
- Invite-only access and an owner-only invite screen
- Supabase PostgreSQL schema with row-level security
- 15, 30, 45, and 60 minute session plans
- Deterministic recommendations, review intervals, and mastery rules
- Server-only answer keys and structured grading policies
- Git-versioned MDX lessons with source and licence metadata
- KaTeX mathematics rendering
- Starting-level onboarding and a skippable diagnostic
- Topic map, guided practice desk, review queue, mistakes, and doubts
- An enforced beta quality threshold

The curriculum map contains 110 micro-lessons. One complete lesson and four reviewed questions are currently published. Beta invitations remain locked until every mapped lesson and at least 900 reviewed questions pass validation.

## Run locally

```sh
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_DEMO_MODE=true` only for local interface work. Do not set it in Vercel.

```sh
npm run typecheck
npm test
npm run content:validate
npm run build
```

## Configure the independent service

1. Create a Supabase project.
2. Apply `supabase/migrations/202611150001_initial.sql`.
3. In Google Cloud, create a web OAuth client and add Supabase’s callback URL.
4. Enable Google in Supabase Authentication using that client ID and secret.
5. Add the application URL and `/auth/callback` to Supabase’s allowed redirects.
6. Create a Vercel project from this repository and add the variables in `.env.example`.
7. Put the owner’s normalized Google email in `BOOTSTRAP_ADMIN_EMAILS`.
8. Deploy a preview, test owner sign-in, and verify data isolation before promoting `main`.

Secrets belong in Supabase and Vercel settings, never in this repository.

## Repository guide

- `app/` — routes, server actions, and interface
- `components/` — interactive study surfaces
- `content/lessons/` — reviewed MDX learning notes
- `lib/content/` — schemas, curriculum map, and server-only questions
- `lib/learning/` — session, review, mastery, and answer logic
- `supabase/migrations/` — database and security policies
- `docs/` — product, system, content, and release guidance
- `dist/` and `.openai/` — previous prototype, retained only until independent production cutover

## Safe cutover

Keep the previous hosted prototype online until Google sign-in and an invited account both pass on the Vercel production build. Then remove `dist/` and `.openai/hosting.json`, archive the old deployment, and commit the cleanup separately.

The focused mathematics scope and question-building priorities are documented in `docs/MATHEMATICS_SCOPE_RESEARCH.md`.
