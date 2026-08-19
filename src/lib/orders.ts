import type { HttpTypes } from "@medusajs/types";
import { medusa } from "./medusa";

const ORDER_FIELDS =
  "*items,*items.product,*items.variant,*shipping_address,*billing_address,*shipping_methods,*payment_collections,*payment_collections.payment_sessions,*payment_collections.payments";

/**
 * Public, unauthenticated order lookup for the order-confirmation route.
 *
 * Medusa's own Store API route (`GET /store/orders/:id`) has no auth
 * middleware in this Medusa version — see
 * medusa-backend/apps/backend/node_modules/@medusajs/medusa/dist/api/store/orders/[id]/route.js,
 * which carries its own `// TODO: Do we want to apply some sort of
 * authentication here?` comment. This function calls that documented route
 * as-is; it does not add a new, less-safe endpoint.
 *
 * The safety model is the order ID itself: it's a high-entropy ULID that
 * can't be enumerated or guessed, the same "ID as bearer token" pattern
 * Medusa's own official Next.js Starter storefront uses for guest order
 * confirmation (and the same one Shopify/Stripe Checkout success pages
 * use). See the integration report for what a stronger model (customer
 * accounts + auth, or an email-matched lookup) would require.
 */
export async function getOrder(id: string): Promise<HttpTypes.StoreOrder | null> {
  try {
    const { order } = await medusa.store.order.retrieve(id, { fields: ORDER_FIELDS });
    return order;
  } catch {
    return null;
  }
}
