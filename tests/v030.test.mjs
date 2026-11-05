import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { combine, combineTheme, filesForMode, lintThemeRamps, loadFiles, validate, lintNames } from '../build/lib/tokens.mjs';
import { checkContrast } from '../build/contrast.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = (f) => fileURLToPath(new URL(`../packages/tokens/dist/${f}`, import.meta.url));
const resolved = JSON.parse(readFileSync(dist('tokens.resolved.json'), 'utf8'));
const config = JSON.parse(readFileSync(new URL('../build/contrast-pairs.json', import.meta.url)));
const css = readFileSync(dist('tokens.css'), 'utf8');
const themeCss = readFileSync(dist('themes/slate-teal.css'), 'utf8');
const SZ = (n) => `shamallya.semantic.size.${n}`;
const COL = (n) => `shamallya.semantic.color.${n}`;
const rem = (v) => parseFloat(v);
const differ = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

test('K-01/K-02: comfortable mode meets the target and type floors; default mode does not change', () => {
  const c = resolved.comfortable;
  assert.ok(rem(c[SZ('control-height')]) >= 3.5, 'controls at least 56px');
  assert.ok(rem(c[SZ('target-min')]) >= 3, 'targets at least 48px');
  assert.ok(rem(c[SZ('icon-target')]) >= 3, 'icon buttons at least 48px');
  assert.ok(rem(c[SZ('text-floor')]) >= 0.9375, 'text at least 15px');
  assert.ok(rem(c[SZ('text-body')]) >= 1.1875 && rem(c[SZ('text-reading')]) >= 1.0625);
  assert.equal(c[SZ('title')], '1.75rem');
  assert.equal(c[SZ('numeral')], '3.75rem');
  assert.equal(resolved.light[SZ('control-height')], '2.5rem');
  assert.equal(resolved.light[SZ('text-floor')], '0.875rem');
});

test('comfortable mode: only size tokens differ from light, and the CSS carries them under data-density', () => {
  const changed = Object.keys(resolved.light).filter((p) => differ(resolved.light[p], resolved.comfortable[p]));
  assert.ok(changed.length > 0 && changed.every((p) => p.startsWith('shamallya.semantic.size.')), changed.join(', '));
  const block = css.match(/\[data-density="comfortable"\] \{([\s\S]*?)^\}/m)[1];
  for (const p of changed) {
    const name = '--' + p.split('.').join('-');
    assert.match(block, new RegExp(`${name}: ${resolved.comfortable[p].replace('.', '\\.')}`));
  }
});

test('focus ring geometry tokens exist in both modes (3px ring, 2px gap)', () => {
  for (const m of ['light', 'comfortable']) {
    assert.equal(resolved[m][SZ('focus-ring-width')], '0.1875rem');
    assert.equal(resolved[m][SZ('focus-ring-offset')], '0.125rem');
  }
});

test('canvas and subtle border exist in light and dark with their own values', () => {
  for (const m of ['light', 'dark']) {
    assert.ok(resolved[m][COL('surface.canvas')] && resolved[m][COL('border.subtle')]);
    assert.notEqual(resolved[m][COL('surface.canvas')], resolved[m][COL('surface.raised')]);
  }
  assert.notEqual(resolved.light[COL('surface.canvas')], resolved.dark[COL('surface.canvas')]);
});

test('K-05/C-12: the slate-teal theme passes every contrast pair in light and dark', () => {
  const rows = checkContrast(resolved.themes['slate-teal'], config);
  assert.ok(rows.length >= 100);
  assert.deepEqual(rows.filter((r) => !r.pass).map((r) => `${r.mode} ${r.fg} on ${r.bg} ${r.ratio}`), []);
});

test('B-02: the theme changes brand-level colours only, and keeps three text levels in dark', () => {
  const t = resolved.themes['slate-teal'];
  const differs = Object.keys(t.light).filter((p) => differ(t.light[p], resolved.light[p]));
  assert.ok(differs.length > 0 && differs.every((p) => /^shamallya\.(semantic\.(color|radius)|component)\./.test(p) || /primitive\.color\.(slate|teal)\./.test(p)), differs.join(', '));
  assert.notEqual(t.dark[COL('text.subtle')], t.dark[COL('text.muted')]);
  assert.equal(t.light[COL('primary.default')].toUpperCase(), '#115E59');
});

test('B-02: the theme file overrides only semantic colours and radius, and the root data-theme decides dark (brand on the root or a container)', () => {
  const names = [...themeCss.matchAll(/--([a-z0-9-]+):/g)].map((m) => m[1]);
  assert.ok(names.length > 0 && names.every((n) => /^shamallya-semantic-(color|radius)-/.test(n)));
  assert.match(themeCss, /^\[data-brand="slate-teal"\] \{/m);
  // Same rule as tokens.css: auto dark needs the root not forced light; forced dark needs the root data-theme="dark".
  assert.match(themeCss, /@media \(prefers-color-scheme: dark\) \{\n  :root\[data-brand="slate-teal"\]:not\(\[data-theme="light"\]\),\n  :root:not\(\[data-theme="light"\]\) \[data-brand="slate-teal"\] \{/);
  assert.match(themeCss, /^:root\[data-brand="slate-teal"\]\[data-theme="dark"\],\n:root\[data-theme="dark"\] \[data-brand="slate-teal"\] \{/m);
  // The old selectors let a container or a nested ancestor override a forced-light root.
  assert.doesNotMatch(themeCss, /^\s*\[data-brand="slate-teal"\]:not\(\[data-theme="light"\]\)/m);
  assert.doesNotMatch(themeCss, /^\[data-theme="dark"\] \[data-brand/m);
});

test('B-04: a theme ramp with a missing step fails', () => {
  const files = loadFiles(root, 'themes/slate-teal');
  const { tokens } = combine(files);
  assert.deepEqual(lintThemeRamps(tokens), []);
  tokens.delete('shamallya.primitive.color.teal.600');
  assert.ok(lintThemeRamps(tokens).some((e) => e.includes('teal') && e.includes('600')));
});

test('B-03: the merged theme is valid and follows the naming rules in both modes', () => {
  const base = loadFiles(root);
  const themeFiles = loadFiles(root, 'themes/slate-teal');
  for (const mode of ['light', 'dark']) {
    const { tokens, errors } = combineTheme(base, themeFiles, mode);
    assert.deepEqual([...errors, ...validate(tokens), ...lintNames(tokens)], []);
  }
  assert.equal(filesForMode(base, 'light').some((f) => f.file.endsWith('size-comfortable.json')), false);
});
