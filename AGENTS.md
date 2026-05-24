# AGENTS.md

## Project

Elite Run DB is a UI/UX prototype for Genshin Impact elite-hunting RTA records.

The product goal is not just to show a fastest-time leaderboard.
The goal is to make elite-hunting records easier to find, compare, understand, and preserve by showing routes, teams, costs, versions, categories, and record context in a useful way.

This is an unofficial fan-made prototype.

---

## Current Phase

This repository is currently in the **public-demo UI stabilization and design validation phase**.

The main goal is to complete a coherent public-facing prototype before implementing real backend, authentication, admin, and review systems.

Current priorities are:

1. Complete and stabilize the LP / landing experience.
2. Improve the Library / record search experience.
3. Add or refine large Library discovery features.
4. Unify modal and overlay UI quality.
5. Preserve the existing product world, visual direction, and navigation.
6. Prepare the codebase so future DB/auth/admin work can be added safely.
7. Avoid backend-driven simplification of the current UI concept.

Backend, auth, admin, reviewer, moderation, and security work are important, but they should be implemented after the main UI direction and core user experience are more stable.

---

## Product Direction

The app has two different public-facing roles:

- **Ranking / Home**: a shared competitive stage for comparing records under common conditions.
- **Library / Search**: a research and discovery space for finding useful records based on characters, teams, costs, versions, tags, and player context.

Do not collapse these two roles into one generic search page or one generic leaderboard.

The UI should support both:

- the competitive appeal of elite-hunting RTA
- the research value of diverse records, off-meta teams, low-cost runs, and past-version context

---

## Current Architecture

The real app lives under `src/`.

Current important areas include:

- `src/app`
  - app-level route types, route parsing, navigation behavior, and placeholders
- `src/features/home`
  - ranking / home experience
- `src/features/library`
  - record search and discovery experience
- `src/features/lp`
  - landing page
- `src/features/recordDetail`
  - record detail page
- `src/features/submit`
  - record submission flow
- `src/components/ui`
  - shared UI primitives
- `src/data`
  - mock app/run data
- `src/lib`
  - shared logic and helpers
- `docs/mocks`
  - design references and generated mock code
- `docs/specs`
  - product, integration, and migration notes
- `.agents/skills`
  - repo-local Codex Skills

When changing a feature, prefer keeping feature-specific code inside that feature directory unless there is a clear reason to extract shared logic.

---

## Source of Truth

Before implementing, inspect the relevant current source files first.

For product and project intent, read:

- `README.md`
- relevant issues / PR descriptions
- relevant files under `docs/specs/`

For UI/design tasks, read:

- the relevant current implementation under `src/features/...`
- the relevant mock or reference under `docs/mocks/...` if one exists
- screenshots or visual references provided by the human, if any

For DB-related planning tasks, read:

- `docs/specs/db-migration-roadmap.md`

For Codex Skills and agent-skill operations, read:

- `docs/codex-skills.md`
- relevant repo-local Skills under `.agents/skills/...`

Do not assume old mock files are always up to date.
Prefer the current implementation and the most recent issue/PR/task description when there is conflict.

---

## Codex Skills

This repository uses Codex Skills as task-specific guidance.

Read `docs/codex-skills.md` before changing Skill setup, adding repo-local Skills, installing external Skills, or changing Skill trigger rules.

Use Skills when they match the task.
Do not claim that a Skill was used if it is not installed, not available, or not actually used in the current Codex environment.

Skill trigger rules:

- If UI or screen behavior changes, use `webapp-testing` when available to check main pages, submit flow, compare view, responsive layout, screenshots, and console errors.
- If GitHub Actions or CI checks fail, use `gh-fix-ci` when available.
- Before claiming implementation is complete, use `verification-before-completion` when available to choose and run the needed checks.
- Before large design changes, DB design, moderation flow, or domain-term changes, use `grill-with-docs` when available.
- If touching Supabase, RLS, Auth, DB migrations, Storage, Edge Functions, or public record queries, use `supabase`, `supabase-postgres-best-practices`, and the repo-local `elite-run-supabase-rls-security` Skill when relevant.
- If touching admin features, moderation, review status, approval/rejection/unpublish flows, reviewer/admin permissions, or audit logs, use `security-threat-model` and `elite-run-admin-moderation-security` when relevant.
- If touching public release, preview/public deployment, Vercel/Supabase env changes, robots/noindex behavior, or exposing real submission data, use `security-threat-model`, `verification-before-completion`, and `elite-run-public-release-hardening` when relevant.
- If adding a new external Skill, use `skill-scanner` first and follow `docs/codex-skills.md`.

