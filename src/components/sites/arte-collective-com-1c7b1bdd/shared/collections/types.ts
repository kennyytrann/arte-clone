import type { Product } from "@/types/product";

/**
 * A collection page can show up to two badges per card (e.g. a product that
 * is both a bestseller AND a new arrival). The shared `Product` type only
 * supports a single `badge`, so collection pages use this extended shape
 * with a `badges` array instead.
 */
export interface CollectionProduct extends Omit<Product, "badge"> {
  badges: Array<"POPULAR" | "NEW">;
}

export interface CollectionRating {
  value: number;
  reviewCount: number;
}

/**
 * Normalized shape the CollectionPageTemplate and its children render from.
 * Any data source (static reference registry, or Medusa via
 * normalizeMedusaCollection.ts) just needs to produce this shape.
 */
export interface CollectionData {
  handle: string;
  title: string;
  heroLabel: string;
  /** Absent for Medusa categories — Medusa has no built-in category image field. */
  heroImage?: string;
  /** Absent for Medusa categories — Medusa has no built-in review/rating field. */
  rating?: CollectionRating;
  products: CollectionProduct[];
  /** True when this record came from the local reference registry rather than a live Medusa lookup. */
  isReferenceData?: boolean;
}
