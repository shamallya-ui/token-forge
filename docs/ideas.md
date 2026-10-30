# Token Forge: Suggested Ideas

Recommendations for Shamala to accept, adjust or reject. Brand: ShaMallya · Namespace: `shamallya.`

## 1. Colour strategy

| # | Idea | Why |
|---|------|-----|
| 1 | **Black as brand ink with an accent hierarchy** (consistent with decided palette B, "warm editorial": warm black #1C1917 on cream #FAF7F2, blue #1D4ED8 as the main accent). Black and its neutrals carry most of the interface; red #B03608, yellow #EAB308 and green #3F6B0B appear only for status meaning | Five hues competing looks noisy; hierarchy keeps it calm and recognisable |
| 2 | **Accent-hue limit per screen.** Proposal: at most one primary accent plus status colours that are actually needed; no decorative use of red, yellow, green | Keeps status colours meaningful |
| 3 | **Colour-blind-safe status pairs.** Red and green never differ by colour alone; every status has an icon and a text label; test with simulated colour blindness | Accessibility and trust |
| 4 | **On-colour tokens.** Every filled colour has a paired text/icon token (dark ink on yellow) | Avoids contrast failures |
| 5 | **Warm neutrals.** Neutrals are derived from the warm black, matching the cream background (decided under ADR-0007) | Cohesive editorial feel without a new hue |
| 5b | **Dark-mode text steps.** Normal-size blue, red, green text on warm black uses dedicated lighter steps (#7A9AF4, #E8794A, #8DB84F), not the 12%-lifted fills (done in palette revision 2, architecture 9.5) | Meets AA |

## 2. Governance

| # | Idea | Detail |
|---|------|--------|
| 6 | Semver | Breaking: token removed or renamed, meaning changed. Minor: tokens added. Patch: value tweaks that do not change meaning |
| 7 | Changelog | Human-written entry for every release, grouped by added, changed, deprecated, removed |
| 8 | Deprecation policy | Mark deprecated with replacement; keep for at least one minor release; remove only in a major |
| 9 | Decision log | New significant decisions become ADRs |
| 10 | Review checklist | Contrast report, parity report, visual diff reviewed before release |

## 3. System design

| # | Idea | Detail |
|---|------|--------|
| 11 | Density and spacing scale | Compact, comfortable, spacious modes; 4-unit base grid; semantic spacing names (inset, stack, gap) |
| 12 | Reduced-motion by default in tokens | Motion tokens collapse when the user prefers it |
| 13 | High-contrast mode (later) | A third semantic set for stronger contrast |
| 14 | Elevation in dark mode | Use lighter surfaces and borders rather than heavy shadows |

## 4. Showcase and communication

| # | Idea | Detail |
|---|------|--------|
| 15 | Live theme switcher | Light/dark, brand theme, density and reduced-motion toggles in the showcase |
| 16 | Contrast report page | Published table of every text/surface pair and its ratio |
| 17 | One-page brand guide for designers | Logo use, palette roles, do and don't, accent-hue rule, status pattern, type pairing, spacing, one example layout |
| 18 | Adoption guide | Short steps for a React app, a Svelte 5 app, and a company retheme |

## 5. Resume-friendly case-study outline

1. Problem: many apps, inconsistent look, multiple stacks.
2. Constraints: free tools only, solo maintainer, accessibility required.
3. Decisions: DTCG source, Style Dictionary, tiers, naming, Svelte 5 and React (link to ADRs).
4. Palette thinking: five hues, black as ink, role mapping, contrast results.
5. Pipeline: source to outputs diagram, parity and contrast gates.
6. Component layer: shadcn/ui and shadcn-svelte, consistency tests.
7. Results: adoption in Vibgyor and a second app, metrics (contrast pass rate, tokens count, build time).
8. Governance: semver, changelog, deprecation.
9. Lessons learned and next steps (Lit, more platforms).
10. Links: repo, showcase, brand guide.

## 6. Documentation Updates

Accepted ideas should be promoted into the PRD requirements and the testing matrix, with an ADR where they change architecture.
