import type { Product } from "@/types/product";

export interface ProductSizeVariant {
  id: string;
  /**
   * Human label for the variant swatch. The cloned Saturn V reference data
   * uses "small"/"medium"/"large"; live Medusa variants use whatever their
   * option value is (e.g. "S", "M", "Black / L") — the type is widened to
   * `string` so real Medusa option values flow through unchanged instead of
   * being forced into a 3-size shape.
   */
  label: string;
  dimensions: string;
  price: number;
  /** Absent when Medusa reports no discount for this variant. */
  compareAtPrice?: number;
  popular?: boolean;
  /**
   * Real Medusa option title -> value for this variant, e.g.
   * `{ Size: "12x18", Frame: "Unframed" }`. Present only for live Medusa
   * products (absent for the local reference registry). When a product has
   * 2+ distinct option titles across its variants, VariantSelector renders a
   * real per-axis selector (Size grid + Frame row) instead of the flat
   * single-axis grid, so a 6-variant Size×Frame product resolves the exact
   * variant instead of listing all 6 combinations under "Select size".
   */
  optionValues?: Record<string, string>;
}

/**
 * Normalized shape the ProductPageTemplate and its children render from.
 * Any data source (static reference registry, or Medusa via
 * normalizeMedusaProduct.ts) just needs to produce this shape.
 */
export interface ProductData {
  handle: string;
  title: string;
  /** Absent for Medusa products — Medusa has no built-in review/rating field. */
  rating?: number;
  images: string[];
  variants: ProductSizeVariant[];
  /** Saturn-V-specific cloned promo asset; absent for live Medusa products. */
  buy2Get1ThumbSrc?: string;
  /** Saturn-V-specific cloned promo asset; absent for live Medusa products. */
  phoneWallpaperThumbSrc?: string;
  relatedProducts: Product[];
  /** True when this record came from the local reference registry rather than a live Medusa lookup. */
  isReferenceData?: boolean;
}
