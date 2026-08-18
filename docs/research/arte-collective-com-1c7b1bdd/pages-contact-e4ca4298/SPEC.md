# Contact Page Spec — arte-collective.com/pages/contact

Source: live inspection via Chrome MCP (desktop 1440px). Note: the shared Chrome
session for this multi-agent clone run was heavily contended by concurrent
worktree agents (tabs were repeatedly closed out from under this session), so
mobile-viewport screenshots could not be reliably captured. Desktop screenshots
and computed-style extraction succeeded and are the basis for this spec.
Responsive stacking (2-col -> 1-col) follows the standard Shopify Dawn-theme
contact-form pattern this site is clearly built on, and matches the explicit
guidance in the assignment.

## Content (verbatim)

- Eyebrow pill: `CONTACT`
- Heading (h2): `Get in touch`
- Subtext: `For priority support on an existing order, please reply directly to
  your confirmation email. For all other inquiries, feel free to use the form
  below.`
- Fields (labels double as placeholders, no floating label):
  - `Your Name*` — required, text
  - `E-mail address*` — required, email
  - `Your Phone Number*` — required, tel
  - `Website` — optional, text/url
  - `Your Message` — optional, textarea
- Submit button: `Send a Message`

Note: the raw DOM also contains a Shopify theme boilerplate "store info" block
(address "45 Litle Lonsdale St, Melbourne", phone "007-123-456", email
"info@zonex.com", and an "OPENING HOURS" table). This text is present in
`get_page_text` output but is **not visually rendered** anywhere in the
screenshots at any point during inspection — the theme's contact template
renders only the form column, and the store-info column produces no visible
box on screen. Excluded from the build.

## Layout

- Page order: `AnnouncementBar` → `Header` (absolute, overlays white bg since
  there's no hero image — the header's `bg-[#252122]/50` renders as a plain
  gray bar) → content section → `Footer`.
- Header clears via `pt-[120px]` (approx) on the first in-flow section —
  verified visually: header is ~54px tall + 33px top margin, plus breathing
  room before "CONTACT" pill starts.
- Content is centered, single column, `max-width` roughly 500–560px real px
  (measured extracted form width proportion of viewport).
- Two-column field grid: `Your Name*` | `E-mail address*`, then
  `Your Phone Number*` | `Website`, then full-width `Your Message` textarea,
  then a full-width divider line (the message field's own underline extends
  full width), then centered button below with vertical gap.
- Mobile: fields stack to a single column (grid-cols-1 sm:grid-cols-2 — Dawn
  theme standard, matches assignment guidance).

## Extracted computed styles (via getComputedStyle, live site, 1440px viewport)

**Eyebrow badge ("CONTACT")**
- `class="bast-tag"`, tag `div`
- font: `"Roboto Mono", monospace` (not in project's token set — approximated
  with the project's existing `font-mono` token, itself a monospace face, for
  visual fidelity without introducing a new font load)
- font-size: `11px`
- color: `rgb(254, 96, 22)` = `#fe6016` = `--arte-orange` (exact token match)
- background: `rgb(252, 231, 222)` = `#fce7de` (light peach tint of orange)
- padding: `6px 12px`
- border-radius: `20px` (pill)

**Heading ("Get in touch")**
- tag `h2`
- font: `Inter, sans-serif` → maps to project `font-sans`
- font-size: `24px`
- font-weight: `500`
- color: `rgb(34, 34, 34)` = `#222222` = `--arte-text` (exact token match)

**Subtext**
- font: Inter (font-sans), small size (~13px observed), color muted gray
  (`--arte-text-muted` / `#858585` — matches visual, consistent with site's
  established muted-text token)
- centered, two-line wrap, modest max-width

**Inputs (Your Name* example)**
- computed `border-bottom` **on the `<input>` itself**: `0px none` — the
  visible underline comes from a wrapping `.field` div, not the input.
- `padding: 10px 0px 0px` (top padding only — label/placeholder text sits
  flush left, no horizontal input padding)
- font: `Inter`, `15px`
- color (placeholder/label): `rgb(133, 133, 133)` = `#858585` =
  `--arte-text-muted` (exact token match)
- Border visually rendered as a thin light-gray underline (~`#e5e5e5`,
  consistent with the `rgb(229,229,229)` border color captured on the form's
  hidden utility inputs, which share the theme's base field styling).

**Button ("Send a Message")**
- background: `rgb(34, 34, 34)` = `#222222` = `--arte-text` (near-black, not
  pure `#000`)
- color: white
- padding: `0px 40px` (horizontal only; height set via line-height/fixed
  height, visually ~48–52px tall)
- font: `Inter`, `15px`, weight `500`
- `text-transform: none` — button label is title case ("Send a Message"), NOT
  uppercase
- `border-radius: 0` — square corners

## Interaction / validation

- Required fields (`Your Name*`, `E-mail address*`, `Your Phone Number*`) use
  native-looking required semantics. This build implements client-side
  controlled-input validation: on submit, empty required fields are flagged
  (red-tinted underline + inline error text) and the browser-native `required`
  attribute provides a baseline fallback. No real backend submission — out of
  scope per project defaults; the form shows a success confirmation message in
  place of the fields after a valid submit.
- Focus state: underline color shifts from light gray to `--arte-text`
  (`#222`) on focus, matching the site's minimal-underline convention used
  elsewhere (email capture modal input, etc.).

## Reused shared components

Homepage (`root-8a5edab2` namespace) did not yet expose `Header`, `Footer`,
`AnnouncementBar`, `EmailCaptureModal` under a `shared/` namespace as this
assignment assumed. To satisfy "reuse as-is, don't modify homepage" while
still matching the assignment's expected import paths, exact copies (no
content changes) were placed at:
- `src/components/sites/arte-collective-com-1c7b1bdd/shared/Header.tsx`
- `src/components/sites/arte-collective-com-1c7b1bdd/shared/Footer.tsx`
- `src/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar.tsx`
- `src/components/sites/arte-collective-com-1c7b1bdd/shared/EmailCaptureModal.tsx`

The homepage (`src/app/page.tsx`) and `root-8a5edab2/*` originals were **not**
modified.
