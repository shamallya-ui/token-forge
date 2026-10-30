# Token Forge: Product Requirements Document

Version: 0.1 (Phase 1 draft) · Owner: Shamala · Brand: ShaMallya · Namespace: `shamallya.`

## 1. Business Objective & Impact

**Problem.** Shamala builds multiple apps in different stacks (React today, Svelte 5 for Vibgyor at `ClassUpdates-Vibgyor`). Without a shared system, colours, spacing and components drift, and each app re-solves the same design problems.

**Objective.** Deliver a free, open-source design-token and component-library project, branded ShaMallya, that gives all her apps one consistent look and feel and doubles as a resume piece.

**Impact.**
- Consistency: one decision, applied everywhere.
- Speed: new apps start from tokens and components, not a blank page.
- Accessibility: contrast and status rules enforced once.
- Career value: a public, documented, governed design system with a case study.

## 2. Personas

| Persona | Needs | Success looks like |
|---------|-------|--------------------|
| **Shamala (owner/designer)** | Define and evolve the brand, trust that changes propagate, publish a portfolio piece | Edits one source, sees all outputs and the showcase update |
| **Developer in any stack** | Drop-in tokens in their format, clear naming, copyable components, docs | Installs a package, uses semantic tokens, no manual translation |
| **Company adopting the brand** | Retheme with own palette, keep structure, trust licensing and governance | Swaps a brand theme without touching components; clear licence and versioning |

## 3. Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Tokens are authored in W3C DTCG-format JSON as the single source of truth | Must |
| FR-02 | Three tiers: primitive, semantic, component; references only flow downward in abstraction | Must |
| FR-03 | Categories: colour, typography, spacing, radius, shadow, motion, z-index | Must |
| FR-04 | All token names follow the `shamallya.` naming convention and are lint-checked | Must |
| FR-05 | Colour palette: black, red, yellow, blue, green; each chromatic hue has a 50-950 ramp; neutrals derived from black | Must |
| FR-06 | Semantic colour roles: primary, danger, warning, info, success, surface, text, border | Must |
| FR-07 | Light and dark modes with full parity of semantic tokens | Must |
| FR-08 | Swappable brand themes without changing component code | Must |
| FR-09 | Build outputs: CSS variables, Tailwind preset, and at least one further platform output (later) | Must (CSS, Tailwind); Should (others) |
| FR-10 | `@shamallya-ui/tokens` package published for consumption | Must |
| FR-11 | `@shamallya-ui/components` component package for React (shadcn/ui basis) and Svelte 5 (shadcn-svelte basis) | Must |
| FR-12 | Possible framework-neutral Lit web components later | Could |
| FR-13 | Showcase site (Storybook or similar) on GitHub Pages with live light/dark and theme switching | Must |
| FR-14 | Status UI never relies on colour alone (icon and label required) | Must |
| FR-15 | Semver releases, changelog, deprecation policy | Must |
| FR-16 | Documented contribution and adoption guide | Should |

## 4. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Accessibility | WCAG 2.2 AA: normal text 4.5:1, large text 3:1, UI components and focus indicators 3:1, in light and dark |
| NFR-02 | Cost | Only free and open-source tooling; no paid services required |
| NFR-03 | Portability | No dependency on a specific framework for the token source |
| NFR-04 | Determinism | Same source produces byte-identical outputs on every build |
| NFR-05 | Performance | Token CSS payload small; no runtime JavaScript required for theming via CSS variables |
| NFR-06 | Maintainability | Naming and structure lint in CI; a single owner can maintain it |
| NFR-07 | Documentation | Every public token and component is documented in the showcase |
| NFR-08 | Browser support | Current evergreen browsers (exact baseline TBD) |
| NFR-09 | Licensing | Permissive open-source licence; dependencies compatible |

## 5. Scope

**In scope (Phase 1 and the planned product):** token architecture and naming, palette and scales, theming, build pipeline design, component-layer strategy, showcase site, governance, test strategy, documentation.

**Phase 1 specifically:** documentation only (this set). No code is produced in Phase 1.

