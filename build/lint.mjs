// Validates tokens against the DTCG-style rules and the naming convention.
import { loadFiles, filesForMode, combine, combineTheme, validate, lintNames, lintThemeRamps, MODES } from './lib/tokens.mjs';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
// Mode files define the same paths on purpose (light/dark colour, default/comfortable size); lint each mode on its own.
const files = loadFiles(root);
let failed = 0;
const report = (label, size, problems) => {
  const uniq = [...new Set(problems)];
  console.log(`${label}: ${size} tokens, ${uniq.length} problem(s)`);
  for (const e of uniq) console.log('  - ' + e);
  failed += uniq.length;
};
for (const mode of Object.keys(MODES)) {
  const { tokens, errors } = combine(filesForMode(files, mode));
  report(mode, tokens.size, [...errors, ...validate(tokens), ...lintNames(tokens)]);
}
// Themes: brand-level overrides laid over the base tokens, linted in both modes.
const themes = readdirSync(new URL('../themes', import.meta.url));
for (const theme of themes) {
  const themeFiles = loadFiles(root, `themes/${theme}`);
  for (const mode of ['light', 'dark']) {
    const { tokens, errors } = combineTheme(files, themeFiles, mode);
    report(`theme ${theme} ${mode}`, tokens.size, [...errors, ...validate(tokens), ...lintNames(tokens), ...lintThemeRamps(combine(themeFiles).tokens)]);
  }
}
process.exit(failed ? 1 : 0);
