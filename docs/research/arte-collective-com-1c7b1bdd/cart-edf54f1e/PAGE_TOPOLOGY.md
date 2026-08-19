# /cart Page Topology

Source: https://arte-collective.com/cart
Theme: same "bee" Shopify theme as every other cloned page (Booster-style class names: `bee-*`).

## Layout

Standard page chrome (unchanged, reused from `shared/`):
1. `AnnouncementBar` — see BEHAVIORS.md, text is dynamic on the real site (not implemented here)
2. `Header` (absolute overlay, same as every page)
3. `EmailCaptureModal`

Page content, two-column layout at ≥lg (1024px), stacked below that:

```
<div class="row"> (bee-row, margin -30px each side, flex)
  <div class="col-lg-8 col-md-12">          ← cart-main
    <div class="header-row">PRODUCT / PRICE / QUANTITY / TOTAL</div>
    <div class="items">
      — populated: one row per line item
      — empty: centered empty-state block
    </div>
  </div>
  <div class="col-lg-4 col-md-12">          ← sidebar
    <div class="footer-box"> Subtotal / shipping note / Check Out button </div>
  </div>
</div>
```
4. `Footer` (unchanged, reused from `shared/`)

## Sections

| Section | Interaction model | Notes |
|---|---|---|
| Table header row (PRODUCT/PRICE/QUANTITY/TOTAL) | static | Always rendered, even when cart is empty |
| Cart item row | click-driven (qty +/-, remove) | See CartItemRow.spec.md |
| Empty-cart state | static | Renders instead of item rows when cart has 0 items |
| Sidebar summary | static (real values) | Subtotal + shipping note + Check Out button; renders in both populated and empty states |

## Real-data integration decision

This project already has a working Medusa cart backend (built in a prior phase): `src/lib/cart.ts` (createCart/getCart/addToCart/updateCartItem/removeCartItem) and `CartProvider`/`useCart()` context, already wired to the product page's Add to Cart button and the Header's `(N) CART` count.

This clone wires the new `/cart` page to that **real** cart data via `useCart()`, rather than building a second, disconnected mock-data cart page. This is a data-integration decision consistent with the rest of this project's established pattern (Medusa-backed pages with local reference/empty fallbacks), not a visual-design decision — the pixel-perfect visual spec below is unaffected.

Checkout button is cloned visually only — **not** wired to a real checkout flow (checkout remains explicitly out of scope per the project's existing constraints).
