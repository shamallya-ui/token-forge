# Changelog

All notable changes to `@shamallya-ui/tokens`. Versioning follows semver: a removed or renamed token is a major change, new tokens are minor, value tweaks that keep a token's meaning are patch.

## 0.2.0 - 2026-11-02

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
