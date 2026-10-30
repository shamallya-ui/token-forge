// Generates tokens/primitive/color.json from the decided anchors (ADR-0007).
// Run with: npm run ramps. The output is committed; edit anchors here, not in the JSON.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WHITE = [255, 255, 255];
const INK = [0x1c, 0x19, 0x17];

const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgbToHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, t) => a.map((v, i) => v * (1 - t) + b[i] * t);
const mixHex = (a, b, t) => rgbToHex(mix(hexToRgb(a), b, t));

// base = 500 anchor; text400 = decided dark-mode text step; fixed = explicit overrides
const hues = {
  blue: { base: '#1D4ED8', text400: '#7A9AF4', darkFill: true },
  red: { base: '#B03608', text400: '#E8794A', darkFill: true },
  yellow: { base: '#EAB308', text400: '#F2C230', fixed: { 700: '#854D0E' } },
  green: { base: '#3F6B0B', text400: '#8DB84F', darkFill: true },
};

const colour = (value, description) => ({ $value: value, $type: 'color', ...(description ? { $description: description } : {}) });

const color = {};
for (const [name, h] of Object.entries(hues)) {
  const r = {};
  r['400'] = colour(h.text400, 'Dark-mode text step');
  r['500'] = colour(h.base, 'Brand anchor');
  r['300'] = colour(mixHex(h.text400, WHITE, 0.3));
  r['200'] = colour(mixHex(h.text400, WHITE, 0.55));
  r['100'] = colour(mixHex(h.text400, WHITE, 0.78));
  r['50'] = colour(mixHex(h.text400, WHITE, 0.9));
  if (h.fixed) {
    // Hues with a fixed text step keep the ramp monotonic around it.
    const fixed = h.fixed[700];
    r['600'] = colour(mixHex(h.base, hexToRgb(fixed), 0.5));
    r['700'] = colour(fixed, 'Text step for light surfaces (ochre)');
    r['800'] = colour(mixHex(fixed, INK, 0.3));
    r['900'] = colour(mixHex(fixed, INK, 0.55));
    r['950'] = colour(mixHex(fixed, INK, 0.75));
  } else {
    const dark = { 600: 0.15, 700: 0.3, 800: 0.5, 900: 0.68, 950: 0.82 };
    for (const [step, t] of Object.entries(dark)) r[step] = colour(mixHex(h.base, INK, t));
  }
  r['dark-fill'] = colour(h.darkFill ? mixHex(h.base, WHITE, 0.12) : h.base, h.darkFill ? 'Dark-mode fill: base lifted about 12% toward white' : 'Dark-mode fill: unchanged');
  color[name] = Object.fromEntries(Object.keys(r).sort((a, b) => (a === 'dark-fill') - (b === 'dark-fill') || Number(a) - Number(b)).map((k) => [k, r[k]]));
}

// Neutrals derived from the warm black #1C1917; 50 is the cream page background.
color.neutral = {
  50: colour('#FAF7F2', 'Cream, light page background'),
  100: colour('#F1EDE6'),
  200: colour('#E3DDD3'),
  300: colour('#D3CCC1'),
  400: colour('#A8A094'),
  500: colour('#78716C'),
  600: colour('#5C554F'),
  700: colour('#44403C'),
  800: colour('#2A2623'),
  900: colour('#1C1917', 'Warm black, brand ink and dark page background'),
  950: colour('#12100F'),
};
color.white = colour('#FFFFFF');

const out = { shamallya: { primitive: { color } } };
const file = fileURLToPath(new URL('../tokens/primitive/color.json', import.meta.url));
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
console.log('wrote tokens/primitive/color.json');
