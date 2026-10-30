import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = (f) => fileURLToPath(new URL(`../packages/tokens/dist/${f}`, import.meta.url));
const css = readFileSync(dist('tokens.css'), 'utf8');
const resolved = JSON.parse(readFileSync(dist('tokens.resolved.json'), 'utf8'));

const blocks = () => {
  const light = css.match(/^:root \{([\s\S]*?)^\}/m)[1];
  const auto = css.match(/@media \(prefers-color-scheme: dark\) \{\s*:root:not\(\[data-theme="light"\]\) \{([\s\S]*?)^\s{2}\}/m)[1];
  const dark = css.match(/^:root\[data-theme="dark"\] \{([\s\S]*?)^\}/m)[1];
  return { light, auto, dark };
};
const vars = (block) => Object.fromEntries([...block.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim().replace(/\s*\/\*.*$/, '')]));
const nameOf = (path) => path.split('.').join('-');
const SIMPLE = (v) => typeof v === 'string' && /^(#[0-9a-fA-F]{6}|-?\d+(\.\d+)?(px|rem|ms))$/.test(v);

test('O-01: CSS values equal the resolved source values (colour, dimension, duration)', () => {
  const light = vars(blocks().light);
  const mismatches = [];
  for (const [path, value] of Object.entries(resolved.light)) {
    if (!SIMPLE(value)) continue;
    const got = light[nameOf(path)];
    if (got === undefined || got.toLowerCase() !== String(value).toLowerCase()) mismatches.push(`${path}: ${got} vs ${value}`);
  }
  assert.deepEqual(mismatches, []);
});

test('O-03: every source token appears as a CSS variable in light', () => {
  const light = vars(blocks().light);
  const missing = Object.keys(resolved.light).filter((p) => !(nameOf(p) in light));
  assert.deepEqual(missing, []);
});

test('O-04: no CSS variable exists that is not in the source', () => {
  const names = new Set(Object.keys(resolved.light).map(nameOf));
  const stray = Object.keys(vars(blocks().light)).filter((n) => !names.has(n));
  assert.deepEqual(stray, []);
});

test('P-01/P-02: every themed colour exists in both modes, with the same names', () => {
  const themed = (m) => Object.keys(resolved[m]).filter((p) => /^shamallya\.(semantic|component)\./.test(p) && /^#/.test(resolved[m][p])).sort();
  assert.deepEqual(themed('dark'), themed('light'));
  const { dark } = blocks();
  assert.deepEqual(Object.keys(vars(dark)).sort(), themed('light').map(nameOf).sort());
});

test('P-03: the auto (system preference) block equals the explicit dark block', () => {
  const { auto, dark } = blocks();
  assert.deepEqual(vars(auto), vars(dark));
});

test('P-07/P-08: dark values differ from light for surface and text tokens', () => {
  for (const n of ['surface.default', 'text.default', 'text.muted', 'border.default']) {
    const p = `shamallya.semantic.color.${n}`;
    assert.notEqual(resolved.light[p], resolved.dark[p], n);
  }
});

test('P-04: light is the default and color-scheme is declared', () => {
  assert.match(css, /:root \{\s*color-scheme: light;/);
  assert.match(css, /color-scheme: dark;/);
});

test('O-02/O-06: the Tailwind preset only references existing CSS variables and equals the CJS build', async () => {
  const names = new Set(Object.keys(vars(blocks().light)));
  const text = readFileSync(dist('tailwind-preset.js'), 'utf8');
  const refs = [...text.matchAll(/var\(--([a-z0-9-]+)\)/g)].map((m) => m[1]);
  assert.ok(refs.length > 40);
  assert.deepEqual(refs.filter((r) => !names.has(r)), []);
  const mod = (await import(dist('tailwind-preset.js'))).default;
  assert.ok(mod.theme.extend.colors.primary.DEFAULT.includes('semantic-color-primary-default'));
  assert.equal(readFileSync(dist('tailwind-preset.cjs'), 'utf8').replace('module.exports = ', 'export default '), text);
});

test('O-05: building twice gives byte-identical output', () => {
  const hash = () => ['tokens.css', 'tokens.resolved.json', 'tailwind-preset.js', 'tailwind-preset.cjs']
    .map((f) => createHash('sha256').update(readFileSync(dist(f))).digest('hex')).join();
  const before = hash();
  execFileSync(process.execPath, [`${root}build/build.mjs`], { cwd: root, stdio: 'pipe' });
  assert.equal(hash(), before);
});

test('O-10: the package exports point at files that exist', () => {
  const pkg = JSON.parse(readFileSync(fileURLToPath(new URL('../packages/tokens/package.json', import.meta.url)), 'utf8'));
  const targets = [pkg.exports['./css'], pkg.exports['./tailwind'].import, pkg.exports['./tailwind'].require, pkg.exports['./resolved']];
  for (const t of targets) assert.ok(readFileSync(fileURLToPath(new URL(`../packages/tokens/${t.replace('./', '')}`, import.meta.url))).length > 0, t);
});
