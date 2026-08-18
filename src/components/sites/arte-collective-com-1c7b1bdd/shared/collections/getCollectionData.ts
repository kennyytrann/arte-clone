import type { CollectionData } from "./types";
import { spaceCollection } from "@/components/sites/arte-collective-com-1c7b1bdd/collections-space-8bb32a7c/data/collection";

/**
 * Temporary in-memory collection registry, keyed by URL handle.
 *
 * This is the seam a future Medusa integration replaces: swap the body of
 * `getCollectionData` for a Medusa API/DB call that resolves a handle to the
 * same `CollectionData` shape, and every component downstream
 * (CollectionPageTemplate, CollectionBanner, CollectionContent, ProductGrid,
 * CollectionProductCard, FilterBar, FilterDrawer) keeps working unchanged.
 */
const collections: Record<string, CollectionData> = {
  space: spaceCollection,
};

export async function getCollectionData(
  handle: string
): Promise<CollectionData | undefined> {
  return collections[handle];
}

export function getAllCollectionHandles(): string[] {
  return Object.keys(collections);
}
