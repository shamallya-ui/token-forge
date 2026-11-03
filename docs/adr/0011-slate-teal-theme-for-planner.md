# ADR-0011: Slate-teal as the second theme, for the Konkani Meal Planner

- Status: Accepted (Shamala, 2026-11-03: "go with the recommendation")
- Date: 2026-11-03

## Context
The planner's design uses slate neutrals and a teal primary (light `#115e59`, dark `#5eead4`). The architecture already planned one demo theme to prove that a brand swap changes no component tokens (FR-08, tests B-01 to B-05).

## Decision
The planner's look becomes the `slate-teal` theme: brand-level overrides only (neutral ramp, primary hue, canvas and surface values). Components are unchanged. The theme is built and contrast-tested by the same job as the default theme, in both modes. The planner's current hex values are the starting point, not final; any pair that fails the job is adjusted.

## Consequences
- The planner proves the theming claim with a real app.
- Two themes now ship, so the theme-swap tests (B-series) become automated work.
- The planner must not hard-code its hex values after adopting the theme.
