import type { HttpTypes } from "@medusajs/types";
import { medusa } from "./medusa";
import { getStoredCartId, clearCompletedCart, toCartLineItems, type CartLineItem } from "./cart";

/**
 * camelCase mirror of Medusa's StoreAddAddress/StoreCartAddress — the
 * checkout UI never touches Medusa's snake_case field names directly, same
 * boundary pattern cart.ts already uses for line items.
 */
export interface Address {
  firstName?: string;
  lastName?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  countryCode?: string;
  phone?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  amount: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  amount: number;
  description?: string;
}

export interface CheckoutCart {
  id: string;
  currencyCode: string;
  regionId: string | null;
  email: string | null;
  items: CartLineItem[];
  shippingAddress: Address | null;
  billingAddress: Address | null;
  shippingMethods: ShippingMethod[];
  paymentCollectionId: string | null;
  /** Items only, excluding shipping — Medusa's own `subtotal` field already includes shipping. */
  itemSubtotal: number;
  shippingTotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
}

export type CompleteCartResult =
  | { status: "order"; order: HttpTypes.StoreOrder }
  | { status: "error"; message: string };

const CHECKOUT_FIELDS =
  "*items,*items.product,*items.variant,*shipping_address,*billing_address,*shipping_methods,*payment_collection,*payment_collection.payment_sessions,*region";

function toAddress(a?: HttpTypes.StoreCartAddress | null): Address | null {
  if (!a) return null;
  return {
    firstName: a.first_name ?? undefined,
    lastName: a.last_name ?? undefined,
    addressLine1: a.address_1 ?? undefined,
    addressLine2: a.address_2 ?? undefined,
    city: a.city ?? undefined,
    province: a.province ?? undefined,
    postalCode: a.postal_code ?? undefined,
    countryCode: a.country_code ?? undefined,
    phone: a.phone ?? undefined,
  };
}

function fromAddress(a: Address): HttpTypes.StoreAddAddress {
  return {
    first_name: a.firstName,
    last_name: a.lastName,
    address_1: a.addressLine1,
    address_2: a.addressLine2,
    city: a.city,
    province: a.province,
    postal_code: a.postalCode,
    country_code: a.countryCode,
    phone: a.phone,
  };
}

function toCheckoutCart(cart: HttpTypes.StoreCart): CheckoutCart {
  return {
    id: cart.id,
    currencyCode: cart.currency_code,
    regionId: cart.region_id ?? null,
    email: cart.email ?? null,
    items: toCartLineItems(cart.items),
    shippingAddress: toAddress(cart.shipping_address),
    billingAddress: toAddress(cart.billing_address),
    shippingMethods: (cart.shipping_methods ?? []).map((m) => ({
      id: m.id,
      name: m.name,
      amount: m.amount,
    })),
    paymentCollectionId: cart.payment_collection?.id ?? null,
    itemSubtotal: cart.item_subtotal,
    shippingTotal: cart.shipping_total,
    taxTotal: cart.tax_total,
    discountTotal: cart.discount_total,
    total: cart.total,
  };
}

/**
 * Every mutation below re-reads the persisted cart ID rather than trusting a
 * cartId passed in from a stale render — matches the defensive pattern
 * already used throughout cart.ts (getCart() re-checks localStorage on every
 * call rather than being handed an ID from closure state).
 */
function requireCartId(): string {
  const id = getStoredCartId();
  if (!id) throw new Error("No active cart — add a product to your cart before checking out.");
  return id;
}

export async function retrieveCheckoutCart(): Promise<CheckoutCart | null> {
  const id = getStoredCartId();
  if (!id) return null;
  try {
    const { cart } = await medusa.store.cart.retrieve(id, { fields: CHECKOUT_FIELDS });
    return toCheckoutCart(cart);
  } catch {
    return null;
  }
}

export async function updateCartEmail(email: string): Promise<CheckoutCart> {
  const { cart } = await medusa.store.cart.update(
    requireCartId(),
    { email },
    { fields: CHECKOUT_FIELDS }
  );
  return toCheckoutCart(cart);
}

export async function updateCartAddresses(params: {
  shippingAddress: Address;
  billingAddress: Address;
}): Promise<CheckoutCart> {
  const { cart } = await medusa.store.cart.update(
    requireCartId(),
    {
      shipping_address: fromAddress(params.shippingAddress),
      billing_address: fromAddress(params.billingAddress),
    },
    { fields: CHECKOUT_FIELDS }
  );
  return toCheckoutCart(cart);
}

export async function listShippingOptions(): Promise<ShippingOption[]> {
  const { shipping_options } = await medusa.store.fulfillment.listCartOptions({
    cart_id: requireCartId(),
  });
  return shipping_options.map((o) => ({
    id: o.id,
    name: o.name,
    amount: o.amount,
    description: o.type?.description,
  }));
}

export async function setShippingMethod(optionId: string): Promise<CheckoutCart> {
  const { cart } = await medusa.store.cart.addShippingMethod(
    requireCartId(),
    { option_id: optionId },
    { fields: CHECKOUT_FIELDS }
  );
  return toCheckoutCart(cart);
}

/**
 * Last step of checkout. On success, clears the completed cart's ID so the
 * next "Add to Cart" creates a fresh Medusa cart instead of reusing a
 * completed one (a completed cart can't accept new line items).
 */
export async function completeCheckoutCart(): Promise<CompleteCartResult> {
  const result = await medusa.store.cart.complete(requireCartId());
  if (result.type === "order") {
    clearCompletedCart();
    return { status: "order", order: result.order };
  }
  return {
    status: "error",
    message: result.error?.message ?? "We couldn't complete your order. Please try again.",
  };
}
