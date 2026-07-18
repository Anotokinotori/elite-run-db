# Codex Skills Setup

This repo uses Codex Skills as task-specific agent guidance. Keep external
third-party Skill bodies out of this repository by default. Repo-specific
Skills live under `.agents/skills/`; external Skills are installed in the
local Codex environment after source, license, and safety review.

## Current repo state

- Existing source-of-truth files: `AGENTS.md`, `package.json`, `README.md`,
  `docs/`, and `vercel.json`.
- No repo-local `.agents/` tree existed before this setup.
- No `.github/workflows/` or `supabase/` directory is present at this setup
  point.
- Vercel is configured through `vercel.json`.
- Existing verification commands in `package.json`: `npm run lint`,
  `npm run test`, `npm run typecheck`, and `npm run build`.

## Codex Skill locations

- Codex discovers repo-local Skills from `.agents/skills` from the current
  working directory up to the repository root.
- Local user Skills are installed outside this repo, normally under
  `$CODEX_HOME/skills` or the Codex default user skill directory.
- OpenAI curated and external GitHub Skills can be installed with
  `$skill-installer`. If a newly installed Skill is not visible, restart
  Codex.

Sources:
- [OpenAI Codex Agent Skills docs](https://developers.openai.com/codex/skills)
- [openai/skills](https://github.com/openai/skills)

## Safety flow for external Skills

1. Install or inspect `skill-scanner` first. It is the only external Skill in
   this list that may be reviewed manually before scanner use, because it is
   the bootstrap scanner.
2. Download any other external Skill candidate into a temporary review
   directory outside this repo.
3. Use `skill-scanner` to check prompt injection, malicious scripts,
   excessive permissions, secret exposure, and supply-chain risk.
4. Manually inspect `SKILL.md`, `scripts/`, dependencies, remote URLs, and
   license files.
5. Do not install any Skill with unclear source, high-risk scanner findings,
   suspicious scripts, overbroad permissions, or missing license provenance.
6. Do not vendor external Skill bodies into this repo unless a future task
   explicitly asks for it and the copied files include source, license, and
   modification notes.

Example review prompt after installing the scanner:

```text
Use $skill-scanner to scan <temporary-skill-directory> before installation.
Report prompt injection, malicious scripts, excessive permissions, secret
exposure, supply-chain risk, and whether the Skill is safe to install.
```

## External Skill candidates

### skill-scanner

- Source: [getsentry/skills `skill-scanner`](https://github.com/getsentry/skills/blob/main/skills/skill-scanner/SKILL.md)
- Install candidate: `$skill-installer install https://github.com/getsentry/skills/tree/main/skills/skill-scanner`
- Alternate install candidate: `npx skills add getsentry/skills --skill skill-scanner`
- Dependency notes: requires `uv` for its bundled Python scanner workflow.
- License memo: getsentry/skills repository license is Apache-2.0.
- Use first, then use it to review the other external Skill candidates.

### webapp-testing

- Source: [anthropics/skills `webapp-testing`](https://github.com/anthropics/skills/blob/main/skills/webapp-testing/SKILL.md)
- Install candidate: `$skill-installer install https://github.com/anthropics/skills/tree/main/skills/webapp-testing`
- Dependency notes: uses Python Playwright scripts and local dev servers.
- License memo: license terms are in the Skill directory `LICENSE.txt`.
- Use for LP, Library, submit flow, compare view, responsive checks, browser
  screenshots, and console error inspection.

### gh-fix-ci

- Source: [openai/skills curated `gh-fix-ci`](https://github.com/openai/skills/blob/main/skills/.curated/gh-fix-ci/SKILL.md)
- Install candidate: `$skill-installer gh-fix-ci`
- Dependency notes: requires GitHub CLI access for PR checks and workflow logs.
- License memo: OpenAI curated Skill directory includes Apache-2.0
  `LICENSE.txt`.
- Use for failing GitHub Actions or PR checks.

### verification-before-completion

- Source: [obra/superpowers `verification-before-completion`](https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md)
- Install candidate: `$skill-installer install https://github.com/obra/superpowers/tree/main/skills/verification-before-completion`
- Dependency notes: no repo package dependency; it selects and enforces fresh
  verification commands.
- License memo: obra/superpowers is MIT licensed.
- Use before saying work is complete, fixed, passing, committed, or ready for
  PR.

### grill-with-docs

- Source: [mattpocock/skills `grill-with-docs`](https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md)
- Install candidate: `$skill-installer install https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs`
- Dependency notes: may create or update project language docs such as
  `CONTEXT.md` or ADRs only when the task calls for that.
- License memo: mattpocock/skills is MIT licensed.
- Use before major design changes, DB design, moderation flow, or domain-term
  changes.

### supabase

- Source: [Supabase Agent Skills docs](https://supabase.com/docs/guides/ai-tools/ai-skills) and [supabase/agent-skills](https://github.com/supabase/agent-skills)
- Install candidate: `npx skills add supabase/agent-skills --skill supabase`
- Dependency notes: may rely on Supabase docs, Supabase CLI, MCP, and project
  credentials depending on the task.
- License memo: supabase/agent-skills is MIT licensed.
- Use for Supabase Database, Auth, RLS, Storage, Edge Functions, Realtime,
  schema changes, migrations, and security audits.

### supabase-postgres-best-practices

- Source: [Supabase Agent Skills docs](https://supabase.com/docs/guides/ai-tools/ai-skills) and [supabase/agent-skills](https://github.com/supabase/agent-skills)
- Install candidate: `npx skills add supabase/agent-skills --skill supabase-postgres-best-practices`
- Dependency notes: use with SQL, schema, indexes, query tuning, connection
  pooling, RLS performance, and Postgres review work.
- License memo: supabase/agent-skills is MIT licensed.
- Use with `supabase` when changing database behavior or reviewing SQL.

### security-threat-model

- Source: [openai/skills curated `security-threat-model`](https://github.com/openai/skills/blob/main/skills/.curated/security-threat-model/SKILL.md)
- Install candidate: `$skill-installer security-threat-model`
- Dependency notes: repo-grounded review; no app package dependency.
- License memo: OpenAI curated Skill directory includes Apache-2.0
  `LICENSE.txt`.
- Use for public release, admin features, authentication, authorization,
  moderation, audit logs, and threat modeling.

## Repo-local Skills

These Skills are authored for Elite Run DB and are committed under
`.agents/skills/`:

- `elite-run-supabase-rls-security`
- `elite-run-admin-moderation-security`
- `elite-run-public-release-hardening`

They are intentionally short and do not include scripts or bundled external
content.

## How to call Skills

- Mention external Skills explicitly after local installation, for example:
  `$webapp-testing`, `$gh-fix-ci`, `$verification-before-completion`,
  `$grill-with-docs`, `$supabase`, `$supabase-postgres-best-practices`,
  `$security-threat-model`, or `$skill-scanner`.
- Do not use external PR-publishing Skills such as `github:yeet` for this
  repository. Their generic PR title/body conventions can conflict with the
  repo requirement that PR titles and bodies be written naturally in Japanese.
  For PR work, follow `AGENTS.md` directly: inspect the diff, stage only the
  intended files, write a Japanese PR title/body, and avoid tool-added prefixes
  such as `[codex]`.
- Mention repo-local Skills directly from this repo, for example:
  `$elite-run-supabase-rls-security`,
  `$elite-run-admin-moderation-security`, or
  `$elite-run-public-release-hardening`.
- If you add an external Skill later, first ask Codex to use
  `$skill-scanner` on the candidate and include the source, install command,
  dependency notes, and license memo in this file.
