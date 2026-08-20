import type { Metadata } from "next";
import { CollectionPageTemplate } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/collections/CollectionPageTemplate";
import { normalizeProduct } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/collections/normalizeMedusaCollection";
import type { CollectionData } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/collections/types";
import { medusa, isMedusaConfigured } from "@/lib/medusa";
import { getRegionContext } from "@/lib/medusa-region";

export const metadata: Metadata = {
  title: "All Products – Arte Collective",
};

/**
 * The live, unfiltered catalog — every real Medusa product, no category or
 * collection restriction. Reuses `CollectionPageTemplate` (the same
 * component every real `/collections/{handle}` page renders) rather than
 * building a separate grid, so this gets the identical visual language and
 * filter/sort UI for free instead of duplicating it.
 */
async function getAllProductsCollection(): Promise<CollectionData> {
  if (!isMedusaConfigured) {
    return { handle: "all", title: "All Products", heroLabel: "All Products", products: [] };
  }

  try {
    const region = await getRegionContext();
    const { products } = await medusa.store.product.list({
      region_id: region?.regionId,
      limit: 200,
    });
    return {
      handle: "all",
      title: "All Products",
      heroLabel: "All Products",
      products: products.map(normalizeProduct),
    };
  } catch (error) {
    console.error("[products/page] Failed to load all products:", error);
    return { handle: "all", title: "All Products", heroLabel: "All Products", products: [] };
  }
}

export default async function AllProductsPage() {
  const collection = await getAllProductsCollection();
  return <CollectionPageTemplate collection={collection} />;
}
