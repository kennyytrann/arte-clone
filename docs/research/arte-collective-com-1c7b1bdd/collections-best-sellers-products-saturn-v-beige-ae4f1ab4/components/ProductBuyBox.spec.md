# ProductBuyBox

Client component (owns selected-variant state). Composes: rating row, title, price row,
VariantSelector, Buy2Get1 banner, Add to Cart button, import/customs micro-copy, TrustBadges,
phone-wallpaper row.

- Wrapper: `sticky top-6` (approximating the live site's `position: sticky; top: 30px`) so it
  pins next to the (taller) gallery while scrolling.
- Rating row: 5 small filled orange star icons + "4.86/5" text, 13px.
- Title: "Saturn V - Beige", ~28px medium weight, arte-text color.
- Price row: compare-at strikethrough muted, sale price bold orange, "SAVE {pct}%" badge
  (light-orange bg, orange text, small pill).
- Buy2Get1 banner: light gray/beige rounded box, small square thumbnail image
  (`theme/buy2get1-thumb.png`), bold "BUY 2 GET 1 FREE" text, decorative down-right arrow glyph.
- Add to Cart: full-width solid orange button, uppercase white bold text, subtle hover darken
  (`arte-orange-dark`).
- Micro-copy under button: "No import/customs fees guaranteed." muted, centered, 11px.
