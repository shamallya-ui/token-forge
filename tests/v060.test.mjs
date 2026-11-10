import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dist = (f) => fileURLToPath(new URL(`../packages/tokens/dist/${f}`, import.meta.url));
const resolved = JSON.parse(readFileSync(dist('tokens.resolved.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(new URL('../packages/tokens/package.json', import.meta.url)));
const css = readFileSync(dist('tokens.css'), 'utf8');
const preset = (await import(dist('tailwind-preset.js'))).default.theme.extend;
const cjs = (await import('node:module')).createRequire(import.meta.url)(dist('tailwind-preset.cjs')).theme.extend;
const B = 'shamallya.component.button.radius';
const C = 'shamallya.semantic.radius.control';

test('R6-01: button radius is 0.25rem in every mode and theme, control stays 0.5rem', () => {
  for (const m of ['light', 'dark', 'comfortable']) {
    assert.equal(resolved[m][B], '0.25rem', m);
    assert.equal(resolved[m][C], '0.5rem', m);
  }
  for (const m of ['light', 'dark']) {
    assert.equal(resolved.themes['slate-teal'][m][B], '0.25rem', `slate-teal ${m}`);
  }
  assert.match(css, /--shamallya-component-button-radius: 0\.25rem;/);
});

test('R6-02: the Tailwind preset exposes the button radius, in ESM and CJS', () => {
  for (const ext of [preset, cjs]) {
    assert.equal(ext.borderRadius.button, 'var(--shamallya-component-button-radius)');
    assert.equal(ext.borderRadius.control, 'var(--shamallya-semantic-radius-control)');
  }
});

test('R6-03: body and heading families lead with Plus Jakarta Sans, both modes', () => {
  for (const m of ['light', 'dark', 'comfortable']) {
    for (const n of ['heading', 'body']) {
      assert.equal(resolved[m][`shamallya.semantic.font.${n}`][0], 'Plus Jakarta Sans', `${m} ${n}`);
    }
    assert.ok(resolved[m]['shamallya.semantic.font.body'].includes('system-ui'), m);
    assert.ok(resolved[m]['shamallya.semantic.font.body'].includes('sans-serif'), m);
  }
  assert.match(css, /--shamallya-semantic-font-heading:.*Plus Jakarta Sans/);
});

test('R6-04: semantic weight tokens put controls and buttons at 500, headings at 500 to 600', () => {
  const expected = { control: 500, label: 500, button: 500, heading: 500, 'heading-strong': 600 };
  for (const m of ['light', 'dark', 'comfortable']) {
    for (const [n, w] of Object.entries(expected)) {
      assert.equal(resolved[m][`shamallya.semantic.font.weight.${n}`], w, `${m} ${n}`);
    }
  }
  for (const ext of [preset, cjs]) {
    for (const n of Object.keys(expected)) assert.ok(ext.fontWeight?.[n], `fontWeight.${n}`);
  }
  assert.match(css, /--shamallya-semantic-font-weight-button: 500;/);
  assert.match(css, /--shamallya-semantic-font-weight-heading-strong: 600;/);
});

test('R6-05: the version is 0.6.0', () => {
  assert.equal(pkg.version, '0.6.0');
});
