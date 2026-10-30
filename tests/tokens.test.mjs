import test from 'node:test';
import assert from 'node:assert/strict';
import { combine, validate, lintNames, loadFiles, flatten } from '../build/lib/tokens.mjs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const FILE = 'tokens/primitive/test.json';
const set = (tree, file = FILE) => combine([{ file, tree }]).tokens;
const prim = (extra) => ({ shamallya: { primitive: extra } });
const errs = (tree, file) => { const t = set(tree, file); return [...validate(t), ...lintNames(t)]; };
const has = (list, text) => list.some((e) => e.includes(text));

test('T-01/N-01: the real token sources are valid and follow the naming rules', () => {
  const files = loadFiles(root);
  for (const skip of ['color-dark.json', 'color-light.json']) {
    const { tokens, errors } = combine(files.filter((f) => !f.file.endsWith(skip)));
    assert.deepEqual([...errors, ...validate(tokens), ...lintNames(tokens)], []);
  }
});

test('T-02: aliases across tiers resolve', () => {
  const files = loadFiles(root).filter((f) => !f.file.endsWith('color-dark.json'));
  const { tokens } = combine(files);
  assert.equal(tokens.get('shamallya.semantic.color.primary.default').value, '{shamallya.primitive.color.blue.500}');
});

test('T-03: a token without a value fails with its path', () => {
  assert.ok(has(errs(prim({ color: { blue: { 500: { $type: 'color' } } } })), 'shamallya.primitive.color.blue.500'));
});

test('T-04: a colour token with a dimension value fails', () => {
  assert.ok(has(errs(prim({ color: { blue: { 500: { $type: 'color', $value: '16px' } } } })), 'hex string'));
});

test('T-05: a reference to a missing token fails', () => {
  const e = errs({ shamallya: { semantic: { color: { text: { default: { $type: 'color', $value: '{shamallya.primitive.color.nope}' } } } } } }, 'tokens/semantic/x.json');
  assert.ok(has(e, 'references missing token'));
});

test('T-06: circular references fail with the cycle', () => {
  const e = errs(prim({ z: { $type: 'number', 0: { $value: '{shamallya.primitive.z.10}' }, 10: { $value: '{shamallya.primitive.z.0}' } } }));
  assert.ok(has(e, 'circular reference'));
});

test('T-07: an upward reference (primitive to semantic) fails', () => {
  const t = combine([
    { file: FILE, tree: prim({ z: { $type: 'number', 0: { $value: '{shamallya.semantic.z.base}' } } }) },
    { file: 'tokens/semantic/z.json', tree: { shamallya: { semantic: { z: { $type: 'number', base: { $value: 1 } } } } } },
  ]).tokens;
  assert.ok(has(validate(t), 'upward reference'));
});

test('T-07b: component colours must reference semantic tokens, not primitives', () => {
  const t = combine([
    { file: FILE, tree: prim({ color: { white: { $type: 'color', $value: '#FFFFFF' } } }) },
    { file: 'tokens/component/x.json', tree: { shamallya: { component: { button: { text: { $type: 'color', $value: '{shamallya.primitive.color.white}' } } } } } },
  ]).tokens;
  assert.ok(has(validate(t), 'must reference semantic'));
});

test('T-08: an alias chain at the maximum depth passes and one deeper fails', () => {
  const chain = (n) => {
    const z = { $type: 'number', 0: { $value: 1 } };
    for (let i = 1; i <= n; i++) z[i] = { $value: `{shamallya.primitive.z.${i - 1}}` };
    return prim({ z });
  };
  assert.deepEqual(validate(set(chain(4))), []);
  assert.ok(has(validate(set(chain(5))), 'deeper than'));
});

test('T-09: an empty group is not an error', () => {
  assert.deepEqual(validate(set(prim({ color: {} }))), []);
});

