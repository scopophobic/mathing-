# System design

## Boundaries

The browser renders the learning interface and sends attempts through authenticated server actions. It never receives answer keys. Next.js reads versioned curriculum content from Git and learner activity from Supabase. Supabase delegates identity to Google and keeps every learner’s records isolated with row-level security.

```text
Learner browser
  └─ Next.js on Vercel
      ├─ Git-versioned MDX and question bank
      ├─ deterministic learning engine
      └─ Supabase
          ├─ Google authentication
          └─ PostgreSQL learner records
```

No LLM or model API is part of the request path. Recommendations are ordered rules with a human-readable reason.

## Trust boundaries

- Google secrets are entered only in Supabase.
- The service-role key exists only in Vercel server variables.
- Public Supabase credentials may reach the browser; row-level security is the data boundary.
- Answer keys stay behind `server-only` modules and server actions.
- Admin invitation operations re-check the authenticated profile role on the server.
- Demo mode is opt-in and must be absent from production.

## Learning records

Attempts are immutable evidence. Topic progress and recommendations are derived from attempts, review items, and unresolved gaps. Hinted answers are stored but excluded from independent mastery. Written explanations are self-reviewed and never reported as machine-verified correctness.

Review success advances through 1, 3, 7, 14, 30, and 60 day intervals. Failure creates repair work for the next day without erasing prior evidence.

## Request paths

### Sign in

1. `/auth/google` starts Supabase Google OAuth.
2. `/auth/callback` exchanges the code for a secure cookie session.
3. A server-only lookup checks the normalized email against active invitations or bootstrap admins.
4. Uninvited sessions are signed out and sent to `/access-pending`.

### Submit an attempt

1. The client sends question ID, content version, answer, confidence, hints, and duration.
2. A server action authenticates the learner and loads the server-only answer definition.
3. The appropriate deterministic validator grades structured work.
4. The attempt is stored; incorrect attempts create a mistake and every attempt schedules review.
5. Only correctness and the authored explanation return to the browser.

## Deployment

Vercel preview deployments are the acceptance environment. `main` is production only after OAuth, invite gating, row-level isolation, responsive flows, and content validation pass. Supabase and Vercel logs must not print submitted answers, doubts, or reflections.
