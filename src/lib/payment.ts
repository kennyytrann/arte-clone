import { medusa } from "./medusa";
import { getStoredCartId } from "./cart";

/**
 * The manual/system payment provider Medusa always registers, regardless of
 * config (see apps/backend/medusa-config.ts's comment on this). Used here to
 * label the development checkout path distinctly from a real Stripe payment.
 */
export const MANUAL_PAYMENT_PROVIDER_ID = "pp_system_default";
export const STRIPE_PAYMENT_PROVIDER_ID = "pp_stripe_stripe";

export interface PaymentProvider {
  id: string;
}

/**
 * Which payment providers the current region actually has enabled — never
 * hardcode this list. Today this only returns the manual provider; it will
 * also return STRIPE_PAYMENT_PROVIDER_ID once a real Stripe key is
 * configured on the backend and the region is updated to include it (see
 * apps/backend/src/migration-scripts/enable-stripe-region.ts).
 */
export async function listPaymentProviders(regionId: string): Promise<PaymentProvider[]> {
  const { payment_providers } = await medusa.store.payment.listPaymentProviders({
    region_id: regionId,
  });
  return payment_providers.map((p) => ({ id: p.id }));
}

export interface PaymentSessionResult {
  paymentCollectionId: string;
  providerId: string;
  /** Stripe's PaymentIntent client secret — present only for the Stripe provider. */
  clientSecret: string | null;
}

/**
 * Creates (or reuses) the cart's payment collection and initiates a session
 * with the chosen provider. For the manual provider this is enough to
 * authorize immediately; for Stripe, the returned clientSecret is what the
 * frontend hands to Stripe's Payment Element.
 */
export async function initiatePaymentSession(providerId: string): Promise<PaymentSessionResult> {
  const cartId = getStoredCartId();
  if (!cartId) throw new Error("No active cart — add a product to your cart before checking out.");

  const { cart } = await medusa.store.cart.retrieve(cartId);
  const { payment_collection } = await medusa.store.payment.initiatePaymentSession(cart, {
    provider_id: providerId,
  });

  const session = payment_collection.payment_sessions?.find((s) => s.provider_id === providerId);
  const clientSecret =
    session?.data && typeof session.data.client_secret === "string"
      ? (session.data.client_secret as string)
      : null;

  return {
    paymentCollectionId: payment_collection.id,
    providerId,
    clientSecret,
  };
}
