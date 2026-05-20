---
name: elite-run-admin-moderation-security
description: Elite Run DB admin moderation security guardrails. Use when changing submission approval, rejection, unpublishing, admin review UI, moderator permissions, or audit logging.
---

# Elite Run Admin Moderation Security

Use this with `security-threat-model`, `supabase`, and
`elite-run-supabase-rls-security` when relevant.

## Checks

- Approval, rejection, and unpublishing should be auditable.
- Prefer status transitions over hard delete for submitted records.
- Preserve `actor`, `action`, `target`, `timestamp`, and `reason` for
  moderation decisions.
- Public pages and public data loaders must not fetch pending, rejected,
  private, or otherwise unapproved submissions.
- Admin authorization must be enforced by backend, RLS, or trusted server-side
  checks, not only by hidden frontend UI.
- Logs and audit trails should be useful for review without exposing secrets or
  unnecessary personal data.
