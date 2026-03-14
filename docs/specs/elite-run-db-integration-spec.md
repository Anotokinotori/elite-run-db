# Elite Run DB / Frontend Integration Task
# Scope: Existing prototype integration, not greenfield rewrite

You are integrating multiple Figma-derived UI mocks into the current Elite Run DB prototype.
For this task, the "existing prototype" specifically means `docs/mocks/submit-page-ui-prototype.html`.
There is not yet an equivalent integrated app implementation under `src/`.
Do NOT ignore that HTML prototype and start a separate greenfield implementation from scratch.
Do NOT fork the architecture into a parallel implementation.
Refactor and extend the existing HTML prototype as the implementation baseline for now.

## Primary Goal
Implement and integrate the following screens/features into the existing prototype:

1. Record Detail page redesign
2. Similar-run action menu
3. Compare View (right slide-over comparison panel)
4. Submission flow:
   - Step 1: Basic Info
   - Step 2: Party / Build
   - UID character selection modal
   - Step 3: Detail Info / Guidelines
5. Local draft persistence
6. UID-based autofill using Enka.Network API
7. YouTube-based compare view synchronized play/pause

---

## Non-goals / allowed dummy implementations
The following may remain dummy / non-persistent for now:
- run like
- share
- comment posting
- actual server-side submission persistence

The following should NOT remain dummy unless technically impossible in the current environment:
- compare view UI and routing/state integration
- compare view synchronized play/pause
- guideline modal/page shell
- local draft save/restore
- UID integration scaffold and best-effort autofill
- similar-run heuristic logic

---

## Architecture constraints
- Preserve the architecture already present in `docs/mocks/submit-page-ui-prototype.html` where possible.
- Reuse the routing, state shape, mock DB JS, and asset-loading patterns already present in that prototype.
- Figma-generated `FrameXX` names are disposable. Replace them with semantically meaningful component names.
- Prefer composable components over giant page files.
- Prefer controlled inputs or predictable local state slices.
- Prefer deterministic derived state for cost/bracket calculations.
- Do NOT duplicate existing page responsibilities into separate dead-end pages.
- Keep implementation production-oriented enough that replacing mock data with real DB/API later is straightforward.

---

## Recommended component structure
Use names close to the following (exact names optional if consistent):

### Record Detail
- RecordDetailPage
- RecordDetailHeader
- RecordHero
- RecordMetaBar
- RecordDescription
- RecordActionButtons
- PartySidebar
- PartyMemberCard
- SimilarRunsSection
- SimilarRunCard
- SimilarRunActionMenu
- CommentComposer
- CommentList
- CommentItem

### Compare View
- CompareDrawer
- CompareHeader
- CompareRunPane
- CompareRunScroller
- CompareVideoController

### Submission Flow
- RunSubmitPage
- SubmitStepper
- SubmitStepBasic
- SubmitStepParty
- SubmitStepDetails
- PartySlotEditor
- CharacterPickerModal
- UidCharacterPickerModal
- MainAttackerSelector
- TagSelector
- GuidelineModal
- SubmitPreviewPanel
- ValidationPanel

---

## Record Detail page requirements

### Layout
- Desktop: two-column layout
  - Left = primary content
  - Right = supporting sidebar
- Mobile: single-column layout
  - Sidebar sections stack below main content

### Content structure
Left column:
1. Video thumbnail / embedded player area
2. Run title
3. Runner info
4. Action buttons (like / share)
5. Meta bar
6. Expandable description / summary
7. Comment composer
8. Comment list

Right column:
1. Party / build summary
2. Similar runs list

### “もっと見る” behavior
Expand BOTH:
- full summary / description text
- tag list

This interaction should feel intentionally similar to YouTube’s learned UX pattern.

### Action buttons
- Like/share are UI-state only for now
- No backend persistence required
- Visual toggle state is sufficient

### Similar-run action menu
Each similar-run card should expose an action menu with:
- like
- share
- compare view

---

## Similar-run heuristic logic
Full clustering is out of scope.
Implement a pragmatic heuristic suitable for the current prototype.

Suggested heuristic dimensions:
- same ruleset/category
- same season
- same main attacker OR overlapping core characters
- character overlap weighted higher than weapon overlap
- exact match not required