Do not vendor external Skill bodies into this repository unless a task explicitly asks for it and the source, license, and modification notes are documented.

---

## Figma / Mock Workflow

Design work may come from several sources:

- Figma-generated React code placed under `docs/mocks`
- manually written mock files under `docs/mocks`
- screenshots or reference UI images provided by the human
- simple screens designed directly in implementation by Codex

Files under `docs/mocks` are **reference materials**, not production code.

Use mock files to understand:

- layout
- spacing
- hierarchy
- visual rhythm
- interaction intent
- content structure

Do not treat mock files as the final implementation target unless the task explicitly says so.

Build real app changes under `src/`.

When implementing from a Figma/mock reference:

- preserve the intended visual hierarchy and layout as closely as practical
- do not replace a distinctive design with a generic SaaS-like UI
- do not simplify the worldbuilding or visual identity just to make implementation easier
- if the mock is not technically suitable, adapt it carefully while preserving the design intent
- if a deviation is necessary, explain the reason in the PR body

For simple screens, Codex may design directly without a mock if the human request allows it.
For important LP, Library, modal, or large feature screens, prefer using mocks or visual references.

---

## Implementation Principles

Prefer incremental, scoped changes.

Do:

- keep changes focused on the requested task
- preserve existing UI behavior unless the task explicitly asks to change it
- preserve current visual direction and product intent
- make code easier to read and maintain
- keep logic replaceable for future DB/API integration
- use feature-local types and helpers for large new features
- add tests for pure logic when practical
- document non-obvious tradeoffs in the PR body

Avoid:

- broad rewrites without explicit task scope
- changing unrelated screens
- replacing product-specific UI with generic UI
- mixing large visual redesign and data architecture changes in one PR
- introducing backend/auth/admin assumptions into unrelated UI tasks
- deleting mock data or mock flows before replacement paths exist

---

## Refactor Rules

Refactoring is allowed when it directly improves maintainability or prepares the app for planned work.

Good refactors include:

- splitting oversized files by responsibility
- moving route parsing or navigation side effects out of page components
- isolating pure logic into testable modules
- extracting feature-local helpers
- splitting shared UI primitives into clear files
- removing dead-end duplicate implementations

Do not refactor just to make the architecture look more abstract.

Avoid introducing heavy architecture patterns unless they solve a concrete current problem.

Preserve current behavior and visual output during refactor-only tasks.

---

## UI / Design Rules

This project should not look like a generic SaaS dashboard.

The UI should support the world and culture of elite-hunting RTA:

- competitive
- research-oriented
- record-focused
- visually distinctive
- useful for comparing teams, routes, costs, and versions

For Library/search UI:

- preserve the existing search/filter content unless the task says otherwise
- design changes may be large, but the search meaning should remain clear
- large discovery features should be feature-local and not hardwired into unrelated pages

For modals:

- unify visual quality and interaction patterns where practical
- do not change field meaning or flow unless explicitly requested
- avoid one-off modal styles that cannot scale to future auth/admin/review flows

For LP:

- communicate the appeal and value of elite-hunting RTA
- do not make the LP feel like only a generic product sales page
- include unofficial/fan-made positioning when working on public-facing final copy

---

## Large Feature Rules

Large user-facing features should be developed as isolated feature slices.

A good large feature PR should usually include:

- feature-local types
- feature-local mock/view data if needed
- UI components scoped to the feature
- pure logic separated from visual components when practical
- clear PR explanation of what changed and why

For large Library features, do not directly scatter logic across unrelated files.

Expected future Library-scale features may include things like:

- version meta team discovery
- owned-character-based search
- cost efficiency map

These should not force premature DB implementation, but they should be written in a way that can later receive real data through adapters or API results.

---

## Data / DB Preparation Rules

The app is still mock-data based.

Do not implement real DB/auth/admin work unless the task explicitly asks for it.

For now:

- keep mock data available
- do not delete `mockRuns` or equivalent data without a replacement
- do not reshape the entire app around a guessed DB schema
- do not simplify the UI because a future DB may be difficult
- keep UI display types separate from future DB storage types where practical

When DB work is explicitly requested:

