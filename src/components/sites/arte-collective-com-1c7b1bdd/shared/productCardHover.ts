/**
 * Shared class strings for the storefront product-card hover effect + media box.
 *
 * Applied identically by `ProductCard` and `CollectionProductCard`, so every
 * grid / carousel that renders one of those cards inherits the exact same
 * behaviour: collection grids, the homepage "Print of the Week" grid, every
 * homepage `ProductCarousel` (featured / best sellers / etc.) and the related-
 * products carousel on product pages.
 *
 * The effect is intentionally limited to two things (reference video):
 *   1. the product image gets a soft gray / muted cast
 *   2. the secondary details block (price + compare-at price) gently floats
 *      upward and fades to 0
 * The product title is never touched. Typography, colours, spacing, badges and
 * layout footprint are unchanged — only `transform`, `opacity` and `filter`
 * animate, so nothing reflows.
 *
 * The hover rules are gated behind the `can-hover` variant
 * (`@media (hover: hover) and (pointer: fine)`, defined in globals.css) plus
 * `group-hover`, so touch devices render the normal, un-hovered card with no
 * stuck hover state. The 2:3 media ratio applies on every device.
 */

/**
 * The card's image area. Fixed 2:3 (width:height) portrait ratio on every
 * breakpoint so all cards in a grid align; the poster artwork is authored 2:3
 * so `object-cover` on the child image shows it complete, uncropped, undistorted.
 */
export const productCardImageBoxClass =
  "relative aspect-[2/3] w-full overflow-hidden bg-[#e5e5e5]";

/** Applied to the card's `next/image` (replaces its old transition classes). */
export const productCardImageClass =
  "object-cover transition-[filter] duration-300 ease-out " +
  "can-hover:group-hover:[filter:brightness(0.92)_saturate(0.8)_grayscale(0.15)]";

/**
 * A translucent neutral-gray wash layered over the image. Rendered as the last
 * child of the existing `overflow-hidden` image box; `pointer-events-none` so
 * it never intercepts the card link.
 */
export const productCardImageOverlayClass =
  "pointer-events-none absolute inset-0 bg-[#71717a] opacity-0 " +
  "transition-opacity duration-300 ease-out can-hover:group-hover:opacity-[0.12]";

/**
 * Applied to the existing secondary-details `<p>` (price row), which is already
 * a single element — the whole block animates together, not child-by-child.
 *
 * Motion: a smooth "float up and disappear". transform runs 450ms and opacity
 * 360ms, both on cubic-bezier(0.22, 1, 0.36, 1) (ease-out-quint-ish) so the
 * details accelerate away immediately then decelerate gently as they fade.
 * transform + opacity only (compositor-friendly); `will-change` hints the
 * browser to promote the layer. Reverses symmetrically on mouse-leave.
 * The element keeps its box (never `display:none`) so card height never jumps.
 */
export const productCardDetailsClass =
  "[transform:translateY(0)] will-change-[transform,opacity] " +
  "[transition:transform_450ms_cubic-bezier(0.22,1,0.36,1),opacity_360ms_cubic-bezier(0.22,1,0.36,1)] " +
  "can-hover:group-hover:opacity-0 can-hover:group-hover:[transform:translateY(-16px)]";
