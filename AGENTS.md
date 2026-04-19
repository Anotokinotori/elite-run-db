# AGENTS.md

## Project
Elite Run DB prototype for Genshin elite-hunting run records.

This repository is in the **UI / flow integration phase**.
The immediate goal is to make the app usable end-to-end with coherent screens and interactions.
This repository is **not yet** in the full architecture-refactor phase.

---

## Current phase priority

### Priority order
1. Integrate and stabilize the main user-facing screens and flows
2. Preserve the current prototype behavior where possible
3. Add missing UI/interaction logic required by the spec
4. Only do **minimal necessary component extraction**
5. Leave large-scale file structure refactors for a later dedicated task

### Important
Do **not** perform a broad feature-based rearchitecture yet.
Do **not** spend the task budget on “clean architecture” unless the current task explicitly asks for it.
Do **not** convert the whole repo into a polished long-term structure during UI integration tasks.

---

## Source of truth

Before making changes, read these files first:

### Core spec
- `docs/specs/elite-run-db-integration-spec.md`

### UI mocks / design references
- `docs/mocks/record-detail.mock.tsx`
- `docs/mocks/compare-view.mock.tsx`
- `docs/mocks/submit-step1.mock.tsx`
- `docs/mocks/submit-step2.mock.tsx`
- `docs/mocks/submit-step2-uid-modal.mock.tsx`
- `docs/mocks/submit-step3.mock.tsx`

### Legacy prototype reference
- `docs/mocks/submit-page-ui-prototype.html`

Most files under `docs/` are **reference materials**, not production code.
Use them to understand layout, hierarchy, and interaction intent.
- `docs/mocks/submit-page-ui-prototype.html` is a legacy prototype reference only.
- Do not treat files under `docs/` as the real implementation target unless a task explicitly says otherwise.
- Build the real app in the actual source tree under `src/`.
- Use the HTML prototype to understand existing flow, data shape, and interaction intent, then migrate those ideas into the real app code.

---

## Repository intent

This repo should become a maintainable React frontend later, but **right now** the focus is:

- get the Record Detail flow working
- get the Compare View working
- get the Submission flow working
- get UID-based character selection working
- get local draft persistence working

The current phase should move the app forward inside `src/`, using the legacy HTML prototype only as a migration reference.

Do not keep expanding the real implementation inside `docs/`.

---

## Implementation rules

### General
- Prefer incremental integration over rewrite
- Reuse existing code patterns when possible
- Reuse current asset-loading / image-handling patterns already used in the prototype
- Do not leave parallel dead-end implementations if you can integrate into the existing flow
- Do not keep raw Figma `FrameXX` names in production code
- Replace them with meaningful component names

### Mock fidelity
- When a task says to follow a mock, prioritize reproducing the mock's visual layout as closely as practical
- Correct behavior matters, but visual fidelity also matters and should not be traded away casually
- Do not replace mock-specific layout with a more generic UI just to improve cross-page consistency or reduce implementation effort unless the human explicitly allows that deviation
- Match spacing, sizing, alignment, density, hierarchy, and relative positioning as closely as practical
- If extra UI is required for functionality that the mock did not show, attach it beneath or adjacent to the most semantically related mock element instead of redesigning the layout around it
- If the implementation must deviate from the mock for a concrete reason, explicitly say so and keep the deviation as small as possible

### Componentization
Minimal necessary componentization is encouraged.
Good examples:
- `RecordDetailPage`
- `CompareDrawer`
- `SubmitFlow`
- `UidCharacterPickerModal`

Do not explode the codebase into dozens of files unless the task explicitly asks for architecture refactoring.

### State
- Prefer predictable local/component state
- Prefer derived values for computed UI like cost/bracket
- Keep logic replaceable for future DB/API integration
- Avoid overengineering global state unless clearly needed

---

## What is allowed to stay dummy for now

These may remain dummy / UI-state only:
- like actions
- share actions
- comment posting
- actual submit persistence to backend

These should still look and behave coherently in the UI, but do not need backend persistence yet.

---

## What should be implemented now

### Record Detail
- redesigned detail screen integration
- expandable summary / tags (“もっと見る”)
- similar runs section
- similar run action menu

### Compare View
- desktop-only compare entry from similar-run action menu
- right-side slide-over compare panel
- left pane = current record
- right pane = selected similar run
- right pane updates when another compare action is triggered
- independent scrolling for left and right panes
- YouTube synchronized play/pause only

### Submission flow
- Step 1: basic info
- Step 2: party/build info
- Step 2 UID character picker modal
- Step 3: detail info / guidelines
- local draft save/restore via browser storage
- guideline modal shell
- validation messages under fields

