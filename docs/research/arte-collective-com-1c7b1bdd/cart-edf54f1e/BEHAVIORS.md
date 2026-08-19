# /cart Behaviors

## Scroll sweep
No scroll-triggered behavior beyond the site-wide Header (already cloned/shared). Page content is short; no scroll-snap, no parallax, no reveal-on-scroll animations observed.

## Click sweep

- **Quantity stepper (minus/input/plus):** real Shopify `/cart/update.js` AJAX call, updates line total, cart subtotal, and header count without a full page reload. Real computed spec captured (see CartItemRow.spec.md) — box 120×38px, border `1.6px solid #e5e5e5`, radius via `--other-radius` token, minus/plus buttons 34×34px transparent, centered number input.
  - **Observed edge case:** on the one real line item I inspected (governed by an active "buy 2 get 1 free" promo — see AnnouncementBar note below), `.bee-quantity-control` computed to `display: none` — no inline style, no matching CSS rule found in enumerable stylesheets, most likely an app/theme rule that locks quantity editing for promo-bundle-managed line items so the automatic discount math can't be broken by hand. This is a real, reproducible observation (confirmed on fresh reload) but is a business-logic edge case, not the page's default design — the CSS itself fully defines a working, visible stepper, so that's what's built here.
- **Remove (trash) button:** removes the line item, page updates to the empty state if it was the last item. Real `/cart/change.js`-style AJAX call. Circular button, 40×40px, `background: rgba(21,21,21,0.05)`, icon color `#151515`.
- **Check Out button:** submits the cart form (`<form action="https://arte-collective.com/cart">`, `<button type="submit" name="checkout">`) — navigates to Shopify's real checkout. **Not implemented** — cloned visually only, no real checkout wiring (explicit project constraint).

## Hover sweep
Not deeply tested on the live site (all interactive elements use standard theme hover states — subtle opacity/color shifts consistent with every other cloned page's button treatments; no unique hover animation observed worth a special-casing here).

## Responsive sweep

Inferred from the real page's Bootstrap-style grid classes (`bee-col-12 bee-col-md-5 bee-col-lg-5`, etc. — the same "bee" theme grid used across every other cloned page) rather than live viewport screenshots, since this session's browser automation could not reliably resize the actual rendered viewport (a known tooling limitation already documented in this project from earlier phases; `window.innerWidth` reported 2704px regardless of `resize_window` calls).

- **< 768px (mobile):** every grid cell in the item row stacks full-width vertically (image+title, then price, then quantity, then total, then remove — all full-width blocks). Page-level cart/sidebar columns already stack below md.
- **768–1023px (tablet):** item row becomes a single horizontal row (image+title | price | qty | total | remove use the col-md-5/2/2/2/1 split), but the page-level cart-column and sidebar-column still stack vertically (sidebar full-width below the cart table) since the 8/4 split only applies at lg.
- **≥1024px (desktop):** full two-column page layout — cart table at ~66% width, sidebar at ~33% width, side by side (matches the extracted screenshot).

Implemented using Tailwind's `md:` (768px) and `lg:` (1024px) breakpoints as the practical equivalent of the real theme's `md`/`lg` grid breakpoints, consistent with how every other page in this project already approximates the site's grid via Tailwind's own scale.

## AnnouncementBar — dynamic text tied to cart state (documented, not implemented)

Directly observed: with 2 units of a $39 item in the cart ($78 subtotal, qualifying for a "buy 2 prints, get 1 free" promotion), the AnnouncementBar read **"UNLOCKED: ADD YOUR FREE PRINT!"** instead of its default **"ADD 2 PRINTS, GET 1 FREE"**. After removing the item (empty cart), it reverted to the default text.

This confirms the real site's `AnnouncementBar` is a stateful, cart-aware component (likely swapping copy based on a cart-quantity or cart-value threshold tied to the promo). This project's existing `AnnouncementBar` (in `shared/`) is currently static text only. **Not changed as part of this clone** — implementing the promo-threshold logic itself is a business-logic feature beyond "clone the /cart page," and touching the shared `AnnouncementBar` risks the same kind of unintended cross-page change earlier phases of this project have been careful to avoid. Flagged here as a legitimate future enhancement.
