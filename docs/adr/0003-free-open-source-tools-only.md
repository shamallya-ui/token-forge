# ADR-0003: Free and open-source tools only

- Status: Proposed
- Date: 2026-10-30

## Context
Token Forge is a free, open-source project and a public portfolio piece. Anyone, including adopting companies, must be able to reproduce the toolchain without paying.

## Decision
Every tool in the authoring, build, test, documentation and hosting chain must be free to use for an open-source project and, where practical, itself open source. If a design tool is needed, use Penpot rather than Figma.

## Consequences
- Positive: zero cost, no vendor lock-in, easy contribution.
- Negative: fewer polished integrations; Penpot's token support is less mature, so the DTCG files remain the source (ADR-0001) and design tools only consume or export them.
- Hosting uses GitHub Pages and free CI tiers; reassess if limits are hit.
- New tools must be checked against this ADR before adoption.
