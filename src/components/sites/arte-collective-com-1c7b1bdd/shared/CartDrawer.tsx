"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, X } from "lucide-react";

import type { CartLineItem } from "@/lib/cart";
import { staticRoutes } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";
import { useCart } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/CartProvider";

const MONO_FONT = "var(--font-roboto-mono), ui-monospace, monospace";

function formatPrice(amount: number): string {
  return `$${amount.toFixed(0)}`;
}

/**
 * Slide-in cart drawer mounted globally by CartProvider. It reads and mutates
 * the single shared cart state via useCart() — it does NOT own any cart state
 * of its own. Visibility is driven by CartProvider's isCartOpen, which
 * addItem() flips to true after a successful add.
 */
export function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    totalQuantity,
    isLoading,
    error,
    updateItem,
    removeItem,
    waitForCartSync,
    isCartOpen,
    closeCart,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const items = cart?.items ?? [];
  const currencyCode = cart?.currencyCode?.toUpperCase() ?? "USD";
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const hasItems = items.length > 0;

  // Close on Escape.
  useEffect(() => {
    if (!isCartOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeCart();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!isCartOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isCartOpen]);

  async function handleCheckout() {
    if (isCheckingOut) return;
    setIsCheckingOut(true);
    try {
      // Guarantee optimistic/debounced quantity edits AND pending optimistic
      // deletions reach Medusa before the checkout page loads and reads the
      // cart.
      await waitForCartSync();
      closeCart();
      router.push("/checkout");
    } catch {
      // A background quantity sync or deletion failed. waitForCartSync() has
      // already restored the authoritative cart and set `error`; stay on the
      // page so the user sees it instead of checking out with a stale cart.
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div
      aria-hidden={!isCartOpen}
      className={`fixed inset-0 z-[100] ${
        isCartOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Dark translucent page overlay */}
      <button
        type="button"
        aria-label="Close cart"
        tabIndex={isCartOpen ? 0 : -1}
        onClick={closeCart}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#e5e5e5] px-5 py-4 sm:px-6">
          <div className="flex items-baseline gap-2">
            <span className="text-[13px] font-semibold uppercase tracking-wide text-arte-text">
              Your Cart
            </span>
            <span className="text-[13px] text-arte-text-muted">
              ({totalQuantity})
            </span>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center text-arte-text-muted transition-colors hover:text-arte-text"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6">
          {error ? (
            <p className="mt-4 text-[13px] text-arte-orange">{error}</p>
          ) : null}

          {hasItems ? (
            <ul>
              {items.map((item) => (
                <CartDrawerLine
                  key={item.id}
                  item={item}
                  disabled={isLoading}
                  onDecrease={() => updateItem(item.id, item.quantity - 1)}
                  onIncrease={() => updateItem(item.id, item.quantity + 1)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </ul>
          ) : (
            <div className="py-20 text-center">
              <p className="text-[15px] text-arte-text">Your cart is empty.</p>
              <p className="mx-auto mt-2 max-w-[280px] text-[13px] text-arte-text-muted">
                Add some products to your shopping cart to get started.
              </p>
            </div>
          )}
        </div>

        {hasItems ? (
          <div className="border-t border-[#e5e5e5] px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <strong className="text-[15px] text-arte-text">Subtotal:</strong>
              <span className="text-[15px] text-arte-text">
                {formatPrice(subtotal)} {currencyCode}
              </span>
            </div>
            <p className="mt-2 text-[13px] text-arte-text-muted">
              Shipping calculated at checkout
            </p>

            <Link
              href={staticRoutes.cart}
              onClick={closeCart}
              style={{ fontFamily: MONO_FONT }}
              className="mt-4 flex h-[50px] w-full items-center justify-center border border-arte-text text-[13px] font-medium uppercase tracking-wide text-arte-text transition-colors hover:bg-arte-text hover:text-white"
            >
              View Cart
            </Link>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              style={{ fontFamily: MONO_FONT }}
              className="mt-3 flex h-[50px] w-full items-center justify-center bg-arte-text text-[13px] font-medium uppercase tracking-wide text-white transition-opacity disabled:opacity-60"
            >
              {isCheckingOut ? "Syncing…" : "Checkout"}
            </button>
          </div>
        ) : null}
      </aside>
    </div>
  );
}

interface CartDrawerLineProps {
  item: CartLineItem;
  disabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}

function CartDrawerLine({
  item,
  disabled,
  onDecrease,
  onIncrease,
  onRemove,
}: CartDrawerLineProps) {
  const lineTotal = item.unitPrice * item.quantity;
  const atMinQuantity = item.quantity <= 1;

  return (
    <li className="flex gap-4 border-b border-[#e5e5e5] py-5">
      <div className="relative h-[90px] w-[90px] shrink-0 overflow-hidden bg-[#e5e5e5]">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt={item.productTitle}
            fill
            sizes="90px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-[14px] text-arte-text">
              {item.productTitle}
            </p>
            {item.variantTitle ? (
              <p className="mt-1 text-[12px] text-arte-text-muted">
                {item.variantTitle}
              </p>
            ) : null}
            <p className="mt-1 text-[12px] text-arte-text-muted">
              {formatPrice(item.unitPrice)} each
            </p>
          </div>
          <button
            type="button"
            aria-label="Remove item"
            disabled={disabled}
            onClick={onRemove}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-arte-text/5 text-arte-text transition-colors hover:bg-arte-text/10 disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="inline-flex h-[34px] w-[110px] items-center justify-between rounded-[4px] border-[1.6px] border-[#e5e5e5]">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={disabled || atMinQuantity}
              onClick={() => {
                if (!atMinQuantity) onDecrease();
              }}
              className="flex h-[30px] w-[32px] items-center justify-center text-arte-text-muted disabled:opacity-40"
            >
              <Minus size={13} />
            </button>
            <span className="w-[30px] text-center text-[14px] text-arte-text">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={disabled}
              onClick={onIncrease}
              className="flex h-[30px] w-[32px] items-center justify-center text-arte-text-muted disabled:opacity-50"
            >
              <Plus size={13} />
            </button>
          </div>

          <span className="text-[14px] text-arte-text">
            {formatPrice(lineTotal)}
          </span>
        </div>
      </div>
    </li>
  );
}