Implement as replaceable logic.
Keep it isolated in a utility/module, not hardcoded deep in UI.

Example module:
- `getSimilarRuns(baseRun, allRuns): Run[]`

---

## Compare View requirements

### Entry point
Compare View opens from a similar-run card action menu.

### Presentation model
This is NOT a full page replacement.
This should behave like a right-side slide-over / drawer panel, similar to a side canvas:
- left side = current record detail
- right side = compared run detail
- close button in compare header
- right panel can be replaced without closing the drawer

### Left/Right semantics
- Left pane: currently viewed run (fixed)
- Right pane: run selected from similar-run action menu
- No left-right swap
- Selecting compare from another similar run updates ONLY the right pane

### Scrolling
- Left and right panes must scroll independently
- The visual center divider does not require special behavior
- It is acceptable to implement just a visual separator while ensuring independent scroll containers

### Mobile behavior
- Compare View must not be exposed on mobile
- Hide “compare view” from the similar-run action menu on small screens

### Video synchronization
Use YouTube iframe-based embed/player integration.
Requirement for now:
- synchronize only PLAY / PAUSE
- seek sync is NOT required
- playback speed sync is NOT required

Implementation expectations:
- encapsulate each embedded player behind a small abstraction
- if both panes have playable YouTube videos, the “sync play” button triggers play/pause on both players
- degraded behavior is acceptable if one side is unavailable, but handle gracefully

Suggested abstraction:
- `YouTubePlayerHandle { play(): void; pause(): void; ready: boolean; }`
- `ComparePlaybackController`

### Compare header controls
- Close button
- Compare title
- Sync play/pause button

---

## Submission flow requirements

The submission flow is exactly 3 major steps:

1. Basic Info
2. Party / Build
3. Detail Info / Guidelines

Do NOT reinterpret the flow as 4 steps.
Any 1/2/3/4 controls inside Step 2 refer to party member slot editing, not top-level form steps.

---

## Submission Step 1: Basic Info

### Required fields
- category / ruleset (single select)
- video URL (YouTube only)
- platform
- region if already present in prototype
- timer / timing definition if already supported by current prototype

### Platform behavior
- Solo: one platform selector
- Multiplayer: add a second platform selector below / adjacent with slightly modified label
- This is for player-by-player platform capture

### URL validation
- Accept YouTube URLs only for now
- Validate client-side
- Show inline field error under the field if invalid

---

## Submission Step 2: Party / Build

### Purpose
Capture the actual party/build used for the submitted run.

### Required inputs
For each of 4 party members:
- character
- constellation
- weapon
- refinement

All of the above are required.

### Real-time derived state
Update in real time while editing:
- character cost
- weapon cost
- total cost
- bracket classification

Do NOT defer calculation until final submit.
This must be reactive during editing.

### Step2 internal “1 / 2 / 3 / 4”
These correspond to the four party member slots.
The circular visual is the character icon frame, nothing more.
This is an internal slot-navigation/editor affordance, not a top-level multi-step wizard.

### Mobile behavior
- keep the same overall editing paradigm
- horizontal overflow / horizontal scrolling is acceptable
- do NOT redesign into a vertical wizard unless unavoidable

---

## UID integration / character autofill

### API source
Use Enka.Network as the UID data source.
Best-effort retrieve as much as possible from the showcased characters:
- characters
- constellation
- weapon
- refinement

### UidCharacterPickerModal purpose
After entering UID, open a modal for selecting party members from the fetched profile characters.

### Profile character count
- max 8 visible characters, matching game-side expectation

### Selection model
Mimic Spiral Abyss character selection behavior as closely as practical.

Behavior:
- left area = profile characters from UID
- right area = “used characters” (4 fixed slots)
- tapping a character on the left selects it
- selected characters get an absolute-positioned overlay on top of the icon, upper side only
- overlay contains the selection order number (1..4)
- the right-side 4 used-character slots reflect the selected characters

### Capacity rule
- max selected characters = 4

### Selecting a 5th character
If 4 are already selected and the user taps a 5th:
- do nothing

To replace:
- user taps an occupied used-character slot to clear it
- then selects a different character from the left list

