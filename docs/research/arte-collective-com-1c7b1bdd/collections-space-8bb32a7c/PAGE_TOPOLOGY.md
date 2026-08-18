# Page Topology — /collections/space

Source: https://arte-collective.com/collections/space (Shopify "BEE" theme,
custom `.ac-*` overlay classes injected by a theme-app extension).

## Section order (top to bottom)

1. `AnnouncementBar` (shared, reused) — orange bar, "ADD 2 PRINTS, GET 1 FREE"
2. `Header` (shared, reused) — absolutely positioned, translucent dark bar,
   overlays the top of the collection banner section below it
3. `EmailCaptureModal` (shared, reused) — opens ~2.5s after load
4. `CollectionBanner` (new) — blurred nebula banner with "SPACE" pill +
   trust bar ("4.86/5 +300 Reviews")
5. `FilterBar` (new) — ALL/NEW chip filters + "FILTER BY" button, opens
   `FilterDrawer`
6. `ProductGrid` (new) — grid of all 131 products using `SpaceProductCard`
   (local variant of shared ProductCard with monospace multi-badge support)
7. `FloatingDiscountPill` (new) — appears after ~400px of scroll, fixed to
   viewport, opens `EmailCaptureModal`
8. `Footer` (shared, reused)

## Real DOM structure observed (curl-fetched static HTML, page=1/2/3)

```
.ac-collection-hero-wrap
  .ac-collection-hero               (115px tall, max-w 1330px, border-radius 6px)
    img.blur(10px)+scale(1.2)@lg    (real banner: Space_ece143b5....png)
    .ac-collection-pill             (glass pill, "• Space")
  .ac-collection-trust              ("4.86/5 +300 Reviews" bar)

#shopify-section-...__ac_controls
  .ac-controls-wrap
    .ac-controls
      .ac-controls-left
        a#ac-chip-all  .ac-chip.ac-chip--active   ("ALL" + count badge "131")
        a#ac-chip-new  .ac-chip                    ("NEW", links to
                        ?filter.p.m.custom.new_arrival=true — a REAL Shopify
                        metafield facet filter, confirmed by fetching that
                        URL and diffing rendered handles: 20 unique products)
      button#ac-open-filters .ac-filter-btn        ("FILTER BY" — proxies a
                                                      click to the theme's
                                                      native facet-filter
                                                      trigger; no native
                                                      facets markup was
                                                      present in the static
                                                      HTML for this
                                                      collection, so the
                                                      drawer content itself
                                                      could not be captured
                                                      — see BEHAVIORS.md)

#shopify-section-...__main
  .bee_box_pr_grid.bee-row.bee-row-cols-2.bee-row-cols-md-3.bee-row-cols-lg-4
    (per card) .bee-product
      .ac-badges (abs, top 5px/left 5px, flex gap 3px)
        .ac-badge-sale  "POPULAR"  (orange bg / white text)
        .ac-badge-new   "NEW"      (white bg / black text)
      img
      h3.bee-product-title
      .bee-product-price  <del>$56</del> <ins>$39</ins>
    a[data-load-more][data-load-onscroll] href="?page=2"  (infinite scroll,
      50 products/page server-side; we render all 131 client-side and reveal
      progressively to approximate this — see BEHAVIORS.md)
```

## Layout / breakpoints

- Grid columns: 2 (mobile, <768px) / 3 (768–1023px) / 4 (≥1024px)
  (Bootstrap-style `bee-row-cols-*` classes)
- Grid gaps: 15px/15px (mobile) → 15px/30px (md, col/row) → 30px/30px (lg)
- Banner + trust bar + controls bar all share `max-width: 1330–1360px`,
  `padding: 0 15px`
- Header clearance: Header is `position: absolute; top:0; mt-[33px]` with a
  ~54px translucent bar (33 + 54 = 87px total). The collection banner section
  sits directly below the announcement bar in normal flow, so on this page we
  give the first in-flow wrapper `pt-[100px]` (verified against the live
  page: banner top edge sits ~100px below the announcement bar at 1440px,
  clearing the absolutely-positioned header) — see `CollectionBanner.spec.md`.

## Products

- Real catalog fetched from `/collections/space/products.json?limit=250`:
  131 products, every product has 3 size variants (12"x18" / 20"x30" /
  24"x36"), price shown = smallest-variant price ($39), compare-at = smallest
  variant compare_at_price ($56).
- Primary image = `images[0].src` from the Shopify product JSON.
- Badge assignment scraped directly from the real collection HTML
  (page=1..3), not guessed: 7 products carry `POPULAR`, 20 carry `NEW`
  (2 of those carry both). See `data/products.ts`.