**Out of scope:**
- Any third-party or employer palette, or organisation-specific role naming (ADR-0004).
- Paid design tooling (Figma). If a design tool is needed, Penpot is the free option.
- Native mobile component libraries (token outputs for mobile may come later; components do not).
- Full app templates and page layouts.
- Illustration and icon design (an existing open-source icon set is expected, TBD).
- Hosted services, user accounts, or a backend.

## 6. Colour Palette Product Decisions

Shamala's decision: palette direction **B, "warm editorial"** (see [ADR-0007](adr/0007-palette-warm-editorial.md)). Brand hues are black, blue, red, yellow, green.

| Hue | Base value (500 level) | Role | Semantic tokens |
|-----|------------------------|------|-----------------|
| Black (warm) | #1C1917 | Brand ink; neutral base; dark-mode background | `text`, `surface`, `border` |
| Blue | #1D4ED8 | Default action colour, links | `primary`, `info` |
| Red | #B03608 | Errors and destructive actions (brick-orange leaning; revised from #C2410C to pass with margin) | `danger` |
| Yellow | #EAB308 | Warning and highlight; always paired with dark text | `warning` |
| Green | #3F6B0B | Positive outcomes (olive leaning; revised from #4D7C0F) | `success` |
| Yellow text step (ochre) | #854D0E | Yellow-family text/icons on light surfaces; yellow #EAB308 stays a fill with dark text | `warning` (text) |

Backgrounds: light mode is soft cream #FAF7F2; dark mode is warm black #1C1917. In dark mode blue, red and green are lifted about 12% toward white. Red/green status must always carry an icon or label, never colour alone. Scale design, computed contrast ratios and accessibility targets are in [architecture.md](architecture.md) sections 9 and 10.

## 7. Success Criteria

| # | Criterion | Target |
|---|-----------|--------|
| SC-1 | Vibgyor (Svelte 5) adopts the tokens | At least one real screen themed using only semantic tokens |
| SC-2 | A second app (any stack) adopts the tokens | Adopted without token changes |
| SC-3 | Contrast | 100% of documented text/surface pairs pass AA in both modes |
| SC-4 | Parity | CSS and Tailwind outputs report zero value mismatches |
| SC-5 | Theme swap | A second brand theme built by changing only brand-tier values |
| SC-6 | Showcase live | Public GitHub Pages site with theme switcher |
| SC-7 | Governance | First tagged release with changelog |
| SC-8 | Portfolio | Case-study write-up published (see [ideas.md](ideas.md)) |

## 8. Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| R1 | Five brand hues compete visually | High | Medium | Accent hierarchy and a maximum number of simultaneous accent hues per screen (ideas.md) |
| R2 | MITIGATED in palette revision 2: yellow-as-text banned in favour of ochre (6.4:1); red and green darkened (5.8:1, 5.9:1); dark-mode text uses lighter steps. Residual risk: future hue or cream changes | High | High | "On-colour" tokens; dark ink on yellow; yellow never as text on light; lighter steps for dark-mode text |
| R3 | Red/green status ambiguity for colour-blind users | Medium | High | Icons and labels always accompany colour (FR-14) |
| R4 | Svelte and React components diverge | Medium | Medium | Cross-framework rendering tests; shared token layer; parity checklist |
| R5 | DTCG spec and tool support are still evolving | Medium | Medium | Pin tool versions; ADR records the decision; isolate in the build step |
| R6 | Solo maintainer burnout / scope creep | Medium | Medium | Strict phases; component list kept small initially |
| R7 | Name confusion with existing projects | Low | Low | Trademark/name search before launch (open question) |
| R8 | Accidental reuse of employer or client palette values | Low | High | ADR-0004; palette provenance note |

## 9. Open Questions for Shamala

