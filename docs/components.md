# Token Forge: Component List

Version 0.2 · Resolves PRD Q4 (for Shamala's confirmation) · Brand: ShaMallya · Namespace: `shamallya.`

**V1 = what the deployed Vibgyor site needs.** **V2 = what the Konkani Meal Planner adds.**

Sources:
- V1: the deployed site https://shamala.github.io/ClassUpdates-Vibgyor/ (sample board, all three tabs, name dialog, passcode gate, word modal, notice modal), cross-checked against `ClassUpdates-Vibgyor/frontend/` (`index.html`, `src/**/*.svelte`). Observed on 2026-10-30. No app code or data was changed; only the "See a sample" board was opened.
- V2: `Konkani Meal Planner/REQUIREMENTS.md` and `context.md`.

Framework basis follows architecture section 7 (shadcn/ui for React, shadcn-svelte for Svelte 5). Vibgyor is the Svelte 5 first adopter (ADR-0006).

## 1. What the deployed Vibgyor site contains

| Area | Elements seen |
|------|---------------|
| Passcode gate | Heading, helper text, password field with Show passcode button, "View class updates" submit, "last refreshed N hours ago" line, "See a sample" link-button |
| Parent-portal sign-in | Hidden on purpose in the public build (Shamala confirmed); out of scope for the library. Only the passcode screen is user-facing |
| Name dialog | "Whose updates are these?" modal with one text field, Cancel, Save name |
| Header and controls | Brand title and subtitle, student name and class, date select, dark/light toggle, Install App, Sync Now, student avatar and name, last-synced text, Lock button |
| Tabs | Daily Diary, Weekly Overview, Circulars and Notices |
| Daily Diary | Words of the Day hero with Word History button and word chips; Active Homework list with checkbox, subject, due date, title, "Action Needed" tag and "n/2 Done" counter; Teacher's Note panel; Class Work and Timetable: per-period cards (subject heading, session count, topic, sub-topic, class work, skill assessed, homework with checkbox and "Due" status) |
| Weekly Overview | Weekly Dictation Bank (word list), Weekly Homework Deadlines (list of subject, title, date), 5-Day Curriculum Coverage (day cards with HW count, dictation words, assigned homework, "View Daily Diary" link) |
| Circulars | Category filter buttons (All Notices, Academic, Events, Sports, Admin), search field, notice cards (category badge, date, title, summary, source, Open in App, Read Notice) |
| Word modal | List / Flashcards mode switch, flashcards that read words aloud, Close |
| Notice modal | Category badge, date, title, content, Download PDF link, Close |
| Feedback | Toast, loading messages ("Loading timetable updates...") |

## 2. V1 component list (Vibgyor)

| # | Component | Where it appears | Notes for the library |
|---|-----------|------------------|-----------------------|
| V1-01 | Button (primary, secondary, ghost, icon-only, destructive-light) | Submit, Sync Now, Install App, Lock, Cancel, Save name, Close, Read Notice, Open in App, Word History | Loading state with spinner; disabled-with-reason |
| V1-02 | Link-button (text link styled as a button) | See a sample, View Daily Diary, Download PDF | |
| V1-03 | Text input with label | Child's name, username | Label, helper, error |
| V1-04 | Password input with show/hide toggle | Passcode, password | Toggle labelled and keyboard operable |
| V1-05 | Search field | Circulars search | Clear button; live filter |
| V1-06 | Select (native-first) | Date selector | Options can carry a status marker ("HW Due") as icon plus text, not emoji |
| V1-07 | Checkbox | Homework tick (appears in two places) | About 44 px touch target; checked state announced; "n/N Done" summary |
| V1-08 | Tabs (primary navigation) | Daily Diary, Weekly Overview, Circulars | Scrollable on narrow screens |
| V1-09 | Filter chip group (single select) | All Notices, Academic, Events, Sports, Admin | Selected state not by colour alone |
| V1-10 | Segmented control | Word modal: List / Flashcards | |
| V1-11 | App header | Brand, student info, controls | Responsive: collapses controls on phones |
| V1-12 | Avatar (initials) | Student avatar | |
| V1-13 | Theme toggle | Dark/light button | Uses `shamallya` modes; also "auto" |
| V1-14 | Card / panel | Period cards, day cards, notice cards, teacher note, homework panel | Raised surface token |
| V1-15 | Section heading with subtitle | Every region ("Class Work and Timetable" with helper line) | Typography tokens |
| V1-16 | List and list row | Homework list, weekly deadlines, dictation list | Leading, content, trailing slots |
| V1-17 | Key-value row | Topic, Sub Topic, Class Work, Skill Assessed | Label/value pairs; dense |
| V1-18 | Badge / tag (category, subject, count) | Notice categories, "Action Needed", "2 Sessions", "2 HW", "No HW" | Coloured or neutral variant, chosen per use (ADR-0008) |
| V1-19 | Status indicator (icon plus label) | "Due", "Action Needed", "HW Due", last-refreshed freshness (amber when stale) | Never colour alone; replaces the emoji used today |
| V1-20 | Highlight hero | Words of the Day | Yellow fill with dark ink; word chips inside |
| V1-21 | Word chip | apple, river, ... | Selectable/speakable |
| V1-22 | Flashcard | Word modal | Large display type, speak button, previous/next |
| V1-23 | Callout / note block | Teacher's Note | Quiet tinted surface |
| V1-24 | Alert / inline notice | Invalid username or password, privacy note, stale warning | Variants info, success, warning, danger; announced to screen readers |
| V1-25 | Toast | Confirmations | Auto-dismiss; polite live region |
| V1-26 | Modal dialog | Name dialog, word modal, notice modal | Focus trap, Escape, scroll lock, labelled title |
| V1-27 | Loading indicator and loading message | Spinner, "Loading timetable updates..." | Respect reduced motion |
| V1-28 | Empty state | "No homework assigned", no circulars found | Icon, message, optional action |
| V1-29 | Day card (pattern) | 5-Day Curriculum Coverage | Composed of card, badge, list, link |
| V1-30 | Period card (pattern) | Class Work and Timetable | Composed of card, heading, key-value rows, checkbox |
| V1-31 | Icon set | Eye, sun, moon, sync, lock, download, speaker, check, clock | Lucide (ADR-0008) |
| V1-32 | Layout primitives | Page shell, responsive grid for day cards, stack, container, safe-area | Built on spacing tokens |
| V1-33 | Install prompt (PWA pattern) | Install App | Pattern, not a heavy component |

Patterns V1-29 and V1-30 are product-level; they ship as documented patterns first and are promoted to `@shamallya/ui` only if another app reuses them (see section 5).

## 3. V2 component additions (Konkani Meal Planner)

**Deferred (Shamala, 2026-10-30): V2 needs refinement and will be added later.** The rows below are a working draft, not approved.

Not needed by Vibgyor today; planned after V1 is stable.

| # | Component | Source requirement | Notes |
|---|-----------|--------------------|-------|
| V2-01 | Bottom tab bar | Pantry, Menu, Search (Grocery in Phase 2) | Safe-area padding; 44 px targets |
| V2-02 | Screen header with labelled back button | Navigation in all screens | Extends V1-11 |
| V2-03 | Segmented control with "none selected" and tap-again-to-clear | Pantry little / some / plenty | Extends V1-10 |
| V2-04 | Category row with expandable item tags | Eight pantry categories, item tags (later phase) | Accordion plus chips |
| V2-05 | Removable chip | Item tags | Extends V1-09 |
| V2-06 | Role tag | saar, rasam, kadi, upkari, etc. | Category colour tokens |
| V2-07 | Dish row with swap action | Weekly menu | List row plus ghost button |
| V2-08 | Meal slot section | Breakfast, lunch, evening tea, dinner | Pattern |
| V2-09 | Day card for the weekly menu | 7 days by 4 slots | Pattern; shares V1-29 structure |
| V2-10 | Ingredient row with Have / Buy status | Recipe detail | Status with icon and text |
| V2-11 | Numbered method steps | Recipe detail | Stepper / ordered list |
| V2-12 | Recipe detail sheet | Opened from menu or search | Bottom sheet on phones, dialog on larger screens |
| V2-13 | Bottom sheet / drawer | Itemised pantry entry, recipe detail | Mobile-first alternative to modal |
| V2-14 | Progress bar | Pantry setup | |
| V2-15 | Disabled button with inline reason | "Generation needs at least two categories" | Button pattern, plus hint text |
| V2-16 | Toggle switch | Healthy / vegan / quick (later phases), kid-friendly tag | |
| V2-17 | Grocery list item (checkbox, manual item, derived item) | Phase 2 | Extends V1-07 |
| V2-18 | Skeleton | Recipe bundle loading | |
| V2-19 | Tooltip | Optional | Low priority |
| V2-20 | Action menu | Per-dish actions | Low priority |
| V2-21 | Language switcher | Kannada localisation (Phase 6) | Needs Kannada-capable fonts |

## 4. Coverage and cross-cutting requirements

| Need | Source | Effect on the system |
|------|--------|----------------------|
| Offline-first, installable PWA | Both apps | No network dependence in components |
| Touch targets about 44 px, mobile-first | Both | Sizing and spacing tokens |
| Light, dark and auto modes | Both | Mode precedence in architecture section 5 |
| Stale-data warning in amber | Vibgyor | Warning status with icon and label |
| Emoji used as status markers today (pin, hourglass, lock) | Vibgyor | Replace with icons plus labels when migrating |
| Large readable display type for words | Vibgyor | A "display word" type step |
| Privacy: no tracking | Vibgyor | No analytics in components |
| Never imply a comparison that did not happen | Konkani | Content guideline for notices |

## 5. Decisions and open questions

Decided by Shamala (2026-10-30):
1. The V1 list is approved as written (33 rows). The period card and day card remain patterns (built in the app first).
2. Tags keep their colours; each tag can be used coloured or neutral (ADR-0008, categorical `tag` token group).
3. Icons: Lucide, chosen by Claude on Shamala's instruction (ADR-0008).

Also decided:
4. The passcode gate is not a library pattern; it stays in the app, built from library parts.
5. The tag palette is warmed to match palette B (proposed values in ADR-0008). Principle: **tokens lead, apps follow**; Vibgyor's current colours are replaced by the tokens when it adopts the library.

Confirmed by Shamala (2026-10-30):
6. The warmed tag values in ADR-0008 are confirmed.
7. The upstream portal sign-in form is hidden on purpose in the public build. Only the passcode screen is user-facing; the portal login is not, so it is **out of scope for the library** (no component is planned for it).

Nothing is open on the V1 list.

## 6. Documentation Updates

Architecture section 7 points here; testing-matrix needs cross-framework cases per V1 row (section 8 of the matrix). V2 rows start their test cases when V2 begins.
