# Page Topology — Saturn V - Beige (PDP)

URL: https://arte-collective.com/collections/best-sellers/products/saturn-v-beige
Route: /collections/best-sellers/products/saturn-v-beige

## Real product data (Shopify JSON API: /products/saturn-v-beige.json)
- Title: "Saturn V - Beige"
- Vendor: Arte Collective, type: Poster
- Rating: 4.86/5 (5 filled orange stars, static — no review-count text shown on PDP itself)
- Variants (all "Matte" paper):
  1. 12″ x 18″ — $39.00 (compare $56.00) — "small"
  2. 20″ x 30″ — $49.00 (compare $70.00) — "medium" — POPULAR badge
  3. 24" x 36" — $59.00 (compare $84.00) — "large"
  - All variants show ~"SAVE 30%" badge
- Gallery images (4, generic — NOT variant-specific, same set regardless of selected size):
  1. Mockup1OK…png (framed black poster on beige wall, Saturn V rocket diagram art)
  2. Mockup_N2…png
  3. Mockup_N3…png
  4. Mockup_N4…png
- No visible body/description copy block renders on the page (body_html exists in the API but is not rendered in this template).

## Section order (top to bottom)
1. AnnouncementBar (shared) — "ADD 2 PRINTS, GET 1 FREE"
2. Header (shared, absolute/overlay) — "mt-[33px]" per existing homepage build
3. EmailCaptureModal (shared) — fires ~2.5s after load
4. Product hero (2-col on desktop, stacked on mobile):
   - Left: ProductGallery (single large image + prev/next arrows)
   - Right: sticky buy box column (position: sticky, ~30px top offset on the live site) containing:
     a. Rating row (stars + "4.86/5")
     b. Title "Saturn V - Beige"
     c. Price row ($ compare-at strikethrough, $ sale price, "SAVE 30%" badge)
     d. VariantSelector ("Select size (unframed ⓘ)" label + "Size guide" link, 3 swatch cards, 3 size pills)
     e. "BUY 2 GET 1 FREE" banner (thumbnail + text + arrow icon)
     f. "ADD TO CART" full-width button
     g. "No import/customs fees guaranteed." micro-copy
     h. TrustBadges list (4 rows: shipping/FREE, locally printed, DPI+paper, returns)
     i. Phone wallpaper pack row (image + "INCLUDED FREE" badge)
5. ProductCarousel (reused shared component) — eyebrow "BEST SELLERS", heading "You may also like" (also like = italic orange accent) — bestseller products incl. this product itself, Earthrise, Power, SR-71 - White, etc.
6. InstagramStrip — PAGE-SPECIFIC variant (see BEHAVIORS.md — copy differs from homepage's)
7. Footer (shared)

## Verified live measurements
- On the live site the entire right-hand info column (title → phone-wallpaper row) is ONE sticky
  container (`position: sticky; top: 30px`) that pins in place while the (taller) gallery/left
  column scrolls underneath it, rather than a separate small "floating add-to-cart" bar. There is
  no distinct mini add-to-cart bar beyond this sticky column.
- Live site periodically triggers an unrelated automatic tab-opening/redirect (ad/affiliate script
  unrelated to page markup) during inspection — not part of the page's real design; ignored.
