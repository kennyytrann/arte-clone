import type { HttpTypes } from "@medusajs/types";
import type { ProductData, ProductSizeVariant } from "./types";

function primaryOptionValue(variant: HttpTypes.StoreProductVariant): string {
  return variant.options?.[0]?.value ?? variant.title ?? "Option";
}

function normalizeVariant(variant: HttpTypes.StoreProductVariant): ProductSizeVariant {
  const calc = variant.calculated_price;
  const price = calc?.calculated_amount ?? 0;
  const original = calc?.original_amount ?? null;
  const hasDiscount = original != null && original > price;

  return {
    id: variant.id,
    // Short label for the swatch box (e.g. "S"). Medusa has no separate
    // "small/medium/large" concept — this is the variant's own option value.
    label: primaryOptionValue(variant),
    // Fuller label for the pill below the swatch (e.g. "S / Black" for a
    // multi-option variant). Medusa has no physical-dimension field, so this
    // intentionally reuses the variant's real option data rather than a
    // fabricated measurement.
    dimensions: variant.title ?? primaryOptionValue(variant),
    price,
    compareAtPrice: hasDiscount ? original! : undefined,
  };
}

/**
 * Maps a Medusa Store API product (already fetched with a region context so
 * `calculated_price` is populated) into the frontend's normalized
 * `ProductData` shape. `relatedProducts` is left empty here — the caller
 * (getProductData.ts) fills it in once it has resolved related products.
 */
export function normalizeMedusaProduct(product: HttpTypes.StoreProduct): ProductData {
  const images =
    product.images && product.images.length > 0
      ? product.images.map((image) => image.url)
      : product.thumbnail
        ? [product.thumbnail]
        : [];

  return {
    handle: product.handle ?? product.id,
    title: product.title,
    images,
    variants: (product.variants ?? []).map(normalizeVariant),
    relatedProducts: [],
    isReferenceData: false,
  };
}
