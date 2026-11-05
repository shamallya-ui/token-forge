import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { luminance } from '../build/lib/tokens.mjs';

const dist = (f) => fileURLToPath(new URL(`../packages/tokens/dist/${f}`, import.meta.url));
const resolved = JSON.parse(readFileSync(dist('tokens.resolved.json'), 'utf8'));
const config = JSON.parse(readFileSync(new URL('../build/contrast-pairs.json', import.meta.url)));
const pkg = JSON.parse(readFileSync(new URL('../packages/tokens/package.json', import.meta.url)));
const css = readFileSync(dist('tokens.css'), 'utf8');
const preset = (await import(dist('tailwind-preset.js'))).default.theme.extend;
const cjs = (await import('node:module')).createRequire(import.meta.url)(dist('tailwind-preset.cjs')).theme.extend;
const SZ = (n) => `shamallya.semantic.size.${n}`;
const v = (n) => `var(--shamallya-semantic-${n})`;

test('R5-01: 22 px and 32 px type sizes exist in every mode and in the CSS', () => {
  for (const m of ['light', 'dark', 'comfortable']) {
    assert.equal(resolved[m][SZ('subtitle')], '1.375rem', m);
    assert.equal(resolved[m][SZ('headline')], '2rem', m);
  }
  assert.match(css, /--shamallya-semantic-size-subtitle: 1\.375rem;/);
  assert.match(css, /--shamallya-semantic-size-headline: 2rem;/);
});

test('R5-02: icon stroke tokens are unitless numbers (2 and 2.2) in every mode', () => {
  for (const m of ['light', 'dark', 'comfortable']) {
    assert.equal(resolved[m][SZ('icon-stroke')], 2);
    assert.equal(resolved[m][SZ('icon-stroke-active')], 2.2);
  }
  assert.match(css, /--shamallya-semantic-size-icon-stroke-active: 2\.2;/);
});

test('R5-03: the Tailwind preset covers every utility the components repo defined itself, in ESM and CJS', () => {
  const expected = {
    spacing: ['control', 'target', 'icon-target', 'icon-sm', 'icon-md', 'icon-lg', 'switch-w', 'switch-h', 'switch-thumb', 'inset-sm', 'inset-md', 'inset-lg', 'gap-sm', 'gap-md', 'stack-sm', 'stack-md', 'stack-lg'],
    borderWidth: ['bw-default', 'bw-strong', 'bw-heavy'],
    outlineWidth: ['ring'], outlineOffset: ['ring'],
    fontSize: ['ui-floor', 'ui-reading', 'ui-body', 'ui-title', 'ui-subtitle', 'ui-headline'],
    fontWeight: ['regular', 'medium', 'semibold'], lineHeight: ['normal'], letterSpacing: ['label'], strokeWidth: ['icon', 'icon-active'],
  };
  for (const ext of [preset, cjs]) for (const [group, keys] of Object.entries(expected)) for (const k of keys) assert.ok(ext[group]?.[k], `${group}.${k}`);
  assert.equal(preset.spacing.control, v('size-control-height'));
  assert.equal(preset.spacing['switch-w'], v('size-switch-track-width'));
  assert.equal(preset.fontSize['ui-title'], v('size-title'));
  assert.equal(preset.letterSpacing.label, v('size-tracking-label'));
  assert.equal(preset.outlineOffset.ring, v('size-focus-ring-offset'));
});

test('R5-04: every semantic size token and every semantic space token is exposed by the preset', () => {
  const all = JSON.stringify(preset);
  for (const p of Object.keys(resolved.light).filter((k) => /^shamallya\.semantic\.(size|space)\./.test(k))) {
    assert.ok(all.includes(`var(--${p.split('.').join('-')})`), p);
  }
});

test('R5-05: every semantic colour is in a contrast pair or has a reasoned exemption, and no exemption is stale', () => {
  const colours = Object.keys(resolved.light).filter((k) => k.startsWith('shamallya.semantic.color.')).map((k) => k.slice('shamallya.semantic.color.'.length));
  const paired = new Set(config.pairs.flatMap((p) => [p.fg, p.bg]));
  const exempt = new Map((config.exemptions ?? []).map((e) => [e.token, e.reason]));
  for (const [t, r] of exempt) assert.ok(typeof r === 'string' && r.length > 20, `exemption ${t} needs a reason`);
  assert.deepEqual(colours.filter((c) => !paired.has(c) && !exempt.has(c)), [], 'uncovered colour tokens');
  assert.deepEqual([...exempt.keys()].filter((t) => paired.has(t) || !colours.includes(t)), [], 'stale exemptions');
});

test('R5-06: luminance rejects a colour with alpha other than ff', () => {
  assert.throws(() => luminance('#00000000'), /opaque/);
  assert.throws(() => luminance('#FFFFFF80'), /opaque/);
  assert.equal(luminance('#FFFFFFFF'), 1);
});

test('R5-07: prepublishOnly runs the root checks and the version is 0.5.0', () => {
  assert.equal(pkg.version, '0.5.0');
  assert.match(pkg.scripts.prepublishOnly, /npm run check --prefix \.\.\/\.\./);
});
