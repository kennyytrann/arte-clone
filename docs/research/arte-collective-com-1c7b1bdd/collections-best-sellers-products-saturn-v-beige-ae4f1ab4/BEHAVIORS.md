# Behaviors — Saturn V - Beige (PDP)

## Image gallery
- Prev/next square arrow buttons overlaid at left/right edge, vertically centered on the image.
- Clicking cycles through the 4 gallery images (wraps around). Implemented as index state +
  crossfade (opacity transition) for a smooth, non-jarring swap.
- Gallery image set does NOT change when a size variant is selected (images are not
  variant-specific in the Shopify data — all 4 images have `variant_ids: []`).

## Variant / size selector
- 3 swatch cards ("small" / "medium" / "large"), each a light-gray card containing a small
  mock-poster illustration (placeholder lines + gray rectangle) with the size name overlaid.
- The "medium" (20″x30″) card has an orange "POPULAR" badge pinned to its top edge.
- Below each card is a pill button with the literal dimension text (12" x 18", 20" x 30",
  24" x 36"). The selected pill is solid orange with white text; unselected pills are white/gray
  outline with dark text.
- Selecting a size is real interactive state: it updates the pill/card selected styling AND the
  displayed sale price + compare-at price + "SAVE %" badge to match that variant's real Shopify
  price (39/56, 49/70, 59/84 respectively). Default selection on load = the first ("small") variant.
- "Size guide" link (top-right of the selector label row) — on the live site this opens a small
  info/size-chart overlay (icon alt="Size guide"). Implemented here as a lightweight modal listing
  the 3 sizes.

## Sticky buy box
- The entire right-hand info column (rating → phone-wallpaper row) is `position: sticky` with a
  small top offset, so it stays pinned in the viewport while the visitor scrolls the (taller)
  gallery column beside it, until its own bottom edge is reached. There is no separate "floating
  mini add-to-cart" bar distinct from this — the whole column IS the sticky element.

## BUY 2 GET 1 FREE banner
- Light gray/beige rounded box, small stacked-poster thumbnail image on the left, bold
  "BUY 2 GET 1 FREE" text, small down-right arrow glyph on the right (decorative, hints at
  "applies automatically at checkout" — no functional click handler needed).

## Trust badges
- 4 rows, each: icon (left) + title + optional muted subtext line, optional right-aligned badge.
  Rows separated by a 1px top border.
  1. Zap icon — "Printing and Shipping in 3–6 days" / muted "Free delivery above $75" — badge "FREE"
  2. Flag icon — "Locally printed in USA" — no subtext, no badge
  3. Sparkle icon — "Printed at 300 DPI on 170 GSM paper" / muted "Designed by Bastian & Clay" —
     no badge
  4. Undo/return-arrow icon — "Easy Returns & Free Reprint if Damaged" — no subtext, no badge
- 5th row (visually distinct — has a real product image instead of an icon): phone-wallpaper
  thumbnail image + "Phone wallpaper pack" / muted "with every order" — badge "INCLUDED FREE"

## "You may also like"
- Reuses the shared `ProductCarousel` component 1:1 (same visual system as homepage's carousels).
  Eyebrow: "BEST SELLERS". Heading: "You may also like" with "also like" in italic orange accent
  font. Feed it the existing `bestsellerProducts` data from
  `root-8a5edab2/data/products.ts` (already includes this product, Earthrise, Power, SR-71 - White,
  etc. — matches what the live carousel shows).

## Instagram strip — DIFFERS from homepage, built as a page-specific component
- Homepage's shared copy (verified live on `/`): "Share your poster: @artecollective_" (colon).
- This PDP's live copy: "Share your poster with @artecollective_" ("with", no colon).
- Because the copy genuinely differs between pages, this was NOT promoted to `shared/` — a
  page-specific `InstagramStrip.tsx` was built in this page's own component folder, reusing the
  same visual structure/photo strip as the homepage version.

## Popups/redirects observed during inspection (NOT part of the real page design)
- The live site intermittently opens new tabs / redirects to unrelated pages (privacy policy,
  contact, a different collection) with no click involved — a rogue ad/affiliate script unrelated
  to on-page markup. Not reproduced or emulated in the clone.
