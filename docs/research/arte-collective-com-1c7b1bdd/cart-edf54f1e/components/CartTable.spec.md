# CartTable Specification

## Overview
- **Target file:** `src/components/sites/arte-collective-com-1c7b1bdd/cart-edf54f1e/CartTable.tsx`
- **Screenshot:** `docs/design-references/arte-collective-com-1c7b1bdd/cart-edf54f1e/cart-empty-desktop.jpg`
- **Interaction model:** static shell; renders either the empty state or a list of `CartItemRow`

## DOM Structure
```
<div> (left column, lg:8/12 width)
  <div> header row: PRODUCT / PRICE / QUANTITY / TOTAL
  <div> items area — one of:
    - list of CartItemRow (populated)
    - empty state block (cart icon, heading, subtext)
```

## Computed Styles

### Header row
- borderBottom: `1.6px solid rgb(229, 229, 229)` → `#e5e5e5`
- padding: `0px 0px 10px` (bottom only)
- Column labels: fontSize `13px`, fontWeight `600`, textTransform `uppercase`, color `rgb(21, 21, 21)` → `#151515`
- Verbatim labels: "Product", "Price", "Quantity", "Total"
- Column widths mirror the item row's grid (see CartItemRow.spec.md): Product ~5/10, Price/Quantity/Total ~2/10 each (desktop only — hidden/irrelevant once stacked on mobile, but keep the row itself visible at all sizes matching the live site)

### Empty state (`.bee-mini_cart__empty`)
- Wrapper: `text-align: center`, `margin: 100px 0`
- Icon (cart-with-x svg): `74px × 65.775px` (~74×66), color `rgb(21, 21, 21)` → `#151515`. Use lucide-react's `ShoppingCart` or similar as a close equivalent combined with a small "x" — or a custom inline SVG if a closer visual match is easy; do not over-engineer, a `ShoppingCart` icon at ~64-74px in `#151515` is an acceptable close match if pixel-identical isn't practical.
- Heading (`h4.bee-cart_page_heading`): text **"Your cart is empty."**, fontSize `50px`, fontWeight `300`, color `rgb(21, 21, 21)`, textAlign center, margin `0 0 20px`
- Subtext (`.bee-cart_page_txt`): fontSize `15px`, color `rgb(133, 133, 133)` → `#858585`, lineHeight `25.5px`, textAlign center. Verbatim text (two sentences, same paragraph):
  > "Before proceed to checkout you must add some products to your shopping cart. You will find a lot of interesting products on our "Shop" page."

## States & Behaviors
- **Populated → empty transition:** when the last item is removed, the item list is replaced by the empty-state block. In this clone this is driven by `cart === null || cart.items.length === 0` from `useCart()`.

## Assets
- No new images. Empty-state icon: use `lucide-react` (`ShoppingCart` combined with visual treatment, or a close built-in icon) — no downloaded asset needed.

## Text Content (verbatim)
- "Product" / "Price" / "Quantity" / "Total"
- "Your cart is empty."
- "Before proceed to checkout you must add some products to your shopping cart. You will find a lot of interesting products on our "Shop" page." (the "Shop" page link target does not exist in this clone — render as plain text, not a link, since no matching route exists — consistent with this project's "do not link to unknown routes" rule)

## Responsive Behavior
- **Desktop (1440px):** header row + rows/empty-state fill the left column (~66% page width alongside the sidebar)
- **Tablet (768px):** same column layout, but the page-level 2-column split (cart/sidebar) has already collapsed to stacked — the cart table still spans full width
- **Mobile (390px):** header row column labels can be hidden or de-emphasized since the underlying row layout is itself stacked (matches CartItemRow's mobile behavior — see that spec)
- **Breakpoint:** page-level column split at lg (1024px); item-row internal grid at md (768px)
