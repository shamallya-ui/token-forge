# ADR-0009: Comfortable touch mode as a token set

- Status: Accepted (Shamala, 2026-11-03: "go with the recommendation")
- Date: 2026-11-03

## Context
The Konkani Meal Planner requires a 15 px type floor, 56 px buttons, 48 px icon targets, reading sizes of 17 to 19 px, and no opacity-based de-emphasis. Its inventory found that the gallery's density setting undershoots all of these. The same needs would apply to any app for older or one-handed users.

## Decision
1. Add a **comfortable mode**: a token set that raises control height, minimum target, type floor and reading sizes. Components read these tokens; they never carry their own overrides. The mode is selected by an attribute on a container, so it can apply to a whole app or one region, in the same way as the dark-mode attribute.
2. Add `surface.canvas` (page behind cards) and `border.subtle` (separators in cards). A background token must never be used for a border.
3. Add a display type size (the 60 px page numeral) and one pushed-screen title size (28 px, decided by the planner).
4. Rules baked into the component spec: no disabled-by-opacity state (an action is absent, or replaced by an inert reason block); nested radius is the container radius minus its border width.

## Implementation status

Implemented in `@shamallya-ui/tokens` 0.3.0 as `semantic.size.*` selected by `data-density="comfortable"`.

## Consequences
- 0.3.0 adds tokens, and contrast pairs for canvas and subtle border are added to the job (both modes).
- Target-size and type-floor checks join the test matrix (see testing-matrix section 14).
- Vibgyor and the portfolio are unaffected unless they opt in.
