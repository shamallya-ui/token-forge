# ADR-0002: Style Dictionary as the transformer

- Status: Proposed
- Date: 2026-10-30

## Context
The DTCG source (ADR-0001) must become CSS variables, a Tailwind preset and later other platform formats, deterministically and for free.

## Decision
Use Style Dictionary (open source) as the transformation engine, with custom transforms and formats for the `shamallya.` naming and the Tailwind preset.

## Alternatives considered
| Option | Why not |
|--------|---------|
| Hand-written scripts | More maintenance; no multi-platform ecosystem |
| Commercial token platforms | Violates ADR-0003 |
| Other open-source transformers | Smaller ecosystem and platform coverage |

## Consequences
- Positive: mature, multi-platform, extensible, widely recognised.
- Negative: DTCG support evolves between versions; pin the version and cover with parity tests (testing-matrix section 7).
- Revisit if DTCG support or maintenance degrades.
