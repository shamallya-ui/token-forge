# ADR-0007: Palette direction B, "warm editorial"

- Status: Accepted (decided by Shamala); revision 2 on 2026-10-30 fixes contrast
- Date: 2026-10-30

## Context
The brand hues are black, blue, red, yellow and green. Three palette directions were explored: A "clean ink", B "warm editorial" and C "bold primary". A choice was needed before ramps, semantic mapping and contrast tests could be built. It must remain independent of any third-party palette (ADR-0004).

## Decision
Adopt direction B.

| Hue | Base (500-level) | Role |
|-----|------------------|------|
| Black (warm) | #1C1917 | Brand ink, neutral base, dark-mode background |
| Blue | #1D4ED8 | Primary (default action colour), info, links |
| Red | #B03608 (rev 1: #C2410C) | Danger (brick-orange leaning, deeper) |
| Yellow | #EAB308 | Warning, highlight; always paired with dark text |
| Green | #3F6B0B (rev 1: #4D7C0F) | Success (olive leaning, deeper) |
| Yellow text step | #854D0E (new) | Ochre, the only yellow-family text/icon colour on light surfaces |

- Light-mode page background: soft cream #FAF7F2.
- Dark-mode page background: warm black #1C1917.
- Dark mode lifts blue, red and green about 12% toward white; yellow is not lifted.
- Red/green status always uses an icon or label, never colour alone.

## Alternatives considered
| Option | Why not chosen |
|--------|----------------|
| A, "clean ink" | Not chosen by Shamala. Rationale and values for A were not supplied to this documentation session; add them here if wanted |
| C, "bold primary" | Not chosen by Shamala. Likely trade-off: saturated primaries make five hues compete, which the accent-hierarchy idea (ideas.md) tries to avoid. Confirm and add values if wanted |

## Consequences
- Revision 2 (Shamala asked to fix narrow and failing pairs): red darkened to #B03608 (about 5.8:1 on cream, was 4.9) and green to #3F6B0B (about 5.9:1, was 4.7); the policy is at least 5.5:1 for light-mode text.
- Yellow #EAB308 on cream is about 1.8:1, so yellow is never text; ochre #854D0E (about 6.4:1) is the text step, and yellow fills carry dark ink (about 9.1:1).
- Dark mode: lifted (about 12%) colours are for fills, icons and borders (about 3.3 to 3.6:1); text uses #7A9AF4, #E8794A, #8DB84F (about 6.5, 6.1, 7.6:1). Closes PRD Q14.
- Ratios are computed in prose in architecture 9.5; the Phase 2 contrast job is authoritative.
- Neutrals are warm, derived from #1C1917.
- Supersedes the earlier proposal-only hex candidates.
