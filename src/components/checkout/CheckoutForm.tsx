"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { HttpTypes } from "@medusajs/types";
import {
  retrieveCheckoutCart,
  updateCartEmail,
  updateCartAddresses,
  listShippingOptions,
  setShippingMethod,
  type Address,
  type CheckoutCart,
  type ShippingOption,
} from "@/lib/checkout";
import { useCart } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/CartProvider";
import { staticRoutes } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";
import Link from "next/link";
import { CheckoutSection } from "./CheckoutSection";
import { OrderSummary } from "./OrderSummary";
import { PaymentSection } from "./PaymentSection";

const inputClass =
  "w-full border border-[#e5e5e5] bg-transparent px-4 py-3 text-[13px] text-arte-text placeholder:text-arte-text-muted focus:outline-none focus:border-arte-text";
const labelClass = "mb-1 block text-[11px] uppercase tracking-wide text-arte-text-muted";
const buttonClass =
  "h-[50px] w-full bg-arte-text text-[13px] font-medium uppercase tracking-wide text-white disabled:opacity-50";

type StepKey = "email" | "shipping" | "delivery" | "payment";

const EMPTY_ADDRESS: Address = {
  firstName: "",
  lastName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  province: "",
  postalCode: "",
  phone: "",
  countryCode: "us",
};

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isAddressComplete(a: Address) {
  return Boolean(
    a.firstName &&
      a.lastName &&
      a.addressLine1 &&
      a.city &&
      a.province &&
      a.postalCode
  );
}

function deriveStep(cart: CheckoutCart | null): StepKey {
  if (!cart || !cart.email) return "email";

  if (
    !cart.shippingAddress ||
    !isAddressComplete(cart.shippingAddress)
  ) {
    return "shipping";
  }

  if (cart.shippingMethods.length === 0) return "delivery";

  return "payment";
}




/**
 * Every address input below is a controlled component (value starts as
 * `""`). Merging a Medusa-sourced Address straight in would leave any
 * unset field as `undefined` and flip that input from controlled to
 * uncontrolled — this backfills `""` for anything Medusa didn't return.
 */
function withDefaults(address: Address | null): Address {
  return {
    firstName: address?.firstName ?? "",
    lastName: address?.lastName ?? "",
    addressLine1: address?.addressLine1 ?? "",
    addressLine2: address?.addressLine2 ?? "",
    city: address?.city ?? "",
    province: address?.province ?? "",
    postalCode: address?.postalCode ?? "",
    phone: address?.phone ?? "",
    countryCode: "us",
  };
}

