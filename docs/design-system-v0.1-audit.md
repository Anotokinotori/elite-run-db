# UI統一・Design System v0.1 Audit

## Purpose

Elite Run DB is a prototype for viewing, searching, comparing, and submitting Genshin elite-hunting RTA records. The current phase is UI / flow integration, so the design-system work should reduce visible drift without turning the repository into a broad architecture rewrite.

The product should have two page modes:

- View mode: Home, Library, Record Detail, and Compare. These pages focus on records as things to inspect, search, trust, and compare.
- Create mode: Submit. This page focuses on creating an application draft and should keep a workbench / form atmosphere while sharing base UI rules.

## Current Drift

| UI | Main Locations | Current Issue | Direction |
| --- | --- | --- | --- |
| Header | `src/components/AppShell.tsx`, `src/features/home/sections/Header.tsx`, `src/features/recordDetail/sections/Header.tsx`, `src/features/submit/sections/Header.tsx` | Multiple header systems exist. Embedded pages usually rely on `AppShell`, but page-local headers still define their own controls. | Keep dark Global Header. Standardize page subheaders and Create Header. |
| Submit entry | `AppShell`, Home header, Detail header | Copy and button treatment differ. | Use `記録申請` consistently. |
| Back button | Detail header, Submit header, Submit stepper | Icon shape, surface, and copy differ. | Use shared `BackButton` with icon-only and text variants. |
| Buttons | Many feature files | Primary, secondary, ghost, and icon-only treatments are hand-written. | Introduce `Button` and `IconButton`. |
| Version select | Home leaderboard, Detail header, Library category filter | Season / Version copy and control styling differ. | Use `Version` in visible copy and a shared compact select. |
| Floating CTA | Home, Library | Nearly identical implementation duplicated. | Use shared `FloatingCta`. |
| Record cards | Home ranking, Library, Similar, Compare candidates | Cards need different information density, but hover, tags, actions, and shell rules drift. | Treat as a RecordCard family, not a single card. |
| Chips / badges | Detail, Library, Submit, Filter drawers | Role and appearance are mixed. | Shared `Chip` / `Badge` variants with view/create modes. |
| Form fields | Submit, Library filters, Home filter drawer | Field shells, focus rings, helper/error text differ. | Shared `FormField` and `SelectControl`; Create mode can use larger sizing. |
| Modal / drawer | Filter drawers, Compare drawer, Submit modals | Overlay, close button, radius, and shadow differ. | Shared `ModalFrame` / `DrawerFrame` shell. |
| Legacy CSS | `src/index.css` | `.hoyo-card` is unused in `src`; it remains from the legacy HTML mock. | Remove from production CSS in cleanup. |

## Token Defaults

- Ink: `#111827`
- Text: `#333333`
- Dark chrome: `#111116`
- Surface: `#ffffff`
- Muted surface: `#f7f8fa`
- App surface: `#f5f6f8`
- Create surface: `#f6f6f6`
- Border: `#d8dde6`
- Muted border: `#e5e7eb`
- Muted text: `#5f6678`
- Subtle text: `#8d93a3`
- Create muted text: `#9999b1`
- Danger: `#d24b5a`
- Like: `#ff8ea1`

## Migration Notes

- Radius changes that alter existing UI should be kept in an independent commit.
- Submit's global scale wrapper is prototype-only and should be removed early.
- Home / Library display headlines using Bebas Neue are intentional View mode brand elements and should remain.
- `docs/mocks/submit-page-ui-prototype.html` may keep `.hoyo-card`; production CSS should not.
