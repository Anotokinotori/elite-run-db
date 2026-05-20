---
name: elite-run-public-release-hardening
description: Elite Run DB public release hardening checklist. Use before public or preview deployment, release promotion, Vercel/Supabase env changes, or exposing real submission data.
---

# Elite Run Public Release Hardening

Use this with `security-threat-model`, `supabase`, and
`verification-before-completion` when relevant.

## Checks

- Check for secret exposure in repo files, generated docs, logs, screenshots,
  fixtures, and deployment config.
- Browser code may use only intentionally public `VITE_` values; never expose
  Supabase `service_role` keys or private credentials.
- Supabase RLS and public queries must prevent anonymous access to unapproved
  or private records.
- Preview and public deployment settings should match the current release
  intent, including robots/noindex behavior while the app remains a prototype.
- Error messages should not expose stack traces, SQL, tokens, internal IDs, or
  moderation-only data to public users.
- Run the smallest relevant verification commands before release, then expand
  to `npm run lint`, `npm run test`, `npm run typecheck`, and `npm run build`
  when release risk justifies it.
