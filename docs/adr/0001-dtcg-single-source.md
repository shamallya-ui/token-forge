# ADR-0001: DTCG tokens as the single source of truth

- Status: Proposed (for Shamala's approval)
- Date: 2026-10-30

## Context
Apps use different stacks. Values hand-copied between CSS, Tailwind config and design files drift. A vendor-neutral, standard format is needed that tools can read.

## Decision
All design tokens are authored in the W3C Design Tokens Community Group (DTCG) JSON format. Nothing else is hand-edited; every output is generated.

## Alternatives considered
| Option | Why not |
|--------|---------|
| CSS variables as source | Not stack-agnostic; loses metadata and types |
| Tailwind config as source | Ties the system to one framework |
| Design tool as source | Vendor lock-in; conflicts with ADR-0003 |
| Custom JSON format | No ecosystem; extra maintenance |

## Consequences
- Positive: portable, typed, tool-supported, resume-worthy standard.
- Negative: the spec is still evolving; tool support varies. Mitigation: pin tool versions and isolate in the build step.
- Naming, tiers and references are validated against this format (testing-matrix section 2).
