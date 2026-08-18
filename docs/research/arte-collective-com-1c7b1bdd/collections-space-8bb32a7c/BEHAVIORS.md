# Behaviors — /collections/space

## ALL / NEW filter chips

- Real, working Shopify facet filter, not a fake client-side toggle.
- "ALL" → `/collections/space` (all 131 products)
- "NEW" → `/collections/space?filter.p.m.custom.new_arrival=true` (a
  metafield-based facet; confirmed by fetching that URL directly and
  diffing the rendered product handles against the base collection — 20
  unique products returned, no pagination on that filtered view)
- **Our implementation**: real client-side filter over the local product
  data. Each product in `data/products.ts` carries a `badges` array; the NEW
  chip filters to products whose `badges` include `"NEW"`. This exactly
  reproduces the real filter's result set (same 20 handles) without a
  server round trip.

## "FILTER BY" button

- On the live site this is a small proxy button (`#ac-open-filters`) whose
  only job is to dispatch a synthetic click on the theme's native
  Shopify facet-filter trigger (it searches for
  `#FacetFiltersFormToggle`, `#FacetFiltersOpen`, `.facets__open`, etc.).
- No native facets markup (`#FacetFiltersForm` or similar) was present in
  the static HTML for this collection on any of the 3 pages fetched, which
  means either: (a) native filtering is disabled for this collection, or
  (b) the facets panel is only injected client-side on first click. This
  could not be resolved further because live browser automation on this
  domain repeatedly triggered an unrelated pop-under/redirect script (see
  "Known site issue" below), which made deep interactive DOM inspection of
  the opened drawer unreliable.
- **Our implementation**: a lightweight, self-contained filter drawer
  (slide-in panel from the right, matching the mobile hamburger menu's
  visual language) exposing plausible facets for a print shop — Size
  (12"x18" / 20"x30" / 24"x36"), Price range, and Availability — with a
  local "Apply"/"Clear" affordance. It does not attempt to replicate
  Shopify's native `Search & Discovery` filtering logic, per the task's
  explicit allowance for a lightweight version here.

## Sticky "GET 10% OFF" pill while scrolling

- Not present in the static HTML for any of the 3 collection pages fetched,
  and could not be reliably observed live (see "Known site issue" below —
  every attempt to scroll/interact on the live tab was hijacked by a
  redirect before the trigger point could be confirmed).
- **Our implementation**: a best-effort, faithful small floating pill
  (bottom-right, fixed position) that fades/slides in once the user has
  scrolled past ~400px, reading "GET 10% OFF" in the arte-orange color,
  and opens the same `EmailCaptureModal` on click. Documented as an
  approximation in `FloatingDiscountPill.spec.md`.

## Product grid pagination

- Real site: server-rendered 50 products/page, with `data-load-more
  data-load-onscroll` infinite-scroll (fetches `?page=2`, `?page=3` as the
  user nears the bottom).
- **Our implementation**: all 131 products are available in the local data
  module (no server round trip needed), but we replicate the *progressive
  reveal* UX with a client-side `IntersectionObserver` that reveals products
  in batches of 24 as a sentinel scrolls into view, so the page doesn't
  dump all 131 image requests at once and still "feels" like the real
  infinite-scroll grid.

## Hover / interaction states

- Product cards: image swaps in real site's "quick view"/hover-swap
  affordance were not reliably observable live; we kept the shared
  `ProductCard`'s existing hover treatment (opacity transition on image)
  applied to the new `SpaceProductCard`.
- Chips: `transform: translateY(-1px)` on hover (scraped from real inline
  CSS), replicated exactly.

## Known site issue encountered during research

While using Chrome MCP browser automation against the **live** target site,
navigation was repeatedly and involuntarily hijacked mid-session: normal
actions (scrolling, clicking a product card, even idling a couple of
seconds after `wait`) resulted in the tab jumping to unrelated pages
(`/pages/contact`, `/policies/privacy-policy`, a random product PDP) and/or
spawning extra "New Tab" windows. This looks like a pop-under/redirect ad
or tracking script active on `arte-collective.com`, not an issue with our
tooling. It made deep live-DOM interaction (opening the filter drawer,
confirming the exact scroll-trigger offset for the discount pill) unsafe to
pursue exhaustively. All structural/CSS facts in this doc and in the
`components/*.spec.md` files that come from the live site were instead
extracted from directly-fetched (curl) static HTML of
`/collections/space`, `/collections/space?page=2`, `?page=3`, and the
`?filter.p.m.custom.new_arrival=true` variant, which is safe, deterministic,
and returns the theme's server-rendered markup and inline `<style>` blocks
verbatim.
