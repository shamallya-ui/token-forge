import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dist = (f) => fileURLToPath(new URL(`../packages/tokens/dist/${f}`, import.meta.url));
const resolved = JSON.parse(readFileSync(dist('tokens.resolved.json'), 'utf8'));
const css = readFileSync(dist('tokens.css'), 'utf8');
const themeCss = readFileSync(dist('themes/slate-teal.css'), 'utf8');
const SZ = (n) => `shamallya.semantic.size.${n}`;
const COL = (n) => `shamallya.semantic.color.${n}`;

test('0.4.0: border width, icon size, switch and tracking tokens exist in default and comfortable', () => {
  const expected = {
    'border-width-default': '0.125rem', 'border-width-strong': '0.15625rem', 'border-width-heavy': '0.1875rem',
    'icon-sm': '1.25rem', 'icon-md': '1.375rem', 'icon-lg': '1.5rem',
    'switch-track-width': '3.5rem', 'switch-track-height': '2rem', 'switch-thumb': '1.5rem', 'tracking-label': '0.03125rem',
  };
  for (const m of ['light', 'dark', 'comfortable']) for (const [k, v] of Object.entries(expected)) assert.equal(resolved[m][SZ(k)], v, `${m} ${k}`);
});

test('0.4.0: card edge is invisible in light and visible in dark, in both themes', () => {
  assert.equal(resolved.light[COL('border.card')], '#00000000');
  assert.notEqual(resolved.dark[COL('border.card')], '#00000000');
  const t = resolved.themes['slate-teal'];
  assert.equal(t.light[COL('border.card')], '#00000000');
  assert.equal(t.dark[COL('border.card')].toUpperCase(), '#334155');
});

test('0.4.0: slate-teal sets the control radius to 12px and keeps dark subtle text above 7:1 on raised', () => {
  assert.equal(resolved.themes['slate-teal'].light['shamallya.semantic.radius.control'], '0.75rem');
  assert.match(themeCss, /--shamallya-semantic-radius-control: 0\.75rem;/);
  assert.equal(resolved.light['shamallya.semantic.radius.control'], '0.5rem');
  const lum = (h) => [0, 2, 4].map((i) => parseInt(h.slice(1 + i, 3 + i), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
  const t = resolved.themes['slate-teal'].dark;
  const [hi, lo] = [lum(t[COL('text.subtle')]), lum(t[COL('surface.raised')])].sort((a, b) => b - a);
  assert.ok((hi + 0.05) / (lo + 0.05) >= 7, 'dark subtle on raised at least 7:1');
  assert.notEqual(t[COL('text.subtle')], t[COL('text.muted')]);
});

test('0.4.0: reduced motion collapses the transition tokens', () => {
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*?--shamallya-semantic-motion-transition-fast: 0\.01ms/);
});

test('0.4.0: filled primary text stays readable on hover and active in dark', () => {
  const on = resolved.dark[COL('primary.on')];
  assert.equal(on.toUpperCase(), '#FFFFFF');
  assert.notEqual(resolved.dark[COL('primary.hover')], resolved.dark[COL('primary.text')]);
});
