"use client";

import { useMemo, type FormEvent } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<Stripe | null> | null = null;
function getStripe(): Promise<Stripe | null> | null {
  if (!publishableKey) return null;
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

function InnerForm({
  submitting,
  setSubmitting,
  onError,
  onAuthorized,
}: {
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
  onError: (message: string | null) => void;
  onAuthorized: () => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!stripe || !elements || submitting) return;

    setSubmitting(true);
    onError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      onError(submitError.message ?? "Please check your payment details.");
      setSubmitting(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      onError(error.message ?? "Your payment was declined. Please try a different card.");
      setSubmitting(false);
      return;
    }

    if (
      paymentIntent?.status === "succeeded" ||
      paymentIntent?.status === "processing" ||
      paymentIntent?.status === "requires_capture"
    ) {
      await onAuthorized();
    } else {
      onError("Payment could not be authorized. Please try again.");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || submitting}
        style={{ fontFamily: "var(--font-roboto-mono), ui-monospace, monospace" }}
        className="mt-6 h-[50px] w-full bg-arte-text text-[13px] font-medium uppercase tracking-wide text-white disabled:opacity-50"
      >
        {submitting ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}

/**
 * Renders Stripe's own Payment Element inside Stripe's iframe — card details
 * never pass through our components or servers, only Stripe's client SDK.
 * Only mounted when both the backend has Stripe registered as a provider and
 * NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set (see PaymentSection.tsx).
 */
export function StripeElementsForm({
  clientSecret,
  submitting,
  setSubmitting,
  onError,
  onAuthorized,
}: {
  clientSecret: string;
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
  onError: (message: string | null) => void;
  onAuthorized: () => Promise<void>;
}) {
  const stripe = useMemo(() => getStripe(), []);

  if (!stripe) {
    return <p className="text-[13px] text-red-600">Stripe is not configured on this device.</p>;
  }

  return (
    <Elements stripe={stripe} options={{ clientSecret }}>
      <InnerForm
        submitting={submitting}
        setSubmitting={setSubmitting}
        onError={onError}
        onAuthorized={onAuthorized}
      />
    </Elements>
  );
}
