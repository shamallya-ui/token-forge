# Changelog

All notable changes to `@shamallya-ui/tokens`. Versioning follows semver: a removed or renamed token is a major change, new tokens are minor, value tweaks that keep a token's meaning are patch.

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
