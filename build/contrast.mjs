// WCAG AA contrast check on the resolved semantic colours, in light and dark.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { contrastRatio } from './lib/tokens.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const resolved = JSON.parse(readFileSync(new URL('../packages/tokens/dist/tokens.resolved.json', import.meta.url)));
const config = JSON.parse(readFileSync(new URL('./contrast-pairs.json', import.meta.url)));

export function checkContrast(resolvedModes, cfg) {
  const rows = [];
  for (const mode of ['light', 'dark']) {
    for (const p of cfg.pairs) {
      if (p.modes && !p.modes.includes(mode)) continue;
      const get = (name) => resolvedModes[mode][`shamallya.semantic.color.${name}`];
      const fg = get(p.fg), bg = get(p.bg);
      if (!fg || !bg) { rows.push({ mode, ...p, ratio: NaN, pass: false, missing: true }); continue; }
      const ratio = contrastRatio(fg, bg);
      const min = p.kind === 'text' && mode === 'light' ? Math.max(p.min, cfg.textPolicyLight) : p.min;
      rows.push({ mode, ...p, fg_hex: fg, bg_hex: bg, ratio, min, pass: ratio >= min });
    }
  }
  return rows;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rows = checkContrast(resolved, config);
  for (const r of rows) {
    console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.mode.padEnd(5)} ${r.fg} on ${r.bg}: ${Number.isNaN(r.ratio) ? 'missing token' : r.ratio.toFixed(2) + ':1'} (min ${r.min})`);
  }
  const failed = rows.filter((r) => !r.pass);
  console.log(`\n${rows.length - failed.length}/${rows.length} pairs pass`);
  process.exit(failed.length ? 1 : 0);
}
