"use client";

import Link from "next/link";
import { useCart } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/CartProvider";

const CHECKOUT_BUTTON_CLASS =
  "mt-6 flex h-[50px] w-full items-center justify-center bg-arte-text text-[13px] font-medium uppercase tracking-wide text-white";

export function CartSummary() {
  const { cart } = useCart();
  const subtotal = cart?.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) ?? 0;
  const currencyCode = cart?.currencyCode?.toUpperCase() ?? "USD";
  const hasItems = Boolean(cart && cart.items.length > 0);

  return (
    <div className="mb-10 border-[0.8px] border-[#e5e5e5] p-[30px]">
      <div className="flex items-center justify-between">
        <strong className="text-[15px] text-arte-text">Subtotal:</strong>
        <span className="text-[15px] text-arte-text">
          ${subtotal.toFixed(0)} {currencyCode}
        </span>
      </div>
      <p className="mt-3 text-[13px] text-arte-text-muted">Shipping calculated at checkout</p>
      {hasItems ? (
        <Link
          href="/checkout"
          style={{ fontFamily: "var(--font-roboto-mono), ui-monospace, monospace" }}
          className={CHECKOUT_BUTTON_CLASS}
        >
          Check Out
        </Link>
      ) : (
        <button
          type="button"
          disabled
          style={{ fontFamily: "var(--font-roboto-mono), ui-monospace, monospace" }}
          className={CHECKOUT_BUTTON_CLASS}
        >
          Check Out
        </button>
      )}
    </div>
  );
}
