# ADR-0004: No third-party palette

- Status: Accepted
- Date: 2026-10-30

## Context
Token Forge is Shamala's own independent project and a public portfolio piece. It must not carry the colours or role vocabulary of any employer, client or other organisation.

## Decision
Token Forge never uses a third-party or employer colour scheme, nor organisation-specific role names. The brand palette is Shamala's own: black, red, yellow, blue, green (see ADR-0007). Naming uses neutral roles (primary, danger, warning, info, success, surface, text, border).

## Consequences
- Avoids confusion over ownership and any intellectual-property or confidentiality concern.
- A naming lint rule rejects forbidden role words in token names (testing-matrix N-08).
- Palette values are chosen fresh; contributors must not copy values from client work.
