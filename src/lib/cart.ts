import type { HttpTypes } from "@medusajs/types";
import { medusa } from "./medusa";
import { getRegionContext } from "./medusa-region";

const CART_ID_STORAGE_KEY = "arte_medusa_cart_id";

export interface CartLineItem {
  id: string;
  variantId: string | undefined;
  productTitle: string;
  variantTitle: string;
  quantity: number;
  unitPrice: number;
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

function toCartSummary(cart: HttpTypes.StoreCart): CartSummary {
  const items = cart.items ?? [];
  return {
    id: cart.id,
    currencyCode: cart.currency_code,
    items: items.map((item) => ({
      id: item.id,
      variantId: item.variant_id,
      productTitle: item.product_title ?? item.title,
      variantTitle: item.variant_title ?? item.title,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      thumbnail: item.thumbnail ?? null,
    })),
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
