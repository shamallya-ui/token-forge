# Token Forge

**Token Forge** is a free, open-source, stack-agnostic design-token and component-library project. Its brand is **ShaMallya** (from Shamala + Mallya, stylised *ShaMallya*). One source of truth for colour, type, spacing and motion gives every app Shamala builds the same look and feel, whatever framework it uses.

> Status: Phase 1 (documentation only). No code exists yet. Palette direction B ("warm editorial") is decided; logo and typography remain open.

## Why it exists

- Shamala's apps should look like one family without copy-pasting styles.
- Design decisions live in one place and are changed once.
- It is a portfolio and resume piece showing design-systems, architecture and governance skills.
- It is independent of any employer or client palette. It does not reuse any third-party or employer palette and uses no organisation-specific role naming (see [ADR-0004](docs/adr/0004-no-third-party-palette.md)).

## Goals

| # | Goal | Measure |
|---|------|---------|
| G1 | Single source of truth for design decisions | Every visual value in an app traces back to a `shamallya.` token |
| G2 | Stack-agnostic delivery | Same tokens consumed as CSS variables, Tailwind preset and other platform outputs |
| G3 | Accessible by default | WCAG AA contrast met for every documented text/surface pair in light and dark |
| G4 | Svelte 5 and React parity | Component layer renders consistently in both |
| G5 | Free and open source | No paid tools or licences in the toolchain |
| G6 | Governed and versioned | Semver, changelog, deprecation policy |

## The ShaMallya palette (brand hues)

Direction B, "warm editorial" (decided by Shamala, [ADR-0007](docs/adr/0007-palette-warm-editorial.md)):

| Hue | Base value | Role |
|-----|-----------|------|
| Black (warm) | #1C1917 | Brand ink, neutral base, dark-mode background |
| Blue | #1D4ED8 | Primary (default action), info, links |
| Red | #B03608 | Danger (brick-orange leaning) |
| Yellow | #EAB308 | Warning, highlight fill; always with dark text (text step: ochre #854D0E) |
| Green | #3F6B0B | Success (olive leaning) |

Light-mode page background is soft cream #FAF7F2; dark mode uses the warm black. In dark mode blue, red and green are lifted about 12% toward white. Red/green status always carries an icon or label. Full role and scale design is in [architecture.md](docs/architecture.md); product rationale is in [PRD.md](docs/PRD.md).

## How it will be used across apps

1. Tokens are authored once in a W3C Design Tokens (DTCG) format source.
2. A build step transforms them into per-platform packages.
3. Each app installs the tokens package, and optionally the UI package for its framework.
4. App code references semantic tokens only, never raw values.
5. Changing a brand theme or a token value is a version bump that apps adopt on their own schedule.

| Consumer | What it installs | What it gets |
|----------|------------------|--------------|
| Any web app (any stack) | `@shamallya/tokens` | CSS variables |
| Tailwind app | `@shamallya/tokens` | Tailwind preset |
| React app | `@shamallya/tokens` + `@shamallya/ui` | shadcn/ui-based components |
| Svelte 5 app (e.g. Vibgyor) | `@shamallya/tokens` + `@shamallya/ui` | shadcn-svelte-based components |
| Future: other platforms | `@shamallya/tokens` | Mobile/other outputs from the same source |
| A company adopting the brand | Forks or swaps a brand theme | Own palette, same structure |

## Document map

| Document | Purpose |
|----------|---------|
| [docs/PRD.md](docs/PRD.md) | Business objective, personas, requirements, scope, success criteria, risks, open questions |
| [docs/architecture.md](docs/architecture.md) | Token tiers, categories, naming, theming, pipeline, components, showcase, repo layout, palette design |
| [docs/testing-matrix.md](docs/testing-matrix.md) | Requirements mapped to QA criteria |
| [docs/ideas.md](docs/ideas.md) | Suggested ideas and recommendations |
| [docs/components.md](docs/components.md) | Component list drawn from Vibgyor and the Konkani Meal Planner |
| [docs/brand/logo-typography-brief.md](docs/brand/logo-typography-brief.md) | Five logo concepts and three type pairings |
| [docs/adr/](docs/adr/) | Architecture decision records (0001 to 0008) |

## Naming at a glance

- Brand: **ShaMallya**
- Token namespace: `shamallya.`
- Packages: `@shamallya/tokens`, `@shamallya/ui`

## Open questions for Shamala

Collected in the PRD (section 9). Hex values are resolved. Still open: logo, typography choice, component list, licence, icon set, and the dark-mode text lift for blue/red/green.

## Licence

MIT (confirmed by Shamala).