test('T-10: extreme colours are accepted', () => {
  const t = set(prim({ color: { white: { $type: 'color', $value: '#FFFFFF' }, neutral: { 900: { $type: 'color', $value: '#000000' }, 950: { $type: 'color', $value: '#00000000' } } } }));
  assert.deepEqual([...validate(t), ...lintNames(t)], []);
});

test('T-11: a token defined in two files fails', () => {
  const { errors } = combine([
    { file: FILE, tree: prim({ z: { $type: 'number', 0: { $value: 1 } } }) },
    { file: 'tokens/primitive/other.json', tree: prim({ z: { $type: 'number', 0: { $value: 2 } } }) },
  ]);
  assert.ok(has(errors, 'defined twice'));
});

test('T-12: an unsupported colour format fails', () => {
  assert.ok(has(errs(prim({ color: { blue: { 500: { $type: 'color', $value: 'rgb(0,0,0)' } } } })), 'hex string'));
  assert.ok(has(errs(prim({ color: { blue: { 500: { $type: 'color', $value: '#12345' } } } })), 'hex string'));
});

test('N-03/N-04: a missing or misspelt namespace fails', () => {
  assert.ok(has(errs({ primitive: { z: { $type: 'number', 0: { $value: 1 } } } }), 'must start with'));
  assert.ok(has(errs({ shamalya: { primitive: { z: { $type: 'number', 0: { $value: 1 } } } } }), 'must start with'));
});

test('N-05: uppercase or camelCase segments fail', () => {
  assert.ok(has(errs(prim({ z: { $type: 'number', topLayer: { $value: 1 } } })), 'kebab-case'));
});

test('N-06: an unknown tier fails', () => {
  assert.ok(has(errs({ shamallya: { base: { z: { $type: 'number', 0: { $value: 1 } } } } }), 'tier'));
});

test('N-07: colour words in semantic names fail', () => {
  const e = errs({ shamallya: { semantic: { color: { blue: { default: { $type: 'color', $value: '#1D4ED8' } } } } } }, 'tokens/semantic/x.json');
  assert.ok(has(e, 'roles, not colour words'));
});

test('N-08: forbidden organisation-specific role words in token names fail', () => {
  const e = errs({ shamallya: { semantic: { color: { admin: { default: { $type: 'color', $value: '#1D4ED8' } } } } } }, 'tokens/semantic/x.json');
  assert.ok(has(e, 'forbidden role word'));
});

test('N-09: a colour step outside the allowed list fails', () => {
  assert.ok(has(errs(prim({ color: { blue: { 650: { $type: 'color', $value: '#1D4ED8' } } } })), 'colour step'));
});

test('N-10: the longest permitted name passes and one segment more fails', () => {
  const nest = (depth) => { let n = { $type: 'number', $value: 1 }; for (let i = 0; i < depth; i++) n = { [`a${i}`]: n }; return n; };
  const make = (extra) => ({ shamallya: { semantic: { z: { $type: 'number', ...nest(extra) } } } });
  const ok = lintNames(set(make(3), 'tokens/semantic/x.json'));   // shamallya.semantic.z + 3 = 6... plus leaf
  assert.ok(!has(ok, 'more than'));
  assert.ok(has(lintNames(set(make(5), 'tokens/semantic/x.json')), 'more than'));
});

test('N-12: a deprecated token must name its replacement', () => {
  const tree = prim({ z: { $type: 'number', 0: { $value: 1, $deprecated: true } } });
  assert.ok(has(lintNames(set(tree)), '$deprecated'));
  const ok = prim({ z: { $type: 'number', 0: { $value: 1, $deprecated: 'use shamallya.primitive.z.10' } } });
  assert.deepEqual(lintNames(set(ok)), []);
});

test('tier must match its folder', () => {
  assert.ok(has(lintNames(set(prim({ z: { $type: 'number', 0: { $value: 1 } } }), 'tokens/semantic/x.json')), 'does not match its folder'));
});

test('flatten inherits $type from groups', () => {
  const t = flatten(prim({ z: { $type: 'number', 0: { $value: 1 } } }));
  assert.equal(t[0].type, 'number');
});
