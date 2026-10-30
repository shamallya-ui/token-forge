// Shared token loading, validation and naming-lint logic (no external dependencies).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export const TIERS = ['primitive', 'semantic', 'component'];
export const CATEGORIES = ['color', 'font', 'space', 'radius', 'shadow', 'motion', 'z'];
export const TYPES = ['color', 'dimension', 'duration', 'cubicBezier', 'number', 'fontFamily', 'fontWeight', 'shadow'];
export const COLOR_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950', 'dark-fill'];
export const HUES = ['blue', 'red', 'yellow', 'green', 'neutral'];
export const MAX_ALIAS_DEPTH = 4;
export const MAX_SEGMENTS = 7;
const FORBIDDEN_WORDS = ['admin', 'broker', 'customer'];
const COLOUR_WORDS = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'orange', 'purple', 'pink', 'grey', 'gray'];

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const REF = /^\{([^{}]+)\}$/;

export function listJson(dir) {
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...listJson(p));
    else if (name.endsWith('.json')) out.push(p);
  }
  return out;
}

export function loadFiles(root, tokensDir = 'tokens') {
  const base = join(root, tokensDir);
  return listJson(base).map((p) => ({ file: relative(root, p).split(sep).join('/'), tree: JSON.parse(readFileSync(p, 'utf8')) }));
}

/** Flatten a DTCG tree into token records, inheriting $type from groups. */
export function flatten(tree, file = '', prefix = [], inheritedType) {
  const out = [];
  const type = isObject(tree) && typeof tree.$type === 'string' ? tree.$type : inheritedType;
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith('$')) continue;
    const segments = [...prefix, key];
    if (isObject(node) && '$value' in node) {
      out.push({ path: segments.join('.'), segments, file, type: node.$type ?? type, value: node.$value, token: node });
    } else if (isObject(node)) {
      const hasChildren = Object.keys(node).some((k) => !k.startsWith('$'));
      // A node carrying $type/$description but no children and no $value is a token missing its value.
      if (!hasChildren && Object.keys(node).length) out.push({ path: segments.join('.'), segments, file, type: node.$type ?? type, value: undefined, token: node });
      else out.push(...flatten(node, file, segments, type));
    } else {
      out.push({ path: segments.join('.'), segments, file, type, value: undefined, token: node, malformed: true });
    }
  }
  return out;
}

/** Combine several files; returns {tokens, errors} (errors for duplicate paths). */
export function combine(files) {
  const map = new Map();
  const errors = [];
  for (const { file, tree } of files) {
    for (const t of flatten(tree, file)) {
      if (map.has(t.path)) errors.push(`${t.path}: defined twice (${map.get(t.path).file} and ${file})`);
      else map.set(t.path, t);
    }
  }
  return { tokens: map, errors };
}

const dimension = /^-?\d+(\.\d+)?(px|rem)$/;
const duration = /^\d+(\.\d+)?(ms|s)$/;
const colour = /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/;

function checkShadowItem(v) {
  if (!isObject(v)) return 'shadow must be an object with color, offsetX, offsetY, blur, spread';
  for (const k of ['color', 'offsetX', 'offsetY', 'blur', 'spread']) {
    if (!(k in v)) return `shadow is missing "${k}"`;
  }
  if (!colour.test(v.color)) return 'shadow color must be a hex colour';
  for (const k of ['offsetX', 'offsetY', 'blur', 'spread']) if (!dimension.test(v[k])) return `shadow ${k} must be a dimension`;
  return null;
}

/** Returns an error string for a literal (non-reference) value of the given type, or null. */
export function checkLiteral(type, value) {
  switch (type) {
    case 'color': return colour.test(value) ? null : 'colour must be a hex string (#RRGGBB or #RRGGBBAA)';
    case 'dimension': return typeof value === 'string' && dimension.test(value) ? null : 'dimension must look like 16px or 1rem';
    case 'duration': return typeof value === 'string' && duration.test(value) ? null : 'duration must look like 200ms';
    case 'cubicBezier':
      return Array.isArray(value) && value.length === 4 && value.every((n) => typeof n === 'number') && value[0] >= 0 && value[0] <= 1 && value[2] >= 0 && value[2] <= 1
        ? null : 'cubicBezier must be four numbers with x values between 0 and 1';
    case 'number': return typeof value === 'number' && Number.isFinite(value) ? null : 'number must be a finite number';
    case 'fontWeight': return typeof value === 'number' && value >= 1 && value <= 1000 ? null : 'fontWeight must be a number from 1 to 1000';
    case 'fontFamily': return (typeof value === 'string' && value.length) || (Array.isArray(value) && value.length && value.every((s) => typeof s === 'string')) ? null : 'fontFamily must be a string or a non-empty array of strings';
    case 'shadow': return Array.isArray(value) ? (value.map(checkShadowItem).find(Boolean) ?? null) : checkShadowItem(value);
    default: return `unknown type "${type}"`;
  }
}

const tierOf = (path) => path.split('.')[1];

