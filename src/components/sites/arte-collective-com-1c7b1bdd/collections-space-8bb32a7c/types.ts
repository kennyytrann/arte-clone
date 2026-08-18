import type { Product } from "@/types/product";

/**
 * This collection page can show up to two badges per card (e.g. a product
 * that is both a bestseller AND a new arrival). The shared `Product` type
 * only supports a single `badge`, so this page-local type extends it with
 * a `badges` array instead. See BEHAVIORS.md for why this differs from the
 * shared homepage card.
 */
export interface SpaceProduct extends Omit<Product, "badge"> {
  badges: Array<"POPULAR" | "NEW">;
}
