# ProductGrid + SpaceProductCard

`ProductGrid` props: `{ products: SpaceProduct[] }`. Reveals products in
batches of 24 via `IntersectionObserver` on a trailing sentinel (approximates
the real site's `page=2/3` infinite scroll — see BEHAVIORS.md).

`SpaceProductCard` props: `{ product: SpaceProduct }`. This is a NEW
component, not the shared `ProductCard`, because this page's card visuals
genuinely differ from the homepage carousel card:
1. Badge font is `Roboto Mono` monospace (shared card uses `font-sans`).
2. Cards here can show TWO stacked badges (POPULAR + NEW) — shared
   `ProductCard` only supports one.
3. Badge colors differ: `POPULAR` = orange/white (same as shared), but
   `NEW` = **white background / black text**, not orange.

## Structure

```
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4
            gap-x-[15px] gap-y-[15px] md:gap-x-[15px] md:gap-y-[30px]
            lg:gap-x-[30px] lg:gap-y-[30px] max-w-[1360px] mx-auto px-4">
  {products.map(<SpaceProductCard />)}
</div>
```

## Exact CSS (scraped from live inline `<style>`)

- `.ac-badges`: `display:flex; flex-wrap:wrap; gap:3px; position:absolute;
  top:5px; left:5px; z-index:10;`
- Badge base (`.ac-badges span`, `.ac-badge-new`, `.ac-badge-sale`):
  `font-size:9px; font-family:'Roboto Mono',monospace; letter-spacing:
  -0.03em; padding:4px; border-radius:0; line-height:1;`
- `.ac-badge-sale` ("POPULAR"): background `--arte-orange` (#FE6016), white
  text (matches the shared card's existing badge treatment, extracted from
  the homepage; the live page's own `.ac-badge-sale` background rule wasn't
  present in the inline `<style>` blob we captured, but the rendered orange
  color matches `--arte-orange` in every screenshot).
- `.ac-badge-new` ("NEW"): `background:#FFFFFF; color:#000000;` (scraped
  directly, confirmed).
- Price: `<del>$56</del> <ins>$39</ins>` → reuse the shared card's existing
  treatment (`line-through text-arte-text-muted` + `font-medium
  text-arte-orange`).

## Badge data

Scraped directly from the real collection's rendered HTML (not derived from
a guessed rule) — 7 products carry `POPULAR`, 20 carry `NEW`, 2 carry both.
Full mapping lives in `data/products.ts`.
