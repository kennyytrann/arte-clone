import type { HttpTypes } from "@medusajs/types";
import { medusa } from "./medusa";
import { getRegionContext } from "./medusa-region";

const CART_ID_STORAGE_KEY = "arte_medusa_cart_id";

export interface CartLineItem {
  id: string;
  variantId: string | undefined;
  /** Real Medusa variant SKU — also the Artelo Product ID for calculated shipping. */
  variantSku: string | undefined;
  productTitle: string;
  variantTitle: string;
  quantity: number;
  unitPrice: number;
  /** Absent when Medusa reports no discount for this line item. */
  compareAtUnitPrice?: number;
  thumbnail: string | null;
}

export interface CartSummary {
  id: string;
  currencyCode: string;
  items: CartLineItem[];
  totalQuantity: number;
}

function readStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CART_ID_STORAGE_KEY);
}

function storeCartId(id: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_ID_STORAGE_KEY, id);
}

function clearStoredCartId(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CART_ID_STORAGE_KEY);
}

/**
 * Read-only access to the persisted cart ID for the checkout/payment
 * services (checkout.ts, payment.ts) — they operate on the same cart this
 * module owns in localStorage without duplicating storage logic.
 */
export function getStoredCartId(): string | null {
  return readStoredCartId();
}

/**
 * Called once an order has been placed from the current cart (see
 * checkout.ts's completeCheckoutCart). A completed Medusa cart can't be
 * reused — clearing the ID here is what makes the next "Add to Cart" start a
 * fresh cart instead of erroring against the now-completed one.
 */
export function clearCompletedCart(): void {
  clearStoredCartId();
}

/**
 * Shared by the cart service and the checkout service (checkout.ts) so both
 * render the exact same real line-item data instead of two divergent
 * mappings of the same Medusa cart.
 */
export function toCartLineItems(items: HttpTypes.StoreCart["items"]): CartLineItem[] {
  return (items ?? []).map((item) => ({
    id: item.id,
    variantId: item.variant_id,
    variantSku: item.variant_sku ?? undefined,
    productTitle: item.product_title ?? item.title,
    variantTitle: item.variant_title ?? item.title,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    compareAtUnitPrice:
      item.compare_at_unit_price != null && item.compare_at_unit_price > item.unit_price
        ? item.compare_at_unit_price
        : undefined,
    thumbnail: item.thumbnail ?? null,
  }));
}

function toCartSummary(cart: HttpTypes.StoreCart): CartSummary {
  const items = cart.items ?? [];
  return {
    id: cart.id,
    currencyCode: cart.currency_code,
    items: toCartLineItems(items),
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

/**
 * Always creates a new Medusa cart in the current region and persists its ID
 * locally. Prefer `getOrCreateCart` for normal use — this is exposed
 * separately for the cart-service contract requested in the integration
 * task (createCart/getCart/addToCart/...).
 */
export async function createCart(): Promise<CartSummary> {
  const region = await getRegionContext();
  const { cart } = await medusa.store.cart.create({
    region_id: region?.regionId,
  });
  storeCartId(cart.id);
  return toCartSummary(cart);
}

/**
 * Returns the persisted cart if one exists and is still valid on the
 * backend. Returns null (never throws) if there is no stored cart ID, or if
 * the stored ID no longer resolves (deleted, expired, wrong environment) —
 * in that case the stale ID is cleared so the next add-to-cart starts fresh
 * instead of failing forever.
 */
export async function getCart(): Promise<CartSummary | null> {
  const id = readStoredCartId();
  if (!id) return null;

  try {
    const { cart } = await medusa.store.cart.retrieve(id);
    return toCartSummary(cart);
  } catch {
    clearStoredCartId();
    return null;
  }
}

async function getOrCreateCart(): Promise<CartSummary> {
  const existing = await getCart();
  if (existing) return existing;
  return createCart();
}

export async function addToCart(
  variantId: string,
  quantity: number = 1
): Promise<CartSummary> {
  const cart = await getOrCreateCart();
  const { cart: updated } = await medusa.store.cart.createLineItem(cart.id, {
    variant_id: variantId,
    quantity,
  });
  return toCartSummary(updated);
}

export async function updateCartItem(
  lineItemId: string,
  quantity: number
): Promise<CartSummary> {
  const cart = await getCart();
  if (!cart) throw new Error("No active cart to update.");
  const { cart: updated } = await medusa.store.cart.updateLineItem(cart.id, lineItemId, {
    quantity,
  });
  return toCartSummary(updated);
}

export async function removeCartItem(lineItemId: string): Promise<CartSummary> {
  const cart = await getCart();
  if (!cart) throw new Error("No active cart to update.");
  const { parent } = await medusa.store.cart.deleteLineItem(cart.id, lineItemId);
  if (parent) return toCartSummary(parent);
  // Fall back to a fresh read if the delete response didn't include the
  // updated cart (the `parent` field is optional in Medusa's response type).
  const refreshed = await medusa.store.cart.retrieve(cart.id);
  return toCartSummary(refreshed.cart);
}
