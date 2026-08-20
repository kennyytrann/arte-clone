import type { HttpTypes } from "@medusajs/types";

// The real Wix catalog migration applied a flat 30% promotional discount to
// every product's base price at import time (verified against the source
// catalog: all real products/variants use discountMode=PERCENT,
// discountValue=30, zero deviations — see ProductBuyBox.tsx). Medusa only
// stores the resulting final price, so `calculated_price.original_amount`
// is never populated for these variants; it's reconstructed here from the
// variant's own real price, never an invented number. Static reference
// products (Saturn V, the Space collection) never reach this function — they
// carry a real hardcoded price/compareAtPrice pair already.
const REAL_CATALOG_DISCOUNT_PERCENT = 30;

/**
 * Picks the cheapest variant's calculated price for a product card. The
 * cheapest variant is always the base tier (e.g. Unframed 12"x18" for the
 * real 2-option Size × Frame catalog, or Small for the single-axis reference
 * catalog) — never a fabricated price, just the real lowest one Medusa
 * already returns.
 */
export function getCheapestVariantPrice(
  product: HttpTypes.StoreProduct
): { price: number; compareAtPrice?: number } {
  let price = 0;
  let compareAtPrice: number | undefined;
  let cheapest = Infinity;

  for (const variant of product.variants ?? []) {
    const calc = variant.calculated_price;
    const amount = calc?.calculated_amount ?? 0;
    if (amount < cheapest) {
      cheapest = amount;
      price = amount;
      const original = calc?.original_amount ?? null;
      compareAtPrice = original != null && original > amount ? original : undefined;
    }
  }

  // Being the cheapest variant, this is always the base tier — no implied
  // surcharge — so its real original price is exactly price / (1 - 0.30).
  if (compareAtPrice == null && price > 0) {
    const reconstructed = Math.round(price / (1 - REAL_CATALOG_DISCOUNT_PERCENT / 100));
    if (reconstructed > price) compareAtPrice = reconstructed;
  }

  return { price, compareAtPrice };
}
