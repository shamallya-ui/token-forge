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

Patterns V1-29 and V1-30 are product-level; they ship as documented patterns first and are promoted to `@shamallya-ui/components` only if another app reuses them (see section 5).

## 3. V2 component additions (Konkani Meal Planner)

**Superseded (2026-11-03).** The earlier 21-row draft is replaced by the development agent's inventory (30 components, C1 to C30) in `Konkani Meal Planner/app/COMPONENTS.md`. That file is now the first intake in the component project's requirements file, `ShaMallya Components/components.md`, which is the single place any team adds component requests. This repo keeps only the token-side consequences below.

Triage of the 30 planner components (decided 2026-11-03):

| Bucket | Components |
|--------|-----------|
| shadcn primitive, theme only | C11 cooked tick (Checkbox or Switch), C12 week switcher (ToggleGroup or Tabs), C18, C20, C21 (Button variants), C22 search field, C23 filter chip (single-select ToggleGroup), C24 day accordion, C26 confirm dialog, C27 notice banner, C28 setting toggle, C29 schedule field |
| Library composite | C1 tab bar, C2, C3 headers, C4 back link, C5 section heading, C6 caption, C7 grouped list card, C8 list row, C9 slot card, C13 day row, C14 frozen-week block, C25 slot picker row, C30 zero-results state |
| Stays in the planner | C10 dish row, C15 planned label row, C16 page-number block, C17 ingredient row, C19 method step list (revisit if a second app needs them) |

Token consequences (see architecture section 18, ADR-0009, ADR-0010, ADR-0011): add `surface.canvas` and `border.subtle`; add a comfortable touch mode; add display and title type sizes; build a slate-teal theme for the planner. Most other "missing" tokens in the planner's list already exist under different names.

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
