// Validates tokens against the DTCG-style rules and the naming convention.
import { loadFiles, combine, validate, lintNames } from './lib/tokens.mjs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
// Light and dark semantic colour files define the same paths on purpose; lint each mode on its own.
const files = loadFiles(root);
const modes = { light: files.filter((f) => !f.file.endsWith('color-dark.json')), dark: files.filter((f) => !f.file.endsWith('color-light.json')) };
let failed = 0;
for (const [mode, set] of Object.entries(modes)) {
  const { tokens, errors } = combine(set);
  const all = [...errors, ...validate(tokens), ...lintNames(tokens)];
  const uniq = [...new Set(all)];
  console.log(`${mode}: ${tokens.size} tokens, ${uniq.length} problem(s)`);
  for (const e of uniq) console.log('  - ' + e);
  failed += uniq.length;
}
process.exit(failed ? 1 : 0);
