import { cache } from "react";
import type { CollectionData } from "./types";
import { medusa, isMedusaConfigured } from "@/lib/medusa";
import { getRegionContext } from "@/lib/medusa-region";
import { normalizeMedusaCollection } from "./normalizeMedusaCollection";
import { attachProductHrefs } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/getProductData";
import { spaceCollection } from "@/components/sites/arte-collective-com-1c7b1bdd/collections-space-8bb32a7c/data/collection";

/**
 * Local reference/fallback catalog. Kept ONLY so the previously-verified
 * Space collection clone stays viewable as a visual/presentation reference
 * — see the COLLECTIONS section of the Medusa integration report. Medusa's
 * product categories are authoritative whenever a matching handle exists
 * there; this registry is consulted only when it doesn't (Medusa has no
 * "space" category in its current demo data).
 */
const REFERENCE_COLLECTIONS: Record<string, CollectionData> = {
  space: { ...spaceCollection, isReferenceData: true },
};

async function fetchMedusaCategoryByHandle(handle: string) {
  if (!isMedusaConfigured) return null;

  try {
    const { product_categories } = await medusa.store.category.list({ handle, limit: 1 });
    return product_categories[0] ?? null;
  } catch (error) {
    console.error(`[getCollectionData] Medusa category lookup failed for handle "${handle}":`, error);
    return null;
  }
}

async function fetchCategoryProducts(categoryId: string, regionId: string | undefined) {
  if (!isMedusaConfigured) return [];

  try {
    const { products } = await medusa.store.product.list({
      category_id: [categoryId],
      limit: 100,
      region_id: regionId,
    });
    return products;
  } catch (error) {
    console.error(`[getCollectionData] Failed to list products for category "${categoryId}":`, error);
    return [];
  }
}

/**
 * URL handle → CollectionData. Medusa product categories are tried first
 * (see COLLECTIONS section of the integration report for why categories
 * rather than product collections); the local reference registry is used
 * only as a fallback.
 */
export async function getCollectionData(handle: string): Promise<CollectionData | undefined> {
  const category = await fetchMedusaCategoryByHandle(handle);

  if (category) {
    const region = await getRegionContext();
    const products = await fetchCategoryProducts(category.id, region?.regionId);
    return normalizeMedusaCollection(category, products);
  }

  const reference = REFERENCE_COLLECTIONS[handle];
  if (!reference) return undefined;

  return { ...reference, products: await attachProductHrefs(reference.products) };
}

/**
 * All known collection handles (live Medusa categories + local reference),
 * memoized per request via React `cache()`.
 */
const listAllHandles = cache(async (): Promise<Set<string>> => {
  const handles = new Set<string>(Object.keys(REFERENCE_COLLECTIONS));

  if (isMedusaConfigured) {
    try {
      const { product_categories } = await medusa.store.category.list({
        limit: 1000,
        fields: "handle",
      });
      for (const c of product_categories) {
        if (c.handle) handles.add(c.handle);
      }
    } catch (error) {
      console.error("[getCollectionData] Failed to list Medusa category handles:", error);
    }
  }

  return handles;
});

export async function getAllCollectionHandles(): Promise<string[]> {
  return Array.from(await listAllHandles());
}

/**
 * Membership check used by navigation (Header's collection menu) to decide
 * whether a handle can be linked to yet.
 */
export async function hasCollectionData(handle: string): Promise<boolean> {
  return (await listAllHandles()).has(handle);
}
