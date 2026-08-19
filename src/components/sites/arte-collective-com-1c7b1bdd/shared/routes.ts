/**
 * Centralized route helpers for the Arte Collective clone.
 *
 * Static routes are literal paths that exist today. Collection/product
 * hrefs are derived from handles so new handles work automatically once
 * their data is registered — see getCollectionData.ts / getProductData.ts.
 */
export const staticRoutes = {
  home: "/",
  cart: "/cart",
  contact: "/pages/contact",
  privacyPolicy: "/policies/privacy-policy",
  refundPolicy: "/policies/refund-policy",
  shippingPolicy: "/policies/shipping-policy",
  termsOfService: "/policies/terms-of-service",
} as const;

export function collectionHref(handle: string): string {
  return `/collections/${handle}`;
}

export function productHref(handle: string): string {
  return `/products/${handle}`;
}
