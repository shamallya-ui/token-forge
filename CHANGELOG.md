# Changelog

All notable changes to `@shamallya-ui/tokens`. Versioning follows semver: a removed or renamed token is a major change, new tokens are minor, value tweaks that keep a token's meaning are patch.

## 0.5.0 - 2026-11-05 (prepared; publish pending)

Added (token requests from the component specs):

- `semantic.size.subtitle` (22 px, TR-22) and `semantic.size.headline` (32 px, TR-32), backed by `primitive.font.size.subtitle` and `headline`. Same value in default and comfortable mode.
- `semantic.size.icon-stroke` (2) and `icon-stroke-active` (2.2) for the active tab icon (TR-stroke); unitless numbers.
- Tailwind preset now also exposes semantic sizes (`control`, `target`, `icon-*`, `switch-*`), semantic spacing (`inset-*`, `gap-*`, `stack-*`, `section`, `touch-target`), `bw-*` border widths, focus ring width and offset (`ring`), font weights, line heights, label tracking, `ui-*` font sizes and `strokeWidth`. `lineHeight.tight` and `relaxed` now follow the tokens (1.2 and 1.7).

Fixed:

- Brand theme dark selectors follow the root's `data-theme`, like `tokens.css`. Before, a brand container in a system-dark page ignored a forced-light root, and any `data-theme="dark"` ancestor flipped the brand.
- `luminance` throws on a colour whose alpha is not ff, instead of computing a wrong ratio.
- The build validates all tokens and themes before writing `dist`, so a bad token no longer leaves a half-built package.
- `prepublishOnly` runs lint, build, contrast and tests, not only the build.
- Contrast coverage is enforced: every semantic colour is in a pair or in the new `exemptions` list with a reason (13 exempt).

No tokens were removed or renamed. 65 tests pass.

## 0.4.0 - 2026-11-03 (published 2026-11-05)

Added (found by the designer and testing agents specifying the first React components):

- `semantic.size.border-width-{default,strong,heavy}` (2, 2.5 and 3 px), `icon-{sm,md,lg}` (20, 22 and 24 px), `switch-track-width`, `switch-track-height`, `switch-thumb` (56, 32 and 24 px) and `tracking-label` (0.5 px, for uppercase Latin labels only; apply under `:lang(en)`).
- `semantic.color.border.card`: the card edge, transparent in light and a visible edge in dark (use with `border-width-default` so layout does not shift between modes). `primitive.color.transparent` backs it.
- A `prefers-reduced-motion: reduce` block in `tokens.css` that collapses the transition tokens.
- `slate-teal`: `radius.control` is 12 px (a theme may now override the radius); a `slate.350` step so dark `text.subtle` stays distinct from muted text and reaches about 7.8:1; a dark card edge.
- Contrast job: 116 pairs (was 106), now also guarding `primary.on` on hover and active, `primary.text` as a 3:1 border on raised, and the focus ring and strong border on sunken.

Changed (correction):

- Default theme, dark mode: `primary.hover` and `primary.active` now use darker blue steps (500 and 600) instead of lighter ones, because white text on the lighter values failed contrast (2.7:1 and 2.0:1) when a filled primary control is hovered or pressed. The apps in this workspace do not use these two tokens.

No tokens were removed or renamed. 58 tests pass.

## 0.3.0 - 2026-11-03 (published to npm)

Added (requested by the Konkani Meal Planner, the first React consumer; ADR-0009, ADR-0010, ADR-0011):

- `shamallya.semantic.color.surface.canvas`: the page background behind cards, in light and dark.
- `shamallya.semantic.color.border.subtle`: decorative separators inside cards (carries no meaning, so it has no contrast pair).
- `shamallya.semantic.size.*`: `control-height`, `target-min`, `icon-target`, `text-floor`, `text-body`, `text-reading`, `title`, `numeral`, `focus-ring-width`, `focus-ring-offset`. Their default values leave existing apps unchanged.
- **Comfortable mode**: `[data-density="comfortable"]` raises controls to 56px, targets to 48px and the text floor to 15px (reading sizes 17 to 19px). Apply it to the root or to any container. Also exposed as `comfortable` in `@shamallya-ui/tokens/resolved`.
- Primitive font sizes `floor`, `reading`, `body-lg`, `title` (28px) and `numeral` (60px).
- **Brand theme `slate-teal`** (`@shamallya-ui/tokens/themes/slate-teal`): brand-level overrides only; set `data-brand="slate-teal"` on the root or a container and load the file after `tokens.css`. It keeps three text levels in dark mode.
- Hue ramps `slate` and `teal` are allowed as theme primitives; a theme that defines a ramp must define every step.
- Contrast job: 106 pairs (was 98), checked for the default theme and for slate-teal, all passing.
- Tests: 53 (was 44).

No tokens were removed or renamed. Existing apps need no change; to adopt comfortable mode or a theme, add the attribute (and for a theme, the extra CSS file).

## 0.2.0 - 2026-11-02 (published to npm)

Added (found while adopting the tokens in the portfolio and in Vibgyor):

- `shamallya.semantic.color.text.subtle`: a third text level, between muted text and disabled text.
- `shamallya.semantic.color.highlight.{default,subtle,on,text}`: a warm decorative highlight role, separate from the warning status role (it uses the same yellow and ochre, so apps can restyle highlights without touching warnings).
- `shamallya.semantic.color.tag.<hue>.{text,background,border}` for `blue`, `amber`, `green`, `purple`, `orange`, `red`, `pink`, `indigo` and `neutral`: the warmed categorical tag palette confirmed in ADR-0008, in light and dark. Tag colours never carry status meaning on their own.
- Primitives `shamallya.primitive.color.tag.<hue>.<slot>` (six slots per hue) that the tag tokens point at.
- The Tailwind preset exposes `text.subtle`, `highlight` and `tag.<hue>.<slot>`.
- Naming lint: colour words are allowed only in the hue segment of `semantic.color.tag.*`.
- Contrast job: 98 pairs (was 66), all passing.

No tokens were removed or renamed.

## 0.1.0 - 2026-10-30

First release: 191 tokens (primitive, semantic, component) with light and dark modes, CSS variables, Tailwind preset and resolved JSON. Palette direction B (warm editorial), revision 2.