| # | Question | Needed by |
|---|----------|-----------|
| Q1 | ~~Exact hex values~~ **RESOLVED**: direction B, "warm editorial" (ADR-0007) | Done |
| Q2 | ~~Logo~~ **RESOLVED**: concept 2 (SM monogram tile) with the concept 1 wordmark lockup; tile is the logo, concept 5 is the title lockup; all ten sub-questions answered in docs/brand/logo-typography-brief.md; only the name-availability check remains | Done |
| Q3 | ~~Typography~~ **RESOLVED**: pairing A, Fraunces / Inter / JetBrains Mono (docs/brand/logo-typography-brief.md). Remaining: self-host fonts for offline PWAs | Done |
| Q4 | **Component list**: V1 (33 rows, from the deployed Vibgyor site) is approved. **V2 (21 rows, Konkani planner) is deferred**: it needs refinement and will be added later. See docs/components.md | V1 done; V2 later |
| Q5 | ~~Primary colour~~ **RESOLVED**: blue is the default action colour | Done |
| Q6 | Info shares blue with primary per the decision; should info use a distinct step or tint to tell it apart from primary actions? | Before semantic mapping |
| Q7 | ~~Licence~~ **RESOLVED**: MIT. Public repository name still to be chosen | Done (name later) |
| Q8 | Name availability, checked read-only on 2026-10-30: GitHub `shamallya` is not taken (HTTP 404); `@shamallya-ui/tokens` does not exist on the npm registry (404), but the npm website blocked automated lookups (403), so scope ownership is unconfirmed; domains shamallya.com, .dev, .io, .design and .in returned NXDOMAIN (no DNS records, likely unregistered; a registrar search is needed to be sure). Nothing was registered. Shamala to claim names | Before public launch |
| Q9 | ~~Icon set~~ **RESOLVED**: Lucide (ADR-0008) | Done |
| Q10 | ~~Dark surfaces~~ **RESOLVED**: warm black #1C1917 | Done |
| Q11 | Browser baseline. **Recommended**: last 2 versions of Chrome, Edge, Firefox and Safari, plus iOS Safari 16.4 or later (matches what Tailwind 4 and Svelte 5 tooling expect and covers installed PWAs on iPhone). **CONFIRMED by Shamala 2026-10-30** | Done |
| Q12 | Second demo theme. **Recommended**: yes, one alternative theme (a cooler slate-and-teal look) built in Phase 3 to prove that a theme swap changes only brand-level values (SC-5). **CONFIRMED by Shamala 2026-10-30** | Done |
| Q13 | Vibgyor timing. **Recommended**: tokens first (Phase 2, CSS variables work in Vibgyor today without any migration, since it already uses Tailwind and Vite); then Svelte 5 components screen by screen in Phase 3, starting with the Daily Diary views that are already Svelte (`DailyView`, `PeriodsTable`, `HomeworkList`). **CONFIRMED by Shamala 2026-10-30** | Done |
| Q14 | ~~Dark-mode text lift~~ **RESOLVED**: lifted colours for fills; lighter text steps #7A9AF4, #E8794A, #8DB84F for text (architecture 9.5) | Done |

Resolved: hex values, logo, typography, icons, licence (MIT), V1 components. Deferred: V2 components. Confirmed 2026-10-30: browser baseline (Q11), demo theme (Q12), Vibgyor timing (Q13), self-hosted fonts (self-host as WOFF2, subsetted, no Google Fonts requests at runtime; fits offline PWAs and Vibgyor's no-tracking stance). Still to do: name availability for the npm scope, GitHub organisation and domain (Q8), public repo name, logo export in Phase 2 (SVG master plus PNG 16, 32, 180, 192, 512 and maskable).

## 10. Phasing (summary)

| Phase | Output |
|-------|--------|
| 1 | Documentation (this set) |
| 2 | Token source and build pipeline, CSS and Tailwind outputs |
| 3 | Component layer for Svelte 5 and React, showcase site |
| 4 | Adoption in Vibgyor and a second app, governance in practice, case study |
| Later | Lit web components, extra platform outputs |

## 11. Testing Matrix pointer

See [testing-matrix.md](testing-matrix.md).

## 12. Documentation Updates

This PRD feeds README.md, architecture.md, testing-matrix.md, ideas.md and the ADRs. Any change to a requirement ID must be reflected in the testing matrix.

## 13. Suggested ideas

See [ideas.md](ideas.md) for the full list (brand ink with accent hierarchy, accent-hue limit, colour-blind-safe status, governance, density scale, theme switcher, one-page brand guide, case-study outline).

## Update 2026-10-30: npm scope

The npm organisation `shamallya` was unavailable, so Shamala created `shamallya-ui`. Packages: `@shamallya-ui/tokens` and `@shamallya-ui/components`. The token namespace stays `shamallya.` (ADR-0005).