This is intentional and aligned with the target audience’s learned UI conventions.

### Duplicate character rule
- duplicate character selection is not allowed

### Manual selection outside UID modal
The app must also support character selection without UID:
- provide a generic character picker modal
- reuse the same character asset/display logic as existing sort/filter UI patterns in the prototype

---

## Submission Step 3: Detail Info / Guidelines

### Main attacker selection
- optional field
- single-select in normal cases
- multiplayer only: allow multiple selections
- do NOT auto-infer
- user decides manually

This field should be presented as self-declared metadata.

### Search tags
- choose only from predefined candidate tags
- no free-form tag input for now
- design for future expansion

### Description / summary field
Use a single free-text field for:
- summary
- comments
- notes
- supplemental explanation

Do NOT split into separate summary/comment fields at this stage.

### Guidelines
- provide a guideline modal shell
- content can be placeholder for now
- “View guidelines” opens modal

### Agreement
- guideline agreement checkbox is required for submission
- draft save is still allowed without agreement
- actual submit must be blocked unless checked

---

## Save / submit behavior

### Draft save
Persist draft locally in browser storage.
Requirements:
- restore full draft state on next visit to submission flow
- keep restoreable even after pressing “submit”
- do not auto-clear on successful dummy submit

Suggested implementation:
- localStorage-based serialized draft state
- version key to avoid future schema breakage
- debounce saves

Example key:
- `elite-run-db.submitDraft.v1`

### Submit
Current submit is dummy.
Required behavior:
- validate required fields
- if valid, show simple success alert/toast: “申請しました”
- no backend persistence required yet

### Validation UX
Required-field errors should appear:
- inline
- below each field
- red text
- only for invalid/missing fields relevant to current action

---

## Dummy text / temporary copy policy
Strings containing `SVD` are temporary placeholders.
Do NOT try to normalize/correct all of them now.
Keep the placeholder system intact enough that copy can be swapped later.

Examples:
- 検索SVD
- PC+PCのSVD
- 〇のSVD

These will be replaced later.

---

## Asset handling
Character and weapon images should follow the same loading/rendering strategy as the current prototype.
Do NOT invent a new incompatible asset system.
Inspect current code and reuse the same pattern.

---

## Guideline page/modal
Even though final content is undecided, implement the guideline UI shell now.
Modal is acceptable and preferred per current spec.
Content can be placeholder text but the interaction itself should exist.

---

## Interaction details to preserve
- Similar-run compare entry updates only the right compare pane
- Like/share/comment-submit remain non-persistent
- “More” expansion behaves like YouTube-inspired UX
- Compare view hidden on mobile
- Step 2 cost/bracket recalculates live
- UID modal uses Spiral-Abyss-like interaction semantics
- Used-character slot tap clears slot when replacement is needed

---

## Integration requirements
When implementing:
1. first inspect `docs/mocks/submit-page-ui-prototype.html`
2. identify the current detail page and submit flow entry points inside that HTML prototype
3. replace / extend existing screens rather than duplicating them
4. preserve mock DB usage where present
5. keep replacement-friendly seams for future real DB/API integration

Do not leave dead parallel mock pages unless explicitly necessary for transition.
Do not treat the current `src/` placeholders as the real prototype baseline.
Do not keep raw Figma `FrameXX` sprawl in the final implementation.

---

## Expected technical quality bar
- semantic component decomposition
- coherent state ownership
- minimal prop drilling where avoidable
- derived selectors/utilities for computed fields
- modular compare logic
- modular UID integration wrapper
- resilient local draft persistence
- responsive behavior matching the spec
- graceful degradation for dummy / partial features

---

## Research-backed implementation assumptions
- Use YouTube IFrame Player API semantics for compare-view synchronized play/pause
- Use Enka.Network for UID-driven player/showcase data retrieval
- Keep both integrations wrapped behind thin adapters so they can be swapped or disabled cleanly later

---

## Deliverable
Integrate the above into the current HTML prototype baseline and leave the codebase in a state where:
- detail page redesign is usable
- compare view is usable on desktop
- submission flow is navigable end-to-end
- local draft save/restore works
- UID flow is scaffolded and, where feasible, functional
- dummy features are clearly isolated from real UI-state logic
