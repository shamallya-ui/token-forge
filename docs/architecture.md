# Token Forge: Architecture Blueprint

Version 0.1 (Phase 1) · Brand: ShaMallya · Namespace: `shamallya.` · Companion to [PRD.md](PRD.md)

Base hex values were decided by Shamala (palette direction B, "warm editorial"; section 9.5 and ADR-0007). Contrast figures are targets unless stated as computed ratios. No source code appears in this document; structures are described in tables and prose.

## 1. Overview

A single DTCG-format token source is transformed by a build pipeline into per-platform outputs, consumed by the component layer (React and Svelte 5) and by any app directly. A showcase site documents and demonstrates everything.

| Layer | Responsibility | Package / location |
|-------|----------------|--------------------|
| Source | Authoring of tokens (W3C DTCG JSON) | `tokens/` in the repo |
| Build | Validate, transform, emit | Style Dictionary pipeline |
| Distribution | Ready-to-use outputs | `@shamallya-ui/tokens` |
| Components | Accessible UI built on tokens | `@shamallya-ui/components` |
| Showcase | Docs, live theming, visual tests | Storybook (or similar) on GitHub Pages |

## 2. Token tiers

| Tier | Purpose | Example (described, not coded) | Who uses it |
|------|---------|--------------------------------|-------------|
| Primitive | Raw values with no meaning | A blue at step 600; a 16-unit spacing step | Only referenced by semantic tokens |
| Semantic | Meaning and intent, theme-aware | "primary default background"; "text on surface" | Apps and components |
| Component | Per-component decisions | "button primary background" | Component implementations only |

Rules:
1. Apps reference semantic tokens only. Primitives are never used directly in app code.
2. Semantic tokens reference primitives; component tokens reference semantic tokens (and, rarely, primitives for non-themed values such as a fixed radius).
3. Light/dark and brand-theme differences exist only at the semantic tier (by re-pointing to different primitives). Components do not branch on mode.
4. A reference never points upward (primitive never references semantic).
5. Tokens lead and apps follow: where an app's existing colours differ from the tokens, the app changes to the tokens, not the reverse.

## 3. Token categories

| Category | Primitive content | Semantic examples | Notes |
|----------|-------------------|-------------------|-------|
| Colour | Hue ramps 50-950 (red, yellow, blue, green), neutral ramp derived from black | primary, danger, warning, info, success, surface, text, border, focus | Section 9 |
| Typography | Font families, sizes, weights, line heights, letter spacing | heading, body, caption, code | Families TBD (PRD Q3) |
| Spacing | Base-unit scale (proposal: 4-unit base, steps 0 to 96) | inset, stack, gap, section | Density modes later (ideas.md) |
| Radius | none, small, medium, large, full | control, card, pill | |
| Shadow | Elevation levels 0 to 5 | raised, overlay, modal | Dark mode favours borders and lighter surfaces over heavy shadow |
| Motion | Durations (instant to slow), easing curves | transition-fast, enter, exit | Must honour reduced-motion preference |
| Z-index | Named layers | base, dropdown, sticky, overlay, modal, toast | Gaps between layers to allow insertion |

## 4. Naming convention

Pattern: `shamallya.<tier>.<category>.<group>.<item>.<state-or-step>`, all lowercase, dot-separated in the source, hyphen-joined for CSS variable names.

| Rule | Detail |
|------|--------|
| Namespace | Always starts with `shamallya.` |
| Tier segment | `primitive`, `semantic`, or `component` immediately after the namespace |
| Category segment | `color`, `font`, `space`, `radius`, `shadow`, `motion`, `z` |
| Case | Lowercase, kebab-case inside segments; no camelCase, no spaces |
| Steps | Colour steps are the numbers 50, 100, 200 to 900, 950 |
| States | `default`, `hover`, `active`, `disabled`, `focus`, `selected` |
| Forbidden words | Role names such as admin, broker, customer; any literal colour name in semantic or component tokens (use roles, not "blue") |
| Prefixed outputs | CSS variables take the namespace with hyphens; Tailwind keys follow the semantic names |
| Deprecated tokens | Keep name, flag as deprecated with replacement, remove only in a major version |

