# ShaMallya: Logo and Typography Options

Status: options for Shamala to choose from (PRD Q2 and Q3). Mocks live on a private design canvas: https://claude.ai/artifact/TQHgJGkaP1PYQNFLrhVxF6 (only the owner can open it until shared from the page's Share menu).

Palette used in all mocks: warm black #1C1917, blue #1D4ED8, red #B03608, yellow #EAB308, green #3F6B0B, on cream #FAF7F2 (architecture section 9.5).

## Decision (Shamala's answers, 2026-10-30)

| # | Topic | Decision |
|---|-------|----------|
| 1 | Colour | The colour strip is part of the logo and is never removed; no stripped single-colour version is made |
| 2 | Minimum size | Full tile (SM plus strip) down to 24 px; 16 px favicon uses an "S only" cut with the strip kept. Common UI sizes covered: 16 and 32 favicon, 24 to 48 in headers and nav, 180 Apple touch, 192 and 512 PWA |
| 3 | Clear space | Proposed and adopted unless changed: 25% of the tile width on every side |
| 4 | Lockups | The logo is the tile only. The title lockup used for page titles and the showcase header is concept 5 in full (lattice S plus "ShaMallya" wordmark). "Token Forge" does not appear in either lockup; it is a working/project name used in docs |
| 5 | Wordmark | Claude decided: set in Fraunces, fixed as a brand asset regardless of the UI type pairing; exported as outlines in logo files, live Fraunces text in app UI where used |
| 6 | Dark mode | Cream tile with black initials; strip unchanged |
| 7 | Strip colours | Four hues: blue, red, yellow, green |
| 8 | Production | Made by the design agent on the design canvas (brand sheet artboard); export of vector and PNG icon sizes follows in Phase 2 |
| 9 | Name check | Confirmed to proceed; availability check of npm scope, GitHub organisation and domain still to be done |
| 10 | Accessibility | Accessible name "ShaMallya" for the logo; decorative when beside the wordmark |

Note: the tile uses "SM" and the title lockup uses an "S" lattice; they are two marks for two jobs. Keep them apart in guidance to avoid a mixed lockup.

**Type pairing A is confirmed by Shamala: Fraunces (headings), Inter (body and UI), JetBrains Mono (code and token names).** Kannada script, when needed, uses Noto Sans Kannada.

## Logo concepts

| # | Name | Idea | Strengths | Watch-outs |
|---|------|------|-----------|------------|
| 1 | Wordmark with token dots | Serif "ShaMallya" with four colour dots | Simple, editorial, works large | Dots shrink poorly in tiny sizes |
| 2 | SM monogram tile | Black rounded tile with "SM" and a hue strip | App-icon and favicon ready | Initials only, less distinctive |
| 3 | Five-facet token | Pentagon split into five facets, one per hue | Shows the five-hue system and the "token" idea | Facets need a minimum size to read |
| 4 | Bars that spell M | Five bars of different heights form an M | Modern, scalable, reads as data | Resembles a bar chart; M recognition depends on bar order |
| 5 | Dot lattice | A line through a 3x3 dot lattice forms an S, kolam-inspired | Personal, memorable | Most complex; test at small sizes |

Design rules to confirm: single-colour (black and white) versions must exist; minimum size; clear space; no yellow text on cream (use the ink or ochre); the mark must not rely on colour alone to be understood.

## Typography pairings (all SIL OFL, free)

| Option | Heading | Body and UI | Mono | Character |
|--------|---------|-------------|------|-----------|
| A | Fraunces | Inter | JetBrains Mono | Warm editorial, strong small-size legibility (recommended) |
| B | Newsreader | Source Sans 3 | IBM Plex Mono | Bookish, reading-first, good for recipes and diaries |
| C | DM Serif Display | DM Sans | DM Mono | Friendly, high-contrast display |

Kannada script (Konkani planner Phase 6): pair with Noto Sans Kannada or Noto Serif Kannada.

Open: pick one logo and one pairing; confirm the minimum Kannada support; decide whether to self-host fonts for offline PWAs (both apps are offline-first).
