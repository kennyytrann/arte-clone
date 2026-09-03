import type { Product } from "@/types/product";
import { medusa, isMedusaConfigured } from "@/lib/medusa";
import { getRegionContext } from "@/lib/medusa-region";
import { getCollectionData } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/collections/getCollectionData";
import { productHref } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";
import { getCheapestVariantPrice } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/medusaPricing";
import type { HttpTypes } from "@medusajs/types";

/**
 * Real-data feeds for the four homepage product sections. Each returns the
 * plain `Product[]` shape `ProductCarousel`/`PrintOfWeekGrid` already
 * render — no new card UI, just real Medusa data replacing the cloned
 * reference arrays in src/app/page.tsx.
 */

function toProduct(product: HttpTypes.StoreProduct): Product {
  const { price, compareAtPrice } = getCheapestVariantPrice(product);

  return {
    handle: product.handle ?? product.id,
    title: product.title,
    price,
    compareAtPrice,
    image: product.thumbnail ?? null,
    href: productHref(product.handle ?? product.id),
  };
}

/** "Explore our iconic bestsellers" — the Medusa "Best Sellers" product collection. */
export async function getBestSellerProducts(limit = 8): Promise<Product[]> {
  const collection = await getCollectionData("best-sellers");
  if (!collection) return [];
  return collection.products.slice(0, limit).map((p) => ({
    handle: p.handle,
    title: p.title,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    image: p.image,
    href: p.href,
    badge: p.badges[0],
  }));
}

/** "Fresh from The lab" (Japanese Legends) / "Celebrate Artemis II" (Automotive Art) — real taxonomy categories. */
export async function getCategoryProductsForHomepage(categoryHandle: string, limit = 8): Promise<Product[]> {
  const collection = await getCollectionData(categoryHandle);
  if (!collection) return [];
  return collection.products.slice(0, limit).map((p) => ({
    handle: p.handle,
    title: p.title,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    image: p.image,
    href: p.href,
    badge: p.badges[0],
  }));
}

/**
 * "Print of the Week" — the full live catalog, unfiltered by category or
 * collection. Excludes the pre-Wix-migration reference products (Saturn V
 * and friends, kept in Medusa only as a visual/presentation reference — see
 * the migration report's PRODUCT CLEANUP AUDIT) so this section shows real
 * Invasive Frames inventory, not a mix of two unrelated catalogs. Real Wix
 * products are identified by their `wix_handle_id` metadata, set by the
 * importer — nothing here is a hardcoded product list.
 */
export async function getAllProductsForHomepage(limit = 8): Promise<Product[]> {
  if (!isMedusaConfigured) return [];
  try {
    const region = await getRegionContext();
    const { products } = await medusa.store.product.list({
      region_id: region?.regionId,
      limit: 100,
      // Metadata isn't in the Store API's default field set (confirmed via
      // direct curl — a bare product.list() returns metadata: undefined).
      // "+metadata" adds it on top of the defaults rather than replacing
      // them, so thumbnail/variants/calculated_price all still come through.
      fields: "+metadata",
    });
    const realCatalog = products.filter(
      (p) => (p.metadata as Record<string, unknown> | null)?.wix_handle_id
    );
    return realCatalog.slice(0, limit).map(toProduct);
  } catch (error) {
    console.error("[getHomepageProducts] Failed to load all products:", error);
    return [];
  }
}

/**
 * Framed hero image of every real catalog product, for the homepage
 * DecorativeCTA's two rotating side posters.
 *
 * ONLY the FIRST gallery image is used per product — `product.images[0].url`
 * (the framed product version), exactly like the PDP gallery's primary image
 * (`normalizeMedusaProduct` builds `images` from `product.images` in the same
 * order). Secondary gallery images — room mockups, close-ups, size guides —
 * are never included, and each product contributes at most one entry. Falls
 * back to `thumbnail` only if a product has no `images` array at all.
 * Same real-vs-reference `wix_handle_id` signal as the feeds above; region
 * context isn't needed since only the image URL is used, not price.
 */
export async function getProductHeroImages(limit = 100): Promise<string[]> {
  if (!isMedusaConfigured) return [];
  try {
    const { products } = await medusa.store.product.list({
      limit,
      // `images` is already in the Store API's default field set (see
      // getProductData.ts, which reads product.images without requesting it);
      // "+metadata" just adds the real-vs-reference signal on top.
      fields: "+metadata",
    });

    const seen = new Set<string>();
    const heroes: string[] = [];
    for (const p of products) {
      if (!(p.metadata as Record<string, unknown> | null)?.wix_handle_id) continue;
      // FIRST image only — never images[1..n] (mockups / close-ups / guides).
      const hero = p.images?.[0]?.url ?? p.thumbnail ?? null;
      if (!hero || seen.has(hero)) continue;
      seen.add(hero);
      heroes.push(hero);
    }
    return heroes;
  } catch (error) {
    console.error("[getHomepageProducts] Failed to load product hero images:", error);
    return [];
  }
}

/**
 * "Seen in the Wild" Instagram strip — real product photos from the live
 * Invasive Frames catalog (same `wix_handle_id` real-vs-reference signal as
 * `getAllProductsForHomepage`), never stock/placeholder images. Region
 * context isn't needed since only the thumbnail is used, not price.
 */
export async function getInstagramPhotos(limit = 8): Promise<string[]> {
  if (!isMedusaConfigured) return [];
  try {
    const { products } = await medusa.store.product.list({
      limit: 100,
      fields: "+metadata,+thumbnail",
    });
    const realCatalog = products.filter(
      (p) => (p.metadata as Record<string, unknown> | null)?.wix_handle_id && p.thumbnail
    );
    return realCatalog.slice(0, limit).map((p) => p.thumbnail!);
  } catch (error) {
    console.error("[getHomepageProducts] Failed to load Instagram photos:", error);
    return [];
  }
}