### UID integration
Use Enka.Network as the intended data source.
Best effort autofill target:
- showcased characters
- constellation
- weapon
- refinement

---

## Compare View rules

- Compare View is **desktop only**
- Do not expose compare action on mobile
- The center divider is only visual; the important part is independent scroll behavior
- Sync play button only needs to synchronize play/pause
- Seek sync and speed sync are not required now

---

## Submission flow rules

### Step count
The real top-level submission flow is exactly **3 steps**:
1. Basic Info
2. Party / Build
3. Detail Info / Guidelines

### Step 2 internal slots
Any `1 / 2 / 3 / 4` controls inside Step 2 refer to the **four party member slots**, not top-level steps.

### UID modal behavior
The UID picker should mimic Spiral Abyss character selection semantics as closely as practical:
- left side: up to 12 profile characters
- right side: 4 used-character slots
- tapping a left-side character selects it
- selected characters get a numeric order overlay on the upper part of the icon
- 5th selection does nothing if 4 are already selected
- to replace, the user clears a used-character slot first
- duplicate character selection is not allowed

### Cost / bracket
- recalculate live during editing
- do not wait until final submit

### Main attacker
- optional in normal cases
- single-select normally
- multiplayer may allow multiple selection
- user-declared, not auto-inferred

### Search tags
- predefined candidates only for now
- no freeform tag creation yet

### Notes field
Use one free-text field for summary / notes / comments.

### Guidelines
- guideline agreement is required for actual submit
- draft save is allowed without agreement

### Draft save
Use browser-local persistence.
Restoring previous submission draft state is desired even after a dummy “submit”.

---

## Similar-run heuristic logic

Full clustering is not required.
Implement a pragmatic replaceable heuristic.

Preferred signals:
- same ruleset/category
- same season
- same main attacker or overlapping core characters
- character overlap matters more than weapon overlap

Keep this isolated in a helper/module so it can be replaced later.

---

## Mobile / responsive rules

- Compare View is hidden on mobile
- Submission Step 2 may rely on horizontal scrolling rather than a large redesign
- Keep the UI usable, even if not fully elegant yet
- Do not redesign the product beyond the provided design direction unless necessary

---

## Temporary copy / placeholders

Strings containing `SVD` are temporary placeholders.
Do not “fix” or rename them globally unless the task explicitly asks for copy replacement.

Examples:
- `検索SVD`
- `PC+PCのSVD`
- `〇のSVD`

These will be replaced later.

---

## Git / change management

Branch policy for this repository:
- `main` is the protected release branch conceptually. Do not use it as the working branch for normal implementation tasks.
- `develop` is the integration branch for day-to-day work.
- For each implementation task, start from the latest `develop` and create a dedicated working branch such as `feat/<short-slug>` or `fix/<short-slug>`.
- Do not implement directly on `main`.
- Do not open pull requests directly into `main` for normal feature work.
- Normal task flow is: `develop` -> task branch -> pull request back into `develop`.
- Only use `main` as the merge target for explicit release or promotion tasks requested by the human.

If the required branches do not exist yet:
- create `develop` from the current integration baseline
- push it to origin
- then branch off from `develop`

Do not assume the human has already checked out the correct branch.
Check the current branch first when a coding task begins.
If needed, switch to `develop`, update it, and create a dedicated task branch before editing.
Do not change repository-wide git settings.
Do not create unrelated commits.
Keep changes scoped to the requested task.

If the environment supports tests/build:
- run the smallest relevant verification first
- for refactor / logic tasks, prefer running `npm run lint`, `npm run test`, `npm run typecheck`, then `npm run build`
- prefer targeted checks before expensive full checks
- if something is skipped, state that clearly in the final summary

When creating a pull request:
- write the pull request title and body in Japanese unless the human explicitly asks for another language
- include what changed
- include why the code was written that way
- include the intent behind non-obvious implementation choices or tradeoffs
- do not rely on the human to ask for implementation rationale separately every time

---

## Prompting expectations for future tasks

When responding to a task in this repo:
- first inspect relevant source files
- read the spec and mocks
- make a brief implementation plan internally
- then implement in small, coherent edits

Good tasks in this repo are usually:
- one UI flow
- one interaction cluster
- one integration slice
- one refactor slice

Avoid trying to solve every future architecture concern in a single pass.

---

## Definition of success for current phase

The current phase is successful if:
- the main UI flows exist and connect properly
- the visual direction matches the provided mocks
- the interactions match the spec closely enough
- local draft persistence works
- UID picker flow works or is scaffolded cleanly
- compare view works on desktop
- dummy behaviors are clearly isolated
- future refactor remains possible without major rewrites
