"use client";

import { useEffect, useState } from "react";
import type { HttpTypes } from "@medusajs/types";
import {
  listPaymentProviders,
  initiatePaymentSession,
  MANUAL_PAYMENT_PROVIDER_ID,
  STRIPE_PAYMENT_PROVIDER_ID,
} from "@/lib/payment";
import { completeCheckoutCart, type CheckoutCart } from "@/lib/checkout";
import { StripeElementsForm } from "./StripeElementsForm";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export function PaymentSection({
  cart,
  onPlaced,
}: {
  cart: CheckoutCart;
  onPlaced: (order: HttpTypes.StoreOrder) => void;
}) {
  const [providerIds, setProviderIds] = useState<string[] | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stripeAvailable = Boolean(stripePublishableKey) && (providerIds ?? []).includes(STRIPE_PAYMENT_PROVIDER_ID);

  useEffect(() => {
    if (!cart.regionId) {
      setError("This cart has no region assigned — cannot determine available payment providers.");
      return;
    }
    let cancelled = false;
    listPaymentProviders(cart.regionId)
      .then((list) => {
        if (!cancelled) setProviderIds(list.map((p) => p.id));
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load payment options. Please refresh and try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [cart.regionId]);

  useEffect(() => {
    if (!providerIds || !stripeAvailable) return;
    let cancelled = false;
    initiatePaymentSession(STRIPE_PAYMENT_PROVIDER_ID)
      .then((session) => {
        if (!cancelled) setClientSecret(session.clientSecret);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't start the Stripe payment session.");
      });
    return () => {
      cancelled = true;
    };
  }, [providerIds, stripeAvailable]);

  async function handleManualPlaceOrder() {
    setSubmitting(true);
    setError(null);
    try {
      await initiatePaymentSession(MANUAL_PAYMENT_PROVIDER_ID);
      const result = await completeCheckoutCart();
      if (result.status === "order") {
        onPlaced(result.order);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStripeAuthorized() {
    const result = await completeCheckoutCart();
    if (result.status === "order") {
      onPlaced(result.order);
    } else {
      setError(result.message);
    }
  }

  if (!providerIds) {
    return <p className="text-[13px] text-arte-text-muted">Loading payment options…</p>;
  }

  if (providerIds.length === 0) {
    return (
      <p className="text-[13px] text-arte-text-muted">
        No payment provider is configured for this region yet. This is a backend configuration
        gap, not something you can fix from checkout — see the integration report.
      </p>
    );
  }

  if (stripeAvailable) {
    return (
      <div>
        {!clientSecret ? (
          <p className="text-[13px] text-arte-text-muted">Preparing secure payment…</p>
        ) : (
          <StripeElementsForm
            clientSecret={clientSecret}
            submitting={submitting}
            setSubmitting={setSubmitting}
            onError={setError}
            onAuthorized={handleStripeAuthorized}
          />
        )}
        {error ? <p className="mt-3 text-[13px] text-red-600">{error}</p> : null}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 border border-dashed border-arte-orange bg-arte-orange/5 p-3 text-[12px] leading-relaxed text-arte-text">
        <strong className="text-arte-orange">Development payment.</strong> No real card is
        charged — placing this order creates a real Medusa order using the manual/test payment
        provider. Configure <code>STRIPE_API_KEY</code> on the backend to enable real Stripe
        test-mode payments here instead.
      </div>
      <button
        type="button"
        onClick={handleManualPlaceOrder}
        disabled={submitting}
        style={{ fontFamily: "var(--font-roboto-mono), ui-monospace, monospace" }}
        className="h-[50px] w-full bg-arte-text text-[13px] font-medium uppercase tracking-wide text-white disabled:opacity-50"
      >
        {submitting ? "Placing order…" : "Place order (dev)"}
      </button>
      {error ? <p className="mt-3 text-[13px] text-red-600">{error}</p> : null}
    </div>
  );
}
