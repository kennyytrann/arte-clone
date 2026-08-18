import type { CollectionData } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/collections/types";
import { spaceProducts } from "./products";

const BANNER =
  "/sites/arte-collective-com-1c7b1bdd/collections-space-8bb32a7c/images/theme/space-banner.png";

// Hero label/rating/review count scraped from the live /collections/space
// page (see docs/research/.../collections-space-8bb32a7c/PAGE_TOPOLOGY.md).
export const spaceCollection: CollectionData = {
  handle: "space",
  title: "Space",
  heroLabel: "Space",
  heroImage: BANNER,
  rating: { value: 4.86, reviewCount: 300 },
  products: spaceProducts,
};
