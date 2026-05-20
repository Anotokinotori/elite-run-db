---
name: elite-run-supabase-rls-security
description: Elite Run DB Supabase RLS security guardrails. Use when changing Supabase schema, migrations, RLS policies, Auth, server/client data access, or public record queries for Elite Run DB.
---

# Elite Run Supabase RLS Security

Use this with `supabase`, `supabase-postgres-best-practices`, and
`security-threat-model` when relevant.

## Checks

- Public reads must return only approved or published records.
- Unapproved submissions must not be reachable from public pages, search,
  record detail, recommendation, or compare data paths.
- Never expose `service_role` keys or privileged Supabase secrets to browser
  code, Vite env, logs, fixtures, screenshots, docs, or generated artifacts.
- Admin operations must rely on backend, RLS, or server-side authorization, not
  frontend checks alone.
- RLS policies must match the real access model for anonymous users,
  authenticated submitters, moderators, and service jobs.
- Check direct table access, RPCs, Storage, and Edge Functions for the same
  visibility rules before calling the change complete.
