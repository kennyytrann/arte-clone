import type { ProductData } from "./types";
import { saturnVBeigeProduct } from "@/components/sites/arte-collective-com-1c7b1bdd/collections-best-sellers-products-saturn-v-beige-ae4f1ab4/data";

/**
 * Temporary in-memory product registry, keyed by URL handle.
 *
 * This is the seam a future Medusa integration replaces: swap the body of
 * `getProductData` for a Medusa API/DB call that resolves a handle to the
 * same `ProductData` shape, and every component downstream
 * (ProductPageTemplate, ProductGallery, ProductBuyBox, VariantSelector,
 * TrustBadges, SizeGuideModal) keeps working unchanged.
 */
const products: Record<string, ProductData> = {
  "saturn-v-beige": saturnVBeigeProduct,
};

export async function getProductData(handle: string): Promise<ProductData | undefined> {
  return products[handle];
}

export function getAllProductHandles(): string[] {
  return Object.keys(products);
}