Illustrative names (descriptive): a primitive blue at step 600 is named under `shamallya.primitive.color.blue`; the main action background is under `shamallya.semantic.color.primary`; a button's background is under `shamallya.component.button`.

## 5. Theming

| Dimension | Mechanism | Rule |
|-----------|-----------|------|
| Mode (light/dark) | Two sets of semantic values selected by a mode attribute or the user's system preference | Every semantic token must exist in both modes (parity test) |
| Brand theme | A brand layer that supplies primitive hue ramps and font choices; ShaMallya is the default | Theme swap changes primitives and semantic mapping only; component tokens untouched |
| Density (later) | Spacing/size semantic set | Optional, see ideas.md |
| Contrast preference (later) | High-contrast semantic set | Optional |

Precedence: explicit user choice, then system preference, then brand default. Theme switching is by CSS variables, so no runtime JavaScript is required beyond toggling an attribute.

## 6. Build pipeline concept

| Stage | Input | Tool (free/open source) | Output |
|-------|-------|--------------------------|--------|
| 1. Author | Designer edits tokens | Text editor; optionally Penpot export | DTCG JSON files |
| 2. Validate | DTCG JSON | Schema and reference check; naming lint | Pass/fail report |
| 3. Transform | Validated tokens | Style Dictionary | Platform outputs |
| 4. Contrast check | Semantic colour pairs | Contrast checker script | Pass/fail against AA targets |
| 5. Package | Outputs | Package build | `@shamallya-ui/tokens` |
| 6. Publish | Package, showcase | CI to registry and GitHub Pages | Versioned release |

Outputs:

| Output | Consumer |
|--------|----------|
| CSS variables (light, dark, per-brand scopes) | Any web app |
| Tailwind preset | Tailwind-based apps and the component layer |
| JSON / JS module of resolved values | Tooling, tests |
| Other platforms (later) | iOS, Android, Flutter as needed |

Principles: the DTCG file is the only hand-edited source; outputs are never edited by hand; builds are deterministic; tool versions are pinned (see ADR-0001, ADR-0002).

## 7. Component-layer strategy

| Framework | Basis | Package | Notes |
|-----------|-------|---------|-------|
| React | shadcn/ui | `@shamallya-ui/components` (React entry) | Copy-in model, themed via semantic tokens |
| Svelte 5 | shadcn-svelte | `@shamallya-ui/components` (Svelte entry) | Needed for Vibgyor migration (ADR-0006) |
| Framework-neutral | Lit web components | Later, optional | Evaluate after React/Svelte stabilise |

Strategy: components consume only semantic and component tokens; behaviour and accessibility follow the underlying headless primitives; the React and Svelte variants share the same names, props semantics and token mapping.

The full prioritised list, drawn from Vibgyor and the Konkani Meal Planner, is in [components.md](components.md). Original proposed starter set (superseded by that list): button, input, textarea, select, checkbox, radio, switch, label and form field, card, badge/status tag, alert/banner, dialog, tooltip, tabs, toast, table, navigation bar, avatar, skeleton/loader.

## 8. Showcase site

| Aspect | Decision |
|--------|----------|
| Tool | Storybook or similar documentation tool (final choice in Phase 3) |
| Hosting | GitHub Pages |
| Content | Token tables, palette ramps with contrast ratios, component stories for both frameworks, usage guidelines, changelog |
| Interactivity | Live light/dark and brand-theme switcher; reduced-motion toggle |
| Testing hooks | Visual regression and accessibility checks run against stories |
| Brand | Logo and one-page brand guide (PRD Q2, ideas.md) |

## 9. Palette design

### 9.1 Roles

