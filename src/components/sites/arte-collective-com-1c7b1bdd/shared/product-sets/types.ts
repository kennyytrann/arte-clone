import type { ProductData } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/types";

/**
 * Shape the (new, isolated) `ProductSetPageTemplate` renders from.
 *
 * A Product Set sells 2 products together. This type deliberately reuses the
 * existing `ProductData` for each member product so the normal product data
 * pipeline (Medusa fetch, normalisation, pricing, variants) can be reused
 * as-is — nothing about single-product loading changes.
 *
 * For this first step the template renders the set like a normal product page
 * using `products[0]` as a safe copy-of-the-current-page starting point. The
 * real 2-product layout/behaviour is a later step; the array shape is already
 * here so that step needs no type change.
 */
export interface ProductSetData {
  handle: string;
  title: string;
  description?: string;
  /**
   * The Product Set page's OWN gallery images, in display order (index 0 =
   * primary / first shown). Completely independent of the member products —
   * `set.images` drives the gallery, `set.products` drives purchasing /
   * variant resolution. Each set defines its own array.
   */
  images: string[];
  /** Member products. 2-product sets for now; whatever resolves, min 1. */
  products: ProductData[];
}
