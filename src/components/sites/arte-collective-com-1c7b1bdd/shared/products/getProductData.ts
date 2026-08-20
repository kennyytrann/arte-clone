import { cache } from "react";
import type { HttpTypes } from "@medusajs/types";
import type { Product } from "@/types/product";
import type { ProductData } from "./types";
import { medusa, isMedusaConfigured } from "@/lib/medusa";
import { getRegionContext } from "@/lib/medusa-region";
import { normalizeMedusaProduct } from "./normalizeMedusaProduct";
import { productHref } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";
import { saturnVBeigeProduct } from "@/components/sites/arte-collective-com-1c7b1bdd/collections-best-sellers-products-saturn-v-beige-ae4f1ab4/data";

/**
 * Local reference/fallback catalog. Kept ONLY so the previously-verified
 * Saturn V clone stays viewable as a visual/presentation reference — see the
 * PRODUCTS section of the Medusa integration report. Medusa is the
 * authoritative source whenever it has a matching handle; this registry is
 * consulted only when Medusa doesn't (or is unreachable).
 */
const REFERENCE_PRODUCTS: Record<string, ProductData> = {
  "saturn-v-beige": { ...saturnVBeigeProduct, isReferenceData: true },
};

async function fetchMedusaProductByHandle(
  handle: string,
  regionId: string | undefined
): Promise<HttpTypes.StoreProduct | null> {
  if (!isMedusaConfigured) return null;

  try {
    const { products } = await medusa.store.product.list({
      handle,
      limit: 1,
      region_id: regionId,
      // *variants.options.option is required to know each option's *title*
      // (e.g. "Size" vs "Frame") — the Store API's default variant fields
      // include the option value but not which axis it belongs to, which
      // VariantSelector needs to resolve a 2-option (Size × Frame) product.
      fields: "*categories,*variants.options.option",
    });
    return products[0] ?? null;
  } catch (error) {
    console.error(`[getProductData] Medusa lookup failed for handle "${handle}":`, error);
    return null;
  }
}

function toRelatedProduct(product: HttpTypes.StoreProduct): Product {
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
    href: productHref(product.handle ?? product.id),
  };
}

async function fetchRelatedProducts(
  excludeHandle: string,
  categoryId: string | undefined,
  regionId: string | undefined
): Promise<Product[]> {
  if (!isMedusaConfigured || !categoryId) return [];

  try {
    const { products } = await medusa.store.product.list({
      category_id: [categoryId],
      limit: 5,
      region_id: regionId,
    });
    return products.filter((p) => p.handle !== excludeHandle).map(toRelatedProduct);
  } catch (error) {
    console.error(`[getProductData] Failed to load related products for category "${categoryId}":`, error);
    return [];
  }
}

/**
 * URL handle → ProductData. Medusa is tried first; the local reference
 * registry is used only as a fallback (Medusa unreachable, or it simply
 * doesn't have this handle yet).
 */
export async function getProductData(handle: string): Promise<ProductData | undefined> {
  const region = await getRegionContext();
  const medusaProduct = await fetchMedusaProductByHandle(handle, region?.regionId);

  if (medusaProduct) {
    const data = normalizeMedusaProduct(medusaProduct);
    const categoryId = medusaProduct.categories?.[0]?.id;
    data.relatedProducts = await fetchRelatedProducts(handle, categoryId, region?.regionId);
    return data;
  }

  const reference = REFERENCE_PRODUCTS[handle];
  if (!reference) return undefined;

  return { ...reference, relatedProducts: await attachProductHrefs(reference.relatedProducts) };
}

/**
 * All known product handles (live Medusa + local reference), memoized per
 * request via React `cache()` so every card on a page shares one lookup
 * instead of each issuing its own request.
 */
const listAllHandles = cache(async (): Promise<Set<string>> => {
  const handles = new Set<string>(Object.keys(REFERENCE_PRODUCTS));

  if (isMedusaConfigured) {
    try {
      const { products } = await medusa.store.product.list({
        limit: 1000,
        fields: "handle",
      });
      for (const p of products) {
        if (p.handle) handles.add(p.handle);
      }
    } catch (error) {
      console.error("[getProductData] Failed to list Medusa product handles:", error);
    }
  }

  return handles;
});

export async function getAllProductHandles(): Promise<string[]> {
  return Array.from(await listAllHandles());
}

/**
 * Membership check used by navigation/data-assembly code (page/template
 * level, never per-card in a client component) to decide whether a
 * decorative/reference product handle can be linked yet.
 */
export async function hasProductData(handle: string): Promise<boolean> {
  return (await listAllHandles()).has(handle);
}

/**
 * Attaches `href` to each product based on the shared, request-memoized
 * handle set — one lookup total per page render, no matter how many
 * decorative/reference products are being annotated. Used by page/template
 * code that assembles product lists (never by the card components
 * themselves, and never per-card).
 */
export async function attachProductHrefs<T extends Product>(products: T[]): Promise<T[]> {
  const handles = await listAllHandles();
  return products.map((product) => ({
    ...product,
    href: handles.has(product.handle) ? productHref(product.handle) : undefined,
  }));
}
