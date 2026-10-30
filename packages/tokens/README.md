# @shamallya-ui/tokens

ShaMallya design tokens, generated from W3C DTCG sources in the repository's `tokens/` folder.

Outputs (in `dist/` after `npm run build` at the repo root):

| File | Use |
|------|-----|
| `tokens.css` | CSS custom properties. Light by default; dark with `data-theme="dark"` or the system preference (unless `data-theme="light"`) |
| `tailwind-preset.js` / `.cjs` | Tailwind preset mapping semantic tokens to the CSS variables |
| `tokens.resolved.json` | Literal resolved values per mode, for tools and tests |

Use semantic tokens only in apps (for example `--shamallya-semantic-color-primary-default`). Primitives are for the system itself. See the repository docs for naming, tiers and accessibility targets.

Licence: MIT.