| Hue | Role | Semantic tokens fed |
|-----|------|--------------------|
| Black (warm, #1C1917) | Brand ink; the neutral ramp is derived from it; dark-mode background | text, surface, border |
| Blue | Interactive accent and information | primary, info, focus |
| Red | Danger and destructive | danger |
| Yellow | Warning and attention | warning |
| Green | Success | success |

### 9.2 Scale design

- Each chromatic hue has a 50-950 ramp (11 steps: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950).
- The neutral ramp (also 50-950) is derived from black, optionally with a very slight tint; no separate "grey" brand hue.
- Ramps are built perceptually so equal step differences look equal and so that steps 600+ pass text contrast on light surfaces and steps 300 and below pass on dark surfaces (blue, red, green; yellow is the exception, see below).
- Yellow is light by nature: use it as a fill with dark text on top (an "on-warning" token), not as text on white.
- Every filled semantic token has a paired "on-" token for the text/icon that sits on it.

### 9.3 Step usage guide

| Step | Typical use |
|------|-------------|
| 50-100 | Subtle backgrounds, tinted alerts |
| 200-300 | Borders, dividers (tinted), disabled fills |
| 400-500 | Mid emphasis, dark-mode text and icons |
| 600 | Default fills, light-mode text links, buttons |
| 700-800 | Hover and active states |
| 900-950 | Strong text, dark-mode surfaces |

### 9.4 Semantic mapping (light and dark)

| Semantic token | Light mode points to | Dark mode points to |
|----------------|---------------------|---------------------|
| surface.default | cream #FAF7F2 | warm black #1C1917 (neutral 950) |
| surface.raised | white | neutral 900 |
| surface.sunken | neutral 100 | black (neutral 950 or darker) |
| text.default | neutral 950 | neutral 50 |
| text.muted | neutral 700 | neutral 300 |
| text.disabled | neutral 400 | neutral 600 |
| border.default | neutral 300 | neutral 700 |
| border.strong | neutral 500 | neutral 500 |
| primary.default / hover / active | blue 600 / 700 / 800 | blue 500 / 400 / 300 |
| primary.on | white | neutral 950 |
| info.default / subtle | blue 600 / blue 50 | blue 400 / blue 950 |
| danger.default / subtle | red 600 / red 50 | red 400 / red 950 |
| warning.default / subtle | yellow 400 or 500 / yellow 50 | yellow 400 / yellow 950 |
| warning.on | neutral 950 | neutral 950 |
| success.default / subtle | green 700 / green 50 | green 400 / green 950 |
| focus.ring | blue 600 | blue 400 |

Base hex values are decided (section 9.5); the step-by-step mapping above remains a proposal until the ramps are generated and the contrast tests pass. Blue is the default action colour.

### 9.5 Decided palette: direction B, "warm editorial", revision 2 (ADR-0007)

Shamala chose direction B, then asked for the narrow-margin and failing pairs to be fixed. Revision 2 darkens red and green, keeps blue, and adds dedicated text-capable steps so every documented pair passes with margin. Values are the base anchors; full 50-950 ramps are generated in Phase 2.

| Hue | Base value | Revision | Role |
|-----|-----------|----------|------|
| Black (warm) | #1C1917 | unchanged | Brand ink, neutral base, dark-mode background |
| Blue | #1D4ED8 | unchanged | Primary (default action), info, links |
| Red | #B03608 | was #C2410C | Danger (brick-orange leaning, deeper) |
| Yellow (fill) | #EAB308 | unchanged | Warning and highlight fill; always with dark text |
| Yellow (text step, "ochre") | #854D0E | new | The only yellow-family colour allowed as text or icon on light surfaces |
| Green | #3F6B0B | was #4D7C0F | Success (olive leaning, deeper) |

Backgrounds: light mode soft cream #FAF7F2; dark mode warm black #1C1917.

Dark mode: fills use the colours lifted about 12% toward white (blue about #3863DD, red about #B94E26, green about #567D28); yellow fill is unchanged. Normal-size text and links use dedicated lighter text steps instead (the 12% lift alone is too dark for text):

| Hue | Dark-mode text step |
|-----|---------------------|
| Blue | #7A9AF4 |
| Red | #E8794A |
| Green | #8DB84F |
| Yellow | #EAB308 (the fill colour already passes) |

Computed contrast ratios (WCAG relative-luminance formula, calculated in this session; the Phase 2 contrast job remains the authoritative check). Policy: at least 5.5:1 for light-mode text, so there is margin above 4.5:1.

| Pair | Ratio | Verdict |
|------|-------|---------|
| Ink #1C1917 on cream #FAF7F2 | about 16.4:1 | Passes |
| Blue #1D4ED8 on cream | about 6.3:1 | Passes |
| White on blue | about 6.7:1 | Passes |
| Red #B03608 on cream | about 5.8:1 | Passes with margin (was 4.9) |
| White on red | about 6.2:1 | Passes |
| Green #3F6B0B on cream | about 5.9:1 | Passes with margin (was 4.7) |
| White on green | about 6.3:1 | Passes |
| Ink on yellow #EAB308 | about 9.1:1 | Passes |
| Ochre #854D0E on cream | about 6.4:1 | Passes (replaces yellow-as-text, was 1.8) |
| Ochre on subtle yellow tint #FEFCE8 | about 6.6:1 | Passes |
| Red on subtle tint #FDF1EC | about 5.6:1 | Passes |
| Green on subtle tint #F3F8E8 | about 5.9:1 | Passes |
| Yellow #EAB308 itself as text on cream | about 1.8:1 | Still forbidden; use ochre or put dark ink on a yellow fill |
| Dark text: blue #7A9AF4 on warm black | about 6.5:1 | Passes |
| Dark text: red #E8794A on warm black | about 6.1:1 | Passes |
| Dark text: green #8DB84F on warm black | about 7.6:1 | Passes |
| Dark text: yellow #EAB308 on warm black | about 9.1:1 | Passes |
| Dark fills (lifted) on warm black: blue, red, green | about 3.3, 3.5, 3.6:1 | Passes 3:1 for icons, borders and fills only |
| White on dark fills (lifted) blue, red, green | about 5.3, 5.0, 4.8:1 | Passes for button labels |
| Cream on blue, red, green fills | about 6.3, 5.8, 5.9:1 | Passes |

Result: no documented pair is below 4.5:1 for text, and no light-mode text pair is below 5.5:1. Closes the earlier open question Q14.

## 10. Accessibility targets

Standard: WCAG 2.2 AA. Thresholds: normal text 4.5:1; large text (18pt, or 14pt bold) 3:1; UI components, icons and focus indicators 3:1; disabled elements exempt but should stay discernible.

Target contrast matrix. The thresholds below are targets; computed ratios for the decided base values are in section 9.5, and the Phase 2 contrast job is the authoritative measurement.

| Foreground | Surface | Light-mode target | Dark-mode target |
|-----------|---------|-------------------|------------------|
| text.default | surface.default | 7:1 (AAA aim), min 4.5:1 | 7:1, min 4.5:1 |
| text.default | surface.raised | min 4.5:1 | min 4.5:1 |
| text.default | surface.sunken | min 4.5:1 | min 4.5:1 |
| text.muted | each surface | min 4.5:1 | min 4.5:1 |
| text.disabled | each surface | no minimum (documented exemption) | no minimum |
| primary.on | primary.default | min 4.5:1 | min 4.5:1 |
| primary.default as text/link | surface.default | min 4.5:1 | min 4.5:1 |
| danger as text | each surface | min 4.5:1 | min 4.5:1 |
| danger.on | danger.default | min 4.5:1 | min 4.5:1 |
| warning.on (dark ink) | warning.default | min 4.5:1 | min 4.5:1 |
| warning as text | light surfaces | not allowed as text on light surfaces (yellow on cream is about 1.8:1); use ochre #854D0E (about 6.4:1) or dark ink on a yellow fill | min 4.5:1 (yellow about 9.1:1 computed) |
| success as text | each surface | min 4.5:1 (use a deeper step) | min 4.5:1 |
| info as text | each surface | min 4.5:1 | min 4.5:1 |
| text on any subtle (tinted) fill | its subtle fill | min 4.5:1 | min 4.5:1 |
| border.default | surface | min 3:1 where the border is the sole boundary of a control | min 3:1 |
| focus.ring | adjacent surfaces | min 3:1 | min 3:1 |
| Status icons | surface | min 3:1 | min 3:1 |

Non-colour rule: any status meaning (especially red versus green) must also be expressed with an icon and a text label.

## 11. Repository and package layout

| Path / package | Contents |
|----------------|----------|
| `tokens/` | DTCG source files split by tier and category; brand-theme folders |
| `build/` | Pipeline configuration, naming lint rules, contrast check configuration |
| `packages/tokens` → `@shamallya-ui/tokens` | Built outputs: CSS variables, Tailwind preset, resolved values |
| `packages/ui` → `@shamallya-ui/components` | Component layer with React and Svelte 5 entries |
| `apps/showcase` | Storybook (or similar) site |
| `docs/` | PRD, architecture, testing matrix, ideas, ADRs |
| `.github/` | CI workflows, issue templates |
| Root | README, licence, changelog, contributing guide |

The repo is a single monorepo (workspace manager TBD, free/open source).

## 12. End-to-end flow

Sequence of a token change:

| Step | Actor | Action | Result |
|------|-------|--------|--------|
| 1 | Shamala | Edits a token in the DTCG source (or exports from Penpot) | Source changed |
| 2 | CI | Validates against DTCG and naming lint | Fail fast on error |
| 3 | CI | Style Dictionary transforms | CSS, Tailwind, other outputs |
| 4 | CI | Contrast and light/dark parity checks | AA pass/fail |
| 5 | CI | Builds showcase, runs visual regression and cross-framework rendering tests | Reports |
| 6 | Shamala | Reviews diffs; adds changelog entry; chooses semver bump | Release decision |
| 7 | CI | Publishes `@shamallya-ui/tokens`, `@shamallya-ui/components`, deploys showcase to GitHub Pages | Released |
| 8 | App developer | Upgrades the package; reads the changelog and deprecation notes | App updated |

Consumption flow:

| Source | → | Output | → | Consumer |
|--------|---|--------|---|----------|
| DTCG tokens | → | CSS variables | → | Any app, shadcn/ui, shadcn-svelte |
| DTCG tokens | → | Tailwind preset | → | Tailwind apps and components |
| DTCG tokens | → | Other platforms (later) | → | Native/other targets |

## 13. Governance summary

Semver for the packages (breaking token rename/removal is a major); changelog on every release; deprecations announced one minor version ahead and removed only in a major. Details in [ideas.md](ideas.md).

## 14. Architectural decisions

| ADR | Decision |
|-----|----------|
| [0001](adr/0001-dtcg-single-source.md) | DTCG tokens as the single source |
| [0002](adr/0002-style-dictionary-transformer.md) | Style Dictionary as the transformer |
| [0003](adr/0003-free-open-source-tools-only.md) | Free and open-source tools only |
| [0004](adr/0004-no-third-party-palette.md) | No third-party palette |
| [0005](adr/0005-brand-name-shamallya.md) | Brand name ShaMallya |
| [0006](adr/0006-svelte-5-first-class.md) | Svelte 5 is first-class |
| [0007](adr/0007-palette-warm-editorial.md) | Palette direction B, warm editorial |
| [0008](adr/0008-lucide-icons-and-tag-colours.md) | Lucide icons; coloured or neutral tags |

## 15. Testing and Documentation Updates

Testing: [testing-matrix.md](testing-matrix.md). Any change to naming, tiers or palette roles must update this document, the matrix and the relevant ADR.
