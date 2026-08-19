# CartItemRow Specification

## Overview
- **Target file:** `src/components/sites/arte-collective-com-1c7b1bdd/cart-edf54f1e/CartItemRow.tsx`
- **Screenshot:** populated-cart state observed live (see BEHAVIORS.md — not saved as a static image due to session constraints; extracted via `getComputedStyle`/DOM inspection instead, which is the authoritative source of truth per this project's process)
- **Interaction model:** click-driven (quantity +/-, remove)

## DOM Structure
5-column grid per row: `[image+title+meta] [price] [quantity] [line total] [remove]`

## Computed Styles

### Row container
- Grid: 5 columns at md+, widths ≈ 5/2/2/2/1 (out of 12)
- Row gap/gutter: real site uses `bee-gx-md-15 bee-gx-10 bee-gy-5` (10-15px horizontal gutter, 5px vertical) — use Tailwind `gap-x-3 gap-y-2` as a close equivalent
- Vertically centered (`align-items-center`)

### Product cell (image + title + meta)
- Thumbnail: `100px × 100px`, `border-radius: 0`, real site uses `object-fit: fill` but this clone uses `object-cover` to avoid visible distortion (an intentional, minor deviation to prevent a worse-looking result — not a fabrication, the underlying image is the same real asset)
- Title: fontSize `15px`, fontWeight `400`, color `rgb(21, 21, 21)` → `#151515`, fontFamily Inter (already the project default)
- Meta line ("Size: {variant}"): fontSize `12px`, color `rgb(133, 133, 133)` → `#858585`. Real site shows "Size: 12″ x 18″ Paper: Matte" — this clone only has real variant-title data (e.g. "Small"/"Medium"/"Large" or a Medusa option value), not a "Paper" material field, so renders "Size: {variantTitle}" only — no fabricated material text.

### Price cell
- Two-part price when a discount exists: `<del>` strikethrough at `rgb(191, 190, 200)`, `<ins>` (no underline) sale price at `rgb(254, 96, 22)` → `#fe6016` (exact match for this project's existing `--arte-orange` token)
- Single price (no discount) when `compareAtUnitPrice` is absent/not greater than `unitPrice` — same graceful-degradation pattern already used everywhere else in this project (no fake strikethrough when there's no real discount)

### Quantity cell — stepper
- Box: `120px × 38px`, `border: 1.6px solid #e5e5e5`, `border-radius` (small, ~4px — matches the project's existing `--radius-sm` token family)
- Minus/plus buttons: `34px × 34px` each, transparent background, icon/text color `rgb(133, 133, 133)` → `#858585`
- Number input: `34px` wide, `text-align: center`, `fontSize: 15px`, no border (border lives on the outer box), color `rgb(21, 21, 21)`
- On change (click +/- or edit the number directly), calls `updateItem(lineItemId, newQuantity)` from `useCart()`. Quantity floor is 1 (going below 1 via minus should remove the item instead — matches ordinary cart UX and this project's real Medusa `updateCartItem` contract, which requires quantity ≥ 1 for updates; use the existing `removeItem` when quantity would drop to 0).

### Total cell
- Line total (`unitPrice × quantity`), fontSize matches price cell, plain (not orange) — real site shows this in the default text color, not the accent orange (the orange is reserved for the per-unit sale price only)

### Remove button
- Circular, `40px × 40px`, `background: rgba(21, 21, 21, 0.05)`, icon color `rgb(21, 21, 21)` → `#151515`. Use `lucide-react`'s `Trash2` (or `X`) at a size that fits the 40px circle comfortably (~16-18px icon).
- Calls `removeItem(lineItemId)` from `useCart()`.

## States & Behaviors
- **Quantity update:** optimistic or loading-gated (reuse the same `isLoading`/`error` pattern already established in `ProductBuyBox.tsx` via `useCart()` — do not invent a new loading pattern)
- **Remove:** same loading/error handling pattern

## Assets
- Product image comes from the real cart line item's `thumbnail` field (already real Medusa data via the existing cart architecture) — no new asset downloads needed for this component.

## Text Content (verbatim)
- "Size: " prefix before the real variant title

## Responsive Behavior
- **Desktop/Tablet (≥768px):** single horizontal row, 5-column grid as described
- **Mobile (<768px):** stack each cell full-width (image+title block, then price, then quantity control, then total, then remove) — matches the real site's Bootstrap `col-12` mobile-first stacking
- **Breakpoint:** 768px (Tailwind `md:`)
