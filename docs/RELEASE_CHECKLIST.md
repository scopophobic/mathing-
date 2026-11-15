# Release checklist

## Infrastructure

- Supabase migration applied to a non-production project first
- Google OAuth client configured with the exact Supabase callback URL
- Supabase allowed redirects include Vercel preview and production callbacks
- Vercel variables added without demo mode
- bootstrap admin email normalized and verified
- service-role key never exposed to browser bundles or logs

## Acceptance

- owner Google sign-in succeeds
- uninvited Google account reaches access-pending and has no session
- invited learner can sign in after the content threshold is met
- learner A cannot read or alter learner B’s records
- non-admin cannot list or change invitations
- session allocation totals exactly match all four budgets
- answer keys are absent from browser source and network payloads
- recommendation priority is explainable
- desktop and mobile keyboard flows work
- content validation and production build pass

## Cutover

- promote the verified commit to Vercel production
- test owner and one invited learner again in production
- preserve any old prototype data that matters
- take the previous deployment offline
- remove `dist/` and `.openai/hosting.json`
- commit and push the cleanup
