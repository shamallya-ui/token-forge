# Token Forge: Testing Matrix

Version 0.1 · Maps [PRD.md](PRD.md) requirements to QA criteria. Brand: ShaMallya · Namespace: `shamallya.`

Test levels: **U** = unit, **I** = integration, **E** = end-to-end, **V** = visual, **A** = accessibility, **L** = lint/static.

## 1. Requirement to test-area map

| Requirement | Test area | Level | Section |
|-------------|-----------|-------|---------|
| FR-01, FR-02, FR-03 | DTCG validity and tier rules | L, U | 2 |
| FR-04 | Naming-rule linting | L | 3 |
| FR-05, FR-06, NFR-01 | WCAG AA contrast | A, U | 4 |
| FR-07 | Dark/light parity | U, V | 5 |
| FR-08 | Brand-theme swap | I, V | 6 |
| FR-09, NFR-04 | Build output parity across stacks | I | 7 |
| FR-11, FR-13 | Cross-framework rendering consistency | E, V | 8 |
| FR-13, FR-14 | Visual regression and non-colour status | V, A | 9 |
| FR-15 | Governance and versioning | I | 10 |

## 2. Token validity against the DTCG format

| ID | Case | Type | Input | Expected |
|----|------|------|-------|----------|
| T-01 | Valid colour, dimension, duration, font tokens | Happy | Well-formed source | Validation passes |
| T-02 | Valid alias references across tiers | Happy | Semantic refers to primitive | Resolves to the primitive's value |
| T-03 | Token with no value | Negative | Missing value | Fails with the token path named |
| T-04 | Unknown or mismatched type | Negative | Colour token with a dimension value | Fails |
| T-05 | Reference to a non-existent token | Negative | Broken alias | Fails, names missing target |
| T-06 | Circular reference | Negative | A refers to B refers to A | Fails with cycle path |
| T-07 | Upward reference (primitive refers to semantic) | Negative | Tier violation | Fails |
| T-08 | Deepest allowed alias chain | Boundary | Chain at the documented maximum depth | Resolves; one deeper fails |
| T-09 | Empty source group | Boundary | Group with no tokens | Warning, not failure |
| T-10 | Colour at extremes | Boundary | Pure black, pure white, fully transparent | Accepted and preserved |
| T-11 | Duplicate token path | Negative | Same name defined twice | Fails |
| T-12 | Unsupported colour format | Negative | Malformed colour string | Fails |

## 3. Naming-rule linting

| ID | Case | Type | Expected |
|----|------|------|----------|
| N-01 | Name starts with `shamallya.`, valid tier, lowercase kebab segments | Happy | Passes |
| N-02 | Every category present (colour, typography, spacing, radius, shadow, motion, z-index) uses its documented segment | Happy | Passes |
| N-03 | Missing namespace | Negative | Fails |
| N-04 | Misspelt namespace (for example a single l) | Negative | Fails with suggestion |
| N-05 | Uppercase, spaces or camelCase in a segment | Negative | Fails |
| N-06 | Missing or unknown tier segment | Negative | Fails |
| N-07 | Literal colour word (such as blue) in a semantic or component name | Negative | Fails |
| N-08 | Forbidden organisation-specific role words (for example admin, broker, customer) in a token name | Negative | Fails; app content such as a tag label "Admin" is not a token name and is allowed |
| N-09 | Colour step outside the allowed list (for example 650) | Negative | Fails |
| N-10 | Longest permitted name length | Boundary | Passes; one segment more fails |
| N-11 | Generated CSS variable names match name-to-variable rule | Happy | Passes |
| N-12 | Deprecated token without a replacement note | Negative | Fails |

## 4. WCAG AA contrast checks

Pairs come from architecture.md section 10; each pair is tested in light and dark.

| ID | Case | Type | Expected |
|----|------|------|----------|
| C-01 | text.default on every surface | Happy | At least 4.5:1 (7:1 aim) |
| C-02 | text.muted on every surface | Happy | At least 4.5:1 |
| C-03 | Every "on-" token on its fill (primary, danger, warning, success, info) | Happy | At least 4.5:1 |
| C-04 | Semantic colour used as text (primary, danger, success, info) on surfaces | Happy | At least 4.5:1 |
| C-05 | Border and focus ring against adjacent surface | Happy | At least 3:1 |
| C-06 | Large-text pairs | Boundary | At least 3:1 where explicitly allowed as large text |
| C-07 | A pair at exactly 4.5:1 | Boundary | Passes |
| C-08 | A pair at 4.49:1 | Boundary | Fails (no rounding up) |
| C-09 | Yellow/warning used as text on a light surface | Negative | Rejected by rule |
| C-10 | Text on subtle (tinted) fills | Happy | At least 4.5:1 |
| C-11 | Hover, active, disabled variants of primary | Happy | Enabled states pass; disabled exempt but documented |
| C-12 | Brand-theme swap with a low-contrast palette | Negative | Contrast job fails the theme |
| C-13 | Report lists measured ratio for every pair | Happy | Report present and published in the showcase |
| C-14 | Decided base values: ink #1C1917 on cream #FAF7F2, white on #1D4ED8, white on #B03608, white on #3F6B0B, ink on #EAB308 | Happy | Each at least 4.5:1 (computed in architecture 9.5: about 16.4, 6.7, 6.2, 6.3, 9.1) |
| C-15 | Yellow #EAB308 as text on cream | Negative | Rejected (about 1.8:1); ochre #854D0E (about 6.4:1) is the allowed text step |
| C-16 | Dark mode: lifted fill colours (blue, red, green) used as normal-size text on #1C1917 | Negative | Rejected (about 3.3, 3.5, 3.6:1); dark text steps #7A9AF4, #E8794A, #8DB84F must be used (about 6.5, 6.1, 7.6:1) |
| C-17 | Dark mode: lifted blue, red, green as icons, borders and fills on #1C1917 | Boundary | At least 3:1 |
| C-18 | Red #B03608 and green #3F6B0B as text on cream | Boundary | At least 5.5:1 policy (computed about 5.8, 5.9:1); any change to the cream or hues must be re-tested |
| C-19 | Red/green status shown without icon or label | Negative | Rejected by component lint and review |