export function CheckoutForm() {
  const router = useRouter();
  const { refreshCart } = useCart();

  const [cart, setCart] = useState<CheckoutCart | null | undefined>(undefined);
  const [activeStep, setActiveStep] = useState<StepKey>("email");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [shippingAddress, setShippingAddress] = useState<Address>(EMPTY_ADDRESS);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState<Address>(EMPTY_ADDRESS);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[] | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [savingDelivery, setSavingDelivery] = useState(false);

  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => {
    let cancelled = false;
    retrieveCheckoutCart()
      .then((result) => {
        if (cancelled) return;
        setCart(result);
        setActiveStep(deriveStep(result));
        if (result?.email) setEmail(result.email);
        if (result?.shippingAddress) setShippingAddress(withDefaults(result.shippingAddress));
        if (result?.billingAddress) {
          setBillingAddress(withDefaults(result.billingAddress));
          setBillingSameAsShipping(
            JSON.stringify(result.billingAddress) === JSON.stringify(result.shippingAddress)
          );
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError("We couldn't load your cart. Please refresh the page.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeStep !== "delivery" || !cart) return;
    let cancelled = false;
    setDeliveryError(null);
    listShippingOptions(cart)
      .then((options) => {
        if (cancelled) return;
        setShippingOptions(options);
        if (options.length === 1) setSelectedOptionId(options[0].id);
      })
      .catch(() => {
        if (!cancelled) setDeliveryError("Couldn't load shipping options for this address.");
      });
    return () => {
      cancelled = true;
    };
  }, [activeStep, cart]);

  async function handleEmailSubmit() {
    if (!isEmailValid(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError(null);
    setSavingEmail(true);
    try {
      const updated = await updateCartEmail(email);
      setCart(updated);
      setActiveStep("shipping");
    } catch {
      setEmailError("Couldn't save your email. Please try again.");
    } finally {
      setSavingEmail(false);
    }
  }

  async function handleAddressSubmit() {
    if (!isAddressComplete(shippingAddress)) {
      setAddressError("Please fill in first name, last name, address, city, state, and ZIP code.");
      return;
    }
    const billing = billingSameAsShipping ? shippingAddress : billingAddress;
    if (!billingSameAsShipping && !isAddressComplete(billing)) {
      setAddressError("Please complete the billing address, or use the same address as shipping.");
      return;
    }
    setAddressError(null);
    setSavingAddress(true);
    try {
      const updated = await updateCartAddresses({
        shippingAddress: { ...shippingAddress, countryCode: "us" },
        billingAddress: { ...billing, countryCode: "us" },
      });
      setCart(updated);
      setShippingOptions(null);
      setSelectedOptionId(null);
      setActiveStep("delivery");
    } catch {
      setAddressError("Couldn't save your address. Please try again.");
    } finally {
      setSavingAddress(false);
    }
  }

  async function handleDeliverySubmit() {
    if (!selectedOptionId || !cart) {
      setDeliveryError("Choose a shipping option to continue.");
      return;
    }
    setDeliveryError(null);
    setSavingDelivery(true);
    try {
      const updated = await setShippingMethod(selectedOptionId, cart);
      setCart(updated);
      setActiveStep("payment");
    } catch {
      setDeliveryError("Couldn't save your shipping method. Please try again.");
    } finally {
      setSavingDelivery(false);
    }
  }

  function handleOrderPlaced(order: HttpTypes.StoreOrder) {
    refreshCart();
    router.push(`/order-confirmation/${order.id}`);
  }

  if (loadError) {
    return <p className="text-[14px] text-red-600">{loadError}</p>;
  }

  if (cart === undefined) {
    return <p className="text-[14px] text-arte-text-muted">Loading checkout…</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="mb-3 text-[28px] font-light text-arte-text">Your cart is empty.</h1>
        <p className="mb-6 text-[14px] text-arte-text-muted">
          Add a product to your cart before checking out.
        </p>
        <Link
          href={staticRoutes.cart}
          className="inline-block bg-arte-text px-6 py-3 text-[13px] font-medium uppercase tracking-wide text-white"
        >
          Back to cart
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <CheckoutSection
          step={1}
          title="Contact"
          active={activeStep === "email"}
          complete={activeStep !== "email"}
          summary={cart.email}
          onEdit={() => setActiveStep("email")}
        >
          <label className={labelClass} htmlFor="checkout-email">
            Email
          </label>
          <input
            id="checkout-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
          {emailError ? <p className="mt-2 text-[12px] text-red-600">{emailError}</p> : null}
          <button
            type="button"
            onClick={handleEmailSubmit}
            disabled={savingEmail}
            className={`${buttonClass} mt-4`}
          >
            {savingEmail ? "Saving…" : "Continue to shipping"}
          </button>
        </CheckoutSection>

        <CheckoutSection
          step={2}
          title="Shipping address"
          active={activeStep === "shipping"}
          complete={activeStep !== "email" && activeStep !== "shipping"}
          summary={
            cart.shippingAddress ? (
              <span>
                {cart.shippingAddress.firstName} {cart.shippingAddress.lastName},{" "}
                {cart.shippingAddress.addressLine1}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.province} {cart.shippingAddress.postalCode}
              </span>
            ) : null
          }
          onEdit={() => setActiveStep("shipping")}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>First name</label>
              <input
                className={inputClass}
                value={shippingAddress.firstName}
                onChange={(e) => setShippingAddress((a) => ({ ...a, firstName: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Last name</label>
              <input
                className={inputClass}
                value={shippingAddress.lastName}
                onChange={(e) => setShippingAddress((a) => ({ ...a, lastName: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Address line 1</label>
              <input
                className={inputClass}
                value={shippingAddress.addressLine1}
                onChange={(e) => setShippingAddress((a) => ({ ...a, addressLine1: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Address line 2 (optional)</label>
              <input
                className={inputClass}
                value={shippingAddress.addressLine2}
                onChange={(e) => setShippingAddress((a) => ({ ...a, addressLine2: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input
                className={inputClass}
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress((a) => ({ ...a, city: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input
                className={inputClass}
                value={shippingAddress.province}
                onChange={(e) => setShippingAddress((a) => ({ ...a, province: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>ZIP code</label>
              <input
                className={inputClass}
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress((a) => ({ ...a, postalCode: e.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input className={inputClass} value="United States" disabled />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Phone (optional)</label>
              <input
                className={inputClass}
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress((a) => ({ ...a, phone: e.target.value }))}
              />
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 text-[13px] text-arte-text">
            <input
              type="checkbox"
              checked={billingSameAsShipping}
              onChange={(e) => setBillingSameAsShipping(e.target.checked)}
            />
            Billing address same as shipping
          </label>

          {!billingSameAsShipping ? (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#e5e5e5] pt-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>First name</label>
                <input
                  className={inputClass}
                  value={billingAddress.firstName}
                  onChange={(e) => setBillingAddress((a) => ({ ...a, firstName: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Last name</label>
                <input
                  className={inputClass}
                  value={billingAddress.lastName}
                  onChange={(e) => setBillingAddress((a) => ({ ...a, lastName: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Address line 1</label>
                <input
                  className={inputClass}
                  value={billingAddress.addressLine1}
                  onChange={(e) => setBillingAddress((a) => ({ ...a, addressLine1: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  className={inputClass}
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress((a) => ({ ...a, city: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  className={inputClass}
                  value={billingAddress.province}
                  onChange={(e) => setBillingAddress((a) => ({ ...a, province: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>ZIP code</label>
                <input
                  className={inputClass}
                  value={billingAddress.postalCode}
                  onChange={(e) => setBillingAddress((a) => ({ ...a, postalCode: e.target.value }))}
                />
              </div>
            </div>
          ) : null}

          {addressError ? <p className="mt-3 text-[12px] text-red-600">{addressError}</p> : null}
          <button
            type="button"
            onClick={handleAddressSubmit}
            disabled={savingAddress}
            className={`${buttonClass} mt-4`}
          >
            {savingAddress ? "Saving…" : "Continue to delivery"}
          </button>
        </CheckoutSection>

        <CheckoutSection
          step={3}
          title="Delivery"
          active={activeStep === "delivery"}
          complete={cart.shippingMethods.length > 0 && activeStep === "payment"}
          summary={cart.shippingMethods[0]?.name}
          onEdit={() => setActiveStep("delivery")}
        >
          {shippingOptions === null ? (
            deliveryError ? null : (
              <p className="text-[13px] text-arte-text-muted">Loading shipping options…</p>
            )
          ) : shippingOptions.length === 0 ? (
            <p className="text-[13px] text-arte-text-muted">
              No shipping options are available for this address yet. This is a backend
              fulfillment configuration gap — see the integration report.
            </p>
          ) : (
            <div className="space-y-2">
              {shippingOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center justify-between border border-[#e5e5e5] px-4 py-3 text-[13px] text-arte-text ${
                    option.amount === null ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping-option"
                      checked={selectedOptionId === option.id}
                      disabled={option.amount === null}
                      onChange={() => setSelectedOptionId(option.id)}
                    />
                    {option.name}
                  </span>
                  {/* Real amounts (e.g. Artelo's $4.91) are shown at full precision — never rounded to whole dollars. */}
                  <span>{option.amount === null ? "Unavailable" : `$${option.amount.toFixed(2)}`}</span>
                </label>
              ))}
            </div>
          )}
          {deliveryError ? <p className="mt-3 text-[12px] text-red-600">{deliveryError}</p> : null}
          <button
            type="button"
            onClick={handleDeliverySubmit}
            disabled={savingDelivery || !shippingOptions?.length}
            className={`${buttonClass} mt-4`}
          >
            {savingDelivery ? "Saving…" : "Continue to payment"}
          </button>
        </CheckoutSection>

        <CheckoutSection step={4} title="Payment" active={activeStep === "payment"} complete={false}>
          <PaymentSection cart={cart} onPlaced={handleOrderPlaced} />
        </CheckoutSection>
      </div>

      <div className="lg:col-span-5">
        <OrderSummary cart={cart} />
      </div>
    </div>
  );
}