- follow the relevant issue and `docs/specs/db-migration-roadmap.md`
- use the matching Codex Skills and security guardrails listed in the Codex Skills section
- do not use the UI display model as the DB schema directly
- prefer adapters between DB payloads and UI view models
- migrate one area at a time
- start with the smallest safe data loop

---

## Auth / Admin / Review Rules

Auth, admin, reviewer, moderation, review status, and security-sensitive flows are planned future work.

Do not casually add fake production-like auth or admin behavior during unrelated UI work.

When these areas are implemented later:

- follow the relevant issue or design document
- use the matching Codex Skills and security guardrails listed in the Codex Skills section
- design the data and permission model first
- keep public and privileged surfaces clearly separated
- avoid leaking admin/reviewer assumptions into public UI code
- add explicit empty/loading/error/permission states
- preserve auditability and review status concepts

Placeholder pages may exist, but do not treat them as final admin/account implementations.

---

## Routing Rules

Route behavior is app-level infrastructure.

When changing routes:

- inspect `src/app/routes.ts`
- inspect `src/app/useAppNavigation.ts`
- preserve existing hash URL behavior unless the task explicitly changes it
- preserve home state retention and scroll restoration unless explicitly changed
- keep route parsing and navigation side effects separated from page rendering
- add or update route tests for pure route logic

Do not introduce a routing library unless the task explicitly asks for it or the PR explains why it is necessary.

---

## Shared UI Rules

Shared UI primitives live under `src/components/ui`.

Use shared primitives when they fit.

Do not force all product-specific UI into generic primitives.

Good shared UI candidates:

- buttons
- badges
- chips
- cards
- panels
- modal frames
- drawer frames
- empty states
- form shells

Keep product-specific layouts inside feature directories.

If a primitive needs a new variant, make sure it is genuinely reusable and does not damage existing screens.

---

## Testing / Verification

Use the smallest useful verification first.

For most implementation tasks, run:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

For logic-heavy changes, add or update targeted tests.

For visual-only changes, still run typecheck/build if the environment supports it.

If any verification step is skipped, explain why in the final summary or PR body.

Known warnings should not be hidden.
If a warning is pre-existing, state that clearly.

Before claiming work is complete, prefer using `verification-before-completion` when available.

---

## Git / Change Management

Branch policy:

- `main` is the conceptual release branch.
- `develop` is the day-to-day integration branch.
- Create task branches from the latest `develop`.
- Open PRs back into `develop` for normal work.
- Do not implement directly on `main`.
- Do not open normal feature PRs directly into `main`.
- Do not change repository-wide git settings.
- Do not create unrelated commits.
- Delete task branches after they are no longer needed.
- Never delete `main`, `develop`, or other integration/release branches.
- Do not delete a remote PR branch before merge unless the human explicitly asks for that risk; delete the local task branch after switching away when the PR work is handed off.

Before editing:

- check the current branch
- update from `develop` if needed
- create a dedicated task branch

Keep changes scoped to the requested task.

---

## Pull Request Expectations

PR title and body should be written in Japanese unless the human explicitly asks otherwise.

The PR body should include:

- what changed
- why it changed
- how the implementation was split
- what behavior was preserved
- non-obvious tradeoffs
- verification commands and results
- known warnings or skipped checks
- any relevant Skills used, if available and actually used

Do not rely on the human to ask for implementation rationale afterward.

---

## What Not To Do

Do not:

- turn the app into a generic CRUD dashboard
- redesign unrelated screens during a scoped task
- remove distinctive visual direction for convenience
- introduce real backend/auth/admin functionality without explicit request
- convert all mocks into production code blindly
- delete mock data before a safe replacement exists
- mix DB migration, UI redesign, and routing overhaul in one task
- vendor external Skills into the repo without explicit approval and source/license notes
- claim a Skill, test, or verification step was used if it was not
- hide uncertainty or skipped verification
- make broad architecture changes without explaining the reason

---

## Definition of Success for This Phase

This phase is successful when:

- the public demo feels coherent and intentional
- LP communicates the appeal and value of elite-hunting RTA
- Ranking and Library have clearly different roles
- Library/search feels useful and visually aligned with the project world
- major modals and overlays no longer feel like unrelated temporary UI
- large discovery features can be added without breaking existing flows
- the code remains ready for future DB/auth/admin/review work
- the project can be shown to external reviewers for feedback
- feedback can be reflected without rewriting the whole app
