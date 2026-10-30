import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { contrastRatio } from '../build/lib/tokens.mjs';
import { checkContrast } from '../build/contrast.mjs';

const resolved = JSON.parse(readFileSync(new URL('../packages/tokens/dist/tokens.resolved.json', import.meta.url)));
const config = JSON.parse(readFileSync(new URL('../build/contrast-pairs.json', import.meta.url)));
const S = (n) => `shamallya.semantic.color.${n}`;

test('contrast formula: black on white is 21:1 and identical colours are 1:1', () => {
  assert.equal(Math.round(contrastRatio('#000000', '#FFFFFF')), 21);
  assert.equal(contrastRatio('#123456', '#123456'), 1);
});

test('C-07/C-08: 4.5:1 boundary - #767676 on white passes, #777777 fails (no rounding up)', () => {
  assert.ok(contrastRatio('#767676', '#FFFFFF') >= 4.5);
  assert.ok(contrastRatio('#777777', '#FFFFFF') < 4.5);
});

test('C-01 to C-13: every documented pair passes in light and dark', () => {
  const rows = checkContrast(resolved, config);
  assert.ok(rows.length > 60);
  assert.deepEqual(rows.filter((r) => !r.pass).map((r) => `${r.mode} ${r.fg} on ${r.bg} ${r.ratio}`), []);
});

test('C-09/C-15: yellow as text on the cream surface is rejected (about 1.8:1)', () => {
  const yellow = resolved.light['shamallya.primitive.color.yellow.500'];
  const cream = resolved.light[S('surface.default')];
  assert.ok(contrastRatio(yellow, cream) < 2);
  const bad = structuredClone(resolved);
  bad.light[S('warning.text')] = yellow;
  const failing = checkContrast(bad, config).filter((r) => !r.pass && r.fg === 'warning.text' && r.mode === 'light');
  assert.ok(failing.length >= 1);
});

test('C-12: a low-contrast brand palette fails the contrast job', () => {
  const bad = structuredClone(resolved);
  bad.light[S('primary.default')] = '#9DB3F5';
  assert.ok(checkContrast(bad, config).some((r) => !r.pass && r.bg === 'primary.default'));
});

test('C-16: the lifted dark-mode fills are not allowed as normal text (below 4.5:1)', () => {
  const ink = resolved.dark[S('surface.default')];
  for (const hue of ['blue', 'red', 'green']) {
    assert.ok(contrastRatio(resolved.dark[`shamallya.primitive.color.${hue}.dark-fill`], ink) < 4.5, hue);
  }
});

test('C-18: red and green text on cream keep at least 5.5:1', () => {
  const cream = resolved.light[S('surface.default')];
  assert.ok(contrastRatio(resolved.light[S('danger.text')], cream) >= 5.5);
  assert.ok(contrastRatio(resolved.light[S('success.text')], cream) >= 5.5);
});
