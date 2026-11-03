# ADR-0010: shadcn as owned source, delivered by registry, mapped to tokens

- Status: Accepted (Shamala, 2026-11-03: "go with the recommendation")
- Date: 2026-11-03

## Context
The first React consumer is the Konkani Meal Planner. shadcn/ui copies component source into the consuming repo and builds on Radix, which supplies keyboard and screen-reader behaviour. ADR-0006 and the PRD already name shadcn (React) and shadcn-svelte.

## Decision
1. Start from shadcn primitives and own the result.
2. One mapping file connects shadcn's variable names (background, foreground, primary, ring and so on) to our semantic tokens. Component files never hold colour, radius or size values.
3. Deliver as a **shadcn-compatible registry** published from the components project, so an app adds a component with the shadcn CLI. Revisit an npm package once component APIs settle.
4. React leads for components now; the Svelte 5 components stay planned and follow the same specs (ADR-0006 is not withdrawn).
5. Components that exist only for one app stay in that app until a second app needs them.

## Consequences
- Accessibility behaviour comes from Radix; the project owns visual correctness, tokens and tests.
- Updating shadcn upstream is a manual merge; the registry records which upstream version each component started from.
