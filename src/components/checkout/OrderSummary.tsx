"use client";

import Image from "next/image";
import type { CheckoutCart } from "@/lib/checkout";

function formatPrice(amount: number, currencyCode: string) {
  // Every price here has been a whole dollar amount until real Artelo
  // shipping quotes (e.g. $4.91) started flowing through — round only when
  // the amount actually has no fractional part, so existing whole-dollar
  // prices keep displaying exactly as before ("$39") while real fractional
  // ones show their true value instead of being silently rounded.
  const formatted = Number.isInteger(amount) ? amount.toFixed(0) : amount.toFixed(2);
  return `$${formatted} ${currencyCode.toUpperCase()}`;
}

export function OrderSummary({ cart }: { cart: CheckoutCart }) {
  return (
    <div className="border-[0.8px] border-[#e5e5e5] p-[30px]">
      <h2 className="mb-5 text-[13px] font-semibold uppercase tracking-wide text-arte-text">
        Order Summary
      </h2>

      <div className="flex flex-col gap-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden bg-[#e5e5e5]">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.productTitle}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              ) : null}
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-arte-text text-[10px] text-white">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-arte-text">{item.productTitle}</p>
              <p className="text-[11px] text-arte-text-muted">Size: {item.variantTitle}</p>
            </div>
            <div className="text-[13px] text-arte-text">
              {formatPrice(item.unitPrice * item.quantity, cart.currencyCode)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-[#e5e5e5] pt-4 text-[13px]">
        <div className="flex justify-between text-arte-text">
          <span>Subtotal</span>
          <span>{formatPrice(cart.itemSubtotal, cart.currencyCode)}</span>
        </div>
        <div className="flex justify-between text-arte-text-muted">
          <span>Shipping</span>
          <span>
            {cart.shippingMethods.length
              ? formatPrice(cart.shippingTotal, cart.currencyCode)
              : "Calculated at next step"}
          </span>
        </div>
        {cart.taxTotal > 0 ? (
          <div className="flex justify-between text-arte-text-muted">
            <span>Taxes</span>
            <span>{formatPrice(cart.taxTotal, cart.currencyCode)}</span>
          </div>
        ) : null}
        {cart.discountTotal > 0 ? (
          <div className="flex justify-between text-arte-orange">
            <span>Discount</span>
            <span>-{formatPrice(cart.discountTotal, cart.currencyCode)}</span>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-[#e5e5e5] pt-2 text-[15px] font-semibold text-arte-text">
          <span>Total</span>
          <span>{formatPrice(cart.total, cart.currencyCode)}</span>
        </div>
      </div>
    </div>
  );
}
