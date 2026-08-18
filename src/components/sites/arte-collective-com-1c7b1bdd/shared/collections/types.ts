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
 * Any data source (static registry today, Medusa later) just needs to
 * produce this shape — see getCollectionData.ts.
 */
export interface CollectionData {
  handle: string;
  title: string;
  heroLabel: string;
  heroImage: string;
  rating: CollectionRating;
  products: CollectionProduct[];
}