## 5. Dark/light parity

| ID | Case | Type | Expected |
|----|------|------|----------|
| P-01 | Every semantic token has both a light and a dark value | Happy | No gaps |
| P-02 | Token present in only one mode | Negative | Fails with token name |
| P-03 | Same set of component tokens resolve in both modes | Happy | Passes |
| P-04 | Mode precedence: user choice, then system, then default | Happy | Matches documented order |
| P-05 | System preference changes while the page is open | Boundary | Theme updates when no explicit choice set |
| P-06 | Explicit choice overrides system preference | Boundary | Explicit choice wins |
| P-07 | Screenshot pairs of each component in both modes | Happy | Layout identical; only colour differs |
| P-08 | Dark value accidentally equals light value for a text/surface token | Negative | Flagged for review |

## 6. Brand-theme swap

| ID | Case | Type | Expected |
|----|------|------|----------|
| B-01 | Default ShaMallya theme builds | Happy | Passes |
| B-02 | Second demo theme changes only brand-level values | Happy | No component token changes needed |
| B-03 | Theme missing a required hue ramp | Negative | Fails |
| B-04 | Theme with only 10 of 11 steps | Boundary | Fails |
| B-05 | Two themes active at once in nested scopes | Boundary | Inner scope wins |

## 7. Build output parity across stacks

| ID | Case | Type | Expected |
|----|------|------|----------|
| O-01 | CSS variable values equal resolved source values | Happy | Zero mismatches |
| O-02 | Tailwind preset values equal resolved source values | Happy | Zero mismatches |
| O-03 | Every source token appears in every enabled output | Happy | No missing tokens |
| O-04 | No output contains a token absent from the source | Negative | Fails on stray tokens |
| O-05 | Build run twice on the same input | Happy | Byte-identical (NFR-04) |
| O-06 | Alias chains collapse to the same final value in all outputs | Happy | Identical |
| O-07 | Output for an extra platform (when added) matches the reference values | Happy | Within platform-format tolerance |
| O-08 | Colour format conversion (for example to platform-specific colour spaces) | Boundary | Round-trip difference within an agreed tolerance |
| O-09 | Build with an invalid source | Negative | No outputs written |
| O-10 | Package contents contain only intended files | Happy | Matches the allow list |

## 8. Cross-framework rendering consistency

| ID | Case | Type | Expected |
|----|------|------|----------|
| X-01 | Each starter component rendered in React and Svelte 5 | Happy | Pixel difference within tolerance |
| X-02 | Same component in every state (default, hover, focus, active, disabled) | Happy | Consistent across frameworks |
| X-03 | Component using a token that does not exist | Negative | Build or lint fails |
| X-04 | Hard-coded colour or spacing value in a component | Negative | Lint fails |
| X-05 | Smallest and largest supported viewport | Boundary | No overflow or clipped content |
| X-06 | Long text and very short text in a component | Boundary | Layout holds |
| X-07 | Right-to-left text direction (if supported) | Boundary | Mirrors correctly |
| X-08 | Reduced-motion preference | Happy | Motion tokens collapse to near-instant |
| X-09 | Keyboard operation and focus order | Happy | Same behaviour in both frameworks |
| X-10 | Accessible names and roles | Happy | Same in both frameworks |
| X-11 | Vibgyor screen themed with only semantic tokens | E2E | Renders as designed in light and dark |

## 9. Visual regression and non-colour status

| ID | Case | Type | Expected |
|----|------|------|----------|
| V-01 | Baseline snapshots of all stories, both modes, default theme | Happy | Approved baseline stored |
| V-02 | Unintended token change | Negative | Snapshot diff flags it |
| V-03 | Intended token change | Happy | Diff reviewed; baseline updated with changelog entry |
| V-04 | Sub-pixel anti-aliasing noise | Boundary | Within tolerance, no false failure |
| V-05 | Status components (danger, warning, success, info) | Happy | Each shows an icon and a text label as well as colour |
| V-06 | Status components rendered in greyscale | Negative | Still distinguishable by icon and label |
| V-07 | Simulated red-green colour blindness | Negative | Danger and success still distinguishable |
| V-08 | Accent-hue limit per screen (see ideas.md) | Happy | Showcase example screens respect the rule |

## 10. Governance and release

| ID | Case | Type | Expected |
|----|------|------|----------|
| G-01 | Release has a semver bump and changelog entry | Happy | CI requires both |
| G-02 | Token removed without a major bump | Negative | CI fails |
| G-03 | Token rename without a deprecation alias | Negative | CI fails |
| G-04 | Deprecated token still resolves with a warning | Happy | Resolves; warning emitted |
| G-05 | Dependency version drift in pipeline | Negative | Lock file enforced |
| G-06 | Showcase deploys from a tagged release | Happy | Live site matches release |

## 11. Entry and exit criteria

Entry: source validates; naming lint passes. Exit for a release: all Must-level cases above pass, contrast report published, no unexplained visual diffs, changelog present.

## 12. Documentation Updates

When a requirement ID in the PRD changes, update the map in section 1 and the affected cases. New tokens categories require new naming cases.