/** DTCG validity: structure, types, values, references, cycles, tier direction. */
export function validate(tokens) {
  const errors = [];
  for (const t of tokens.values()) {
    if (t.malformed) { errors.push(`${t.path}: not a token or group (missing $value)`); continue; }
    if (t.value === undefined || t.value === null || t.value === '') { errors.push(`${t.path}: missing $value`); continue; }
    if (!t.type) { errors.push(`${t.path}: missing $type (set it on the token or its group)`); continue; }
    if (!TYPES.includes(t.type)) { errors.push(`${t.path}: unknown $type "${t.type}"`); continue; }
    if (typeof t.value === 'string' && REF.test(t.value)) {
      const target = t.value.match(REF)[1];
      const ref = tokens.get(target);
      if (!ref) { errors.push(`${t.path}: references missing token ${target}`); continue; }
      if (ref.type && ref.type !== t.type) errors.push(`${t.path}: type ${t.type} references ${target} of type ${ref.type}`);
      const from = tierOf(t.path), to = tierOf(target);
      const rank = { primitive: 0, semantic: 1, component: 2 };
      if (rank[to] > rank[from]) errors.push(`${t.path}: upward reference from ${from} to ${to} (${target})`);
      if (from === 'component' && to === 'primitive' && t.type === 'color') errors.push(`${t.path}: component colour tokens must reference semantic tokens, not primitives`);
    } else {
      const problem = checkLiteral(t.type, t.value);
      if (problem) errors.push(`${t.path}: ${problem}`);
    }
  }
  // cycles and depth
  for (const t of tokens.values()) {
    const seen = [t.path];
    let cur = t;
    let depth = 0;
    while (cur && typeof cur.value === 'string' && REF.test(cur.value)) {
      const next = cur.value.match(REF)[1];
      if (seen.includes(next)) { errors.push(`${t.path}: circular reference (${[...seen, next].join(' -> ')})`); break; }
      seen.push(next);
      cur = tokens.get(next);
      depth += 1;
      if (depth > MAX_ALIAS_DEPTH) { errors.push(`${t.path}: alias chain deeper than ${MAX_ALIAS_DEPTH}`); break; }
    }
  }
  return errors;
}

/** Naming rules (docs/architecture.md section 4). Pass the token's file to check tier/folder agreement. */
export function lintNames(tokens) {
  const errors = [];
  for (const t of tokens.values()) {
    const s = t.segments;
    const name = t.path;
    if (s[0] !== 'shamallya') { errors.push(`${name}: must start with "shamallya."`); continue; }
    if (!TIERS.includes(s[1])) { errors.push(`${name}: second segment must be a tier (${TIERS.join(', ')})`); continue; }
    if (t.file && !t.file.includes(`/${s[1]}/`)) errors.push(`${name}: tier "${s[1]}" does not match its folder (${t.file})`);
    // Component tokens are grouped by component name (shamallya.component.<component>.<part>.<property>); the category is the token type.
    if (s[1] !== 'component' && !CATEGORIES.includes(s[2])) errors.push(`${name}: third segment must be a category (${CATEGORIES.join(', ')})`);
    if (s[1] === 'component' && s.length < 4) errors.push(`${name}: component tokens need a component and a property`);
    if (s.length > MAX_SEGMENTS) errors.push(`${name}: more than ${MAX_SEGMENTS} segments`);
    for (const seg of s) {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(seg)) errors.push(`${name}: segment "${seg}" must be lowercase kebab-case`);
      if (FORBIDDEN_WORDS.some((w) => seg.includes(w))) errors.push(`${name}: segment "${seg}" contains a forbidden role word`);
    }
    if ((s[1] === 'semantic' || s[1] === 'component') && s.slice(3).some((seg) => COLOUR_WORDS.includes(seg))) {
      errors.push(`${name}: semantic and component names must use roles, not colour words`);
    }
    if (s[1] === 'primitive' && s[2] === 'color' && s[3] !== 'white') {
      if (!HUES.includes(s[3])) errors.push(`${name}: unknown hue "${s[3]}"`);
      else if (!COLOR_STEPS.includes(s[4] ?? '')) errors.push(`${name}: colour step "${s[4]}" is not one of ${COLOR_STEPS.join(', ')}`);
    }
    if ('$deprecated' in t.token && typeof t.token.$deprecated !== 'string') errors.push(`${name}: $deprecated must be a string naming the replacement`);
  }
  return errors;
}

/** Resolve every token to its final literal value. overrides: Map path->token record replacing the base one. */
export function resolveAll(tokens, overrides = new Map()) {
  const get = (p) => overrides.get(p) ?? tokens.get(p);
  const out = new Map();
  const resolve = (p) => {
    const t = get(p);
    let v = t.value;
    let guard = 0;
    while (typeof v === 'string' && REF.test(v)) {
      v = get(v.match(REF)[1]).value;
      if (++guard > 20) throw new Error(`reference loop at ${p}`);
    }
    return v;
  };
  for (const p of tokens.keys()) out.set(p, resolve(p));
  return out;
}

// ---- Contrast (WCAG 2.2 relative luminance) ----
const channel = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
export function luminance(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
