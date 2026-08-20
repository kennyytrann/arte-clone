import type { HttpTypes } from "@medusajs/types";
import type { CollectionData, CollectionProduct } from "./types";
import { productHref } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";

export function normalizeProduct(product: HttpTypes.StoreProduct): CollectionProduct {
  const firstVariant = product.variants?.[0];
  const calc = firstVariant?.calculated_price;
  const price = calc?.calculated_amount ?? 0;
  const original = calc?.original_amount ?? null;

  return {
    handle: product.handle ?? product.id,
    title: product.title,
    price,
    compareAtPrice: original != null && original > price ? original : undefined,
    image: product.thumbnail ?? null,
    badges: [],
    // Products fetched directly from a Medusa category always have a real,
    // resolvable handle — no availability check needed before linking.
    href: productHref(product.handle ?? product.id),
  };
}

/**
 * Maps a Medusa product category and its already-fetched, already-priced
 * products into the frontend's normalized `CollectionData` shape.
 */
export function normalizeMedusaCollection(
  category: HttpTypes.StoreProductCategory,
  products: HttpTypes.StoreProduct[]
): CollectionData {
  return {
    handle: category.handle,
    title: category.name,
    heroLabel: category.name,
    products: products.map(normalizeProduct),
    isReferenceData: false,
  };
}

/**
 * Same mapping as `normalizeMedusaCollection`, but for a Medusa Product
 * Collection (e.g. "Best Sellers") rather than a Product Category — a
 * product belongs to many categories but at most one collection, which is
 * exactly the "also belongs to Best Sellers" merchandising relationship.
 * Reuses the identical `CollectionData` shape so `CollectionPageTemplate`
 * and `getCollectionData`'s category/collection fallback don't need to know
 * which kind of grouping produced the page.
 */
export function normalizeMedusaProductCollection(
  collection: HttpTypes.StoreCollection,
  products: HttpTypes.StoreProduct[]
): CollectionData {
  return {
    handle: collection.handle,
    title: collection.title,
    heroLabel: collection.title,
    products: products.map(normalizeProduct),
    isReferenceData: false,
  };
}
