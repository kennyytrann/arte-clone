import { getProductData } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/getProductData";
import type { ProductSetData } from "./types";

/**
 * Product-set registry.
 *
 * There are still no Medusa "product set" records — a set here is title +
 * description + its own gallery + a list of EXISTING Medusa product handles,
 * each resolved through the normal `getProductData` loader. `/sets/[handle]`
 * renders these via `ProductSetPageTemplate`.
 */
/** Root for a set's own gallery assets: `<PRODUCT_SET_ASSETS>/<folder>/NN.ext`. */
const PRODUCT_SET_ASSETS =
  "/sites/arte-collective-com-1c7b1bdd/shared/product-sets/sets";

interface TestSetDefinition {
  handle: string;
  title: string;
  description?: string;
  /**
   * The set's OWN gallery images, in exact display order (index 0 = primary).
   * Explicitly listed — never derived from the filesystem or from either
   * member product.
   */
  images: string[];
  /** Existing Medusa product handles. EVERY handle must resolve for the set. */
  productHandles: string[];
}

// --- Toyota Supra MKIV "Tokyo Nights" 2-print set -------------------------
// Shared so the production handle and the retained `test-set` alias render the
// identical listing. The 7 gallery assets still live in the `sets/test-set/`
// folder (verified, in order) — the folder name predates the production handle
// and is deliberately not renamed here to avoid touching the assets.
const TOKYO_NIGHTS_IMAGES = [
  `${PRODUCT_SET_ASSETS}/test-set/01.png`,
  `${PRODUCT_SET_ASSETS}/test-set/02.jpg`,
  `${PRODUCT_SET_ASSETS}/test-set/03.jpg`,
  `${PRODUCT_SET_ASSETS}/test-set/04.jpg`,
  `${PRODUCT_SET_ASSETS}/test-set/05.jpg`,
  `${PRODUCT_SET_ASSETS}/test-set/06.jpg`,
  `${PRODUCT_SET_ASSETS}/test-set/07.jpg`,
];

// The two ACTUAL Medusa products this set groups. Both are real Size × Frame
// products with six variants each; they stay independent Medusa records.
const TOKYO_NIGHTS_PRODUCT_HANDLES = [
  "toyota-supra-neon-night-street-scene",
  "toyota-supra-on-neon-lit-street",
];

const TOKYO_NIGHTS_TITLE = "Toyota Supra MKIV Tokyo Nights – 2 Print Set";
const TOKYO_NIGHTS_DESCRIPTION =
  "A coordinated two-print Toyota Supra MKIV set featuring neon-lit Japanese street scenes. Designed to be displayed together for a cohesive automotive wall-art setup.";

const TEST_SETS: TestSetDefinition[] = [
  {
    // Production listing.
    handle: "toyota-supra-mkiv-tokyo-nights-2-print-set",
    title: TOKYO_NIGHTS_TITLE,
    description: TOKYO_NIGHTS_DESCRIPTION,
    images: TOKYO_NIGHTS_IMAGES,
    productHandles: TOKYO_NIGHTS_PRODUCT_HANDLES,
  },
  {
    // Temporary alias — the old dev URL still resolves to the same real
    // listing while the homepage "Shop the look" cards are pointed at the
    // production handle in a later step. Nothing external links here; safe to
    // delete once that wiring lands.
    handle: "test-set",
    title: TOKYO_NIGHTS_TITLE,
    description: TOKYO_NIGHTS_DESCRIPTION,
    images: TOKYO_NIGHTS_IMAGES,
    productHandles: TOKYO_NIGHTS_PRODUCT_HANDLES,
  },
];

/** Handles for `generateStaticParams` on the /sets/[handle] route. */
export function getAllProductSetHandles(): string[] {
  return TEST_SETS.map((s) => s.handle);
}

/** URL handle -> ProductSetData, or undefined if unknown / nothing resolved. */
export async function getProductSetData(
  handle: string
): Promise<ProductSetData | undefined> {
  const def = TEST_SETS.find((s) => s.handle === handle);
  if (!def) return undefined;

  const resolved = await Promise.all(
    def.productHandles.map((h) => getProductData(h))
  );
  const products = resolved.filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );

  // A set is only valid if ALL of its member products resolve — a set with a
  // missing product isn't a set. (Both members are real Medusa products, so
  // this needs Medusa reachable; it is, at dev + build time here.)
  if (products.length !== def.productHandles.length) return undefined;

  return {
    handle: def.handle,
    title: def.title,
    description: def.description,
    images: def.images,
    products,
  };
}

/**
 * Listing summary for a Product Set — its title plus the price the Product Set
 * page shows on initial load.
 *
 * IMPORTANT: `price` / `compareAtPrice` are the FIRST member product's cheapest
 * variant (smallest size + cheapest frame — i.e. the default selection). That
 * reflects ONE of the two underlying products; it is NOT a combined 2-print
 * total. Combined set pricing is not modelled yet. This deliberately matches
 * exactly what `ProductSetBuyBox` renders before the customer changes an
 * option, so the storefront stays consistent.
 */
export interface ProductSetListing {
  handle: string;
  title: string;
  price: number;
  compareAtPrice?: number;
}

/** Flat promo discount the Wix catalog migration baked into every price —
 *  mirrors `ProductSetBuyBox`'s `resolvePricing` / `ProductBuyBox`. */
const REAL_CATALOG_DISCOUNT_PERCENT = 30;

export async function getProductSetListing(
  handle: string
): Promise<ProductSetListing | undefined> {
  const set = await getProductSetData(handle);
  if (!set) return undefined;

  const variants = set.products[0]?.variants ?? [];
  if (variants.length === 0) {
    return { handle: set.handle, title: set.title, price: 0 };
  }

  const cheapest = variants.reduce((lo, v) => (v.price < lo.price ? v : lo));

  // Compare-at price, exactly as the Product Set page derives it: a genuine
  // Medusa `compareAtPrice` when present, otherwise reconstruct the pre-promo
  // price for real catalog variants (`optionValues` present) from the flat
  // 30% import discount. The default listing variant is the zero-surcharge
  // base tier, so its original is just `price / (1 - 0.30)`.
  let compareAtPrice = cheapest.compareAtPrice;
  if (
    (compareAtPrice == null || compareAtPrice <= cheapest.price) &&
    cheapest.optionValues
  ) {
    const reconstructed = Math.round(
      cheapest.price / (1 - REAL_CATALOG_DISCOUNT_PERCENT / 100)
    );
    compareAtPrice =
      reconstructed > cheapest.price ? reconstructed : undefined;
  }

  return {
    handle: set.handle,
    title: set.title,
    price: cheapest.price,
    compareAtPrice,
  };
}
