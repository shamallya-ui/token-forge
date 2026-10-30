# ADR-0008: Lucide icons; tags keep their colours with a neutral option

- Status: Accepted. Icons chosen by Claude on Shamala's instruction; tags keep colours (Shamala); tag palette warmed and tokens lead, apps follow (Shamala, 2026-10-30)
- Date: 2026-10-30

## Context
The deployed Vibgyor site uses emoji as status markers and coloured tags for subjects and circular categories. The library needs an icon set (PRD Q9), and tag colours must coexist with the five brand hues and status colours.

## Decision
1. **Icons:** use Lucide (open source, ISC licence). It is the icon set used by shadcn/ui and shadcn-svelte, has React and Svelte 5 packages, and is consistent in stroke style. Emoji are not used as UI icons. Every icon that carries meaning has a text label or accessible name.
2. **Tags:** keep the existing coloured tags and also offer a neutral variant. Each tag can be used as coloured or neutral; neutral is the default where colour adds no meaning. Colour never carries meaning alone (the tag text names the subject or category).
3. **Tag colours are a separate categorical token group**, not the brand or status hues: `shamallya.semantic.color.tag.<name>.background`, `.text` and `.border`, with a light and a dark value each, plus `tag.neutral`.

## Existing tag hue families (from the Vibgyor source, observed 2026-10-30)

| Tag | Hue family | Light pair (text on background) | Computed contrast |
|-----|-----------|----------------------------------|-------------------|
| Subject: Mathematics | blue | #1e40af on #dbeafe | about 7.1:1 |
| Subject: English, Language, Literature | amber | #92400e on #fef3c7 | about 6.4:1 |
| Subject: Science | green | #166534 on #dcfce7 | about 6.5:1 |
| Subject: Robotics | purple | #6b21a8 on #f3e8ff | about 7.4:1 |
| Subject: Kannada | orange | #9a3412 on #ffedd5 | about 6.4:1 |
| Subject: Hindi | red | #991b1b on #fee2e2 | about 6.8:1 |
| Subject: SPA, Art, Physical | pink | #9d174d on #fce7f3 | about 6.7:1 |
| Subject: Computers | indigo | #3730a3 on #e0e7ff | about 8.1:1 |
| Subject default and category Admin | slate | #334155 on #f1f5f9 | about 9.5:1 |
| Category: Academic | blue | uses the same blue family as Mathematics | not separately computed |
| Category: Sports | emerald | green family | not separately computed |
| Category: Events | purple | purple family | not separately computed |

## Consequences
- All nine light pairs above pass the 4.5:1 text target as computed; dark pairs and the category pairs must be added to the contrast job in Phase 2.
- Because red-, green- and amber-family tags exist, status meaning must always come from icon and label, never from a tag's hue (reinforces the non-colour rule).
- Shamala decided the tag palette is **warmed to match palette B** and that **the tokens lead and the apps follow**: Vibgyor's current tag colours are not binding and will be replaced by these tokens when it adopts the library.

## Warmed tag palette (confirmed by Shamala; replaces the app's current colours)

Built by mixing each hue family with the cream (#FAF7F2) in light mode and the warm black (#1C1917) in dark mode. Contrast computed in prose below; the Phase 2 job is authoritative. Policy: text at least 5.5:1; these all clear 7:1.

| Tag family | Light: text / background / border | Light contrast | Dark: text / background / border | Dark contrast |
|-----------|-----------------------------------|----------------|----------------------------------|---------------|
| blue | #142A5D / #DFE5F5 / #C3CEE7 | about 11.0:1 | #BACBF4 / #202639 / #313D5B | about 9.3:1 |
| amber | #5D4214 / #F8EEDB / #EADBC0 | about 8.1:1 | #F5DEB9 / #3B2F1E / #5C4C2F | about 9.9:1 |
| green | #205D14 / #E3F7DB / #CAE9C0 | about 7.1:1 | #C4F4B9 / #24391E / #385C2F | about 10.1:1 |
| purple | #3E145D / #EEDEF5 / #DAC2E7 | about 11.2:1 | #DCBAF4 / #2F1E39 / #4A305B | about 9.1:1 |
| orange | #5D2C14 / #F8E6DB / #EACFC0 | about 9.4:1 | #F5CDB9 / #3B271E / #5C3F2F | about 9.6:1 |
| red | #5D1A14 / #F8E0DB / #EAC6C0 | about 10.3:1 | #F5BEB9 / #3B201E / #5C342F | about 9.2:1 |
| pink | #5D1432 / #F8DEE6 / #EAC2D0 | about 10.3:1 | #F5BAD1 / #3B1E28 / #5C3042 | about 9.1:1 |
| indigo | #1D145D / #E3DEF5 / #C9C2E7 | about 12.2:1 | #C2BAF4 / #231E39 / #37305B | about 8.8:1 |
| neutral (stone) | #44403C / #F1EDE6 / #E3DDD3 | about 8.8:1 | #E7E2DA / #2A2623 (border to be chosen) | about 11.6:1 |

Mapping from today's app: Mathematics and Academic use blue; English uses amber; Science and Sports use green; Robotics and Events use purple; Kannada uses orange; Hindi uses red; SPA uses pink; Computers use indigo; default subject and Admin use neutral. The dark tint is deliberately quiet so tags do not outshine the five brand hues. These are text-on-tint pairs for tags only, not new brand hues.
