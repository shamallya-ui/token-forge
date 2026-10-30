# ADR-0006: Svelte 5 is a first-class target (React-only rejected)

- Status: Proposed
- Date: 2026-10-30

## Context
Shamala's Vibgyor class-updates project is migrating to Svelte 5. A React-only component library would not serve it, and the aim is one look and feel across all her apps.

## Decision
The component layer supports React (shadcn/ui basis) and Svelte 5 (shadcn-svelte basis) with equal standing, sharing the same tokens, component names and behaviour. Lit web components are a possible later, framework-neutral addition.

## Alternatives considered
| Option | Why not |
|--------|---------|
| React only | Does not fit Vibgyor |
| Lit web components only | Heavier integration with existing shadcn-style workflows; evaluate later |
| Tokens only, no components | Misses the "consistent look and feel" and portfolio goals |

## Consequences
- Cross-framework rendering tests are mandatory (testing-matrix section 8).
- Higher maintenance cost; keep the starter component list small.
- Vibgyor is the first real adopter (PRD SC-1).
