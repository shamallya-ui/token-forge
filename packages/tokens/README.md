# @shamallya-ui/tokens

ShaMallya design tokens, generated from W3C DTCG sources in the repository's `tokens/` folder.

Outputs (in `dist/` after `npm run build` at the repo root):

| File | Use |
|------|-----|
| `tokens.css` | CSS custom properties. Light by default; dark with `data-theme="dark"` or the system preference (unless `data-theme="light"`) |
| `tailwind-preset.js` / `.cjs` | Tailwind preset mapping semantic tokens to the CSS variables |
| `themes/slate-teal.css` | Brand theme (import `@shamallya-ui/tokens/themes/slate-teal` after `tokens.css`); apply with `data-brand="slate-teal"` on the root or a container |
| `tokens.resolved.json` | Literal resolved values per mode (`light`, `dark`, `comfortable`) and per theme, for tools and tests |

**Comfortable mode** (0.3.0): add `data-density="comfortable"` to the root or any container to get 56px controls, 48px targets and a 15px text floor, through the `--shamallya-semantic-size-*` variables.

Use semantic tokens only in apps (for example `--shamallya-semantic-color-primary-default`). Primitives are for the system itself. See the repository docs for naming, tiers and accessibility targets.

Licence: MIT.
