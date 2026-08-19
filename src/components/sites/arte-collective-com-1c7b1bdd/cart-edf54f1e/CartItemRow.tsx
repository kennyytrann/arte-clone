"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartLineItem } from "@/lib/cart";
import { useCart } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/CartProvider";

export function CartItemRow({ item }: { item: CartLineItem }) {
  const { updateItem, removeItem, isLoading } = useCart();
  const hasDiscount =
    item.compareAtUnitPrice != null && item.compareAtUnitPrice > item.unitPrice;
  const lineTotal = item.unitPrice * item.quantity;

  function decrease() {
    if (item.quantity <= 1) {
      removeItem(item.id);
    } else {
      updateItem(item.id, item.quantity - 1);
    }
  }

  function increase() {
    updateItem(item.id, item.quantity + 1);
  }

  return (
    <div className="flex flex-col items-start gap-3 border-b border-[#e5e5e5] py-5 md:flex-row md:items-center md:gap-3">
      <div className="flex w-full items-center gap-4 md:w-5/12">
        <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden bg-[#e5e5e5]">
          {item.thumbnail ? (
            <Image
              src={item.thumbnail}
              alt={item.productTitle}
              fill
              sizes="100px"
              className="object-cover"
            />
          ) : null}
        </div>
        <div>
          <p className="text-[15px] text-arte-text">{item.productTitle}</p>
          <p className="mt-1 text-[12px] text-arte-text-muted">Size: {item.variantTitle}</p>
        </div>
      </div>

      <div className="w-full text-[15px] md:w-2/12 md:text-center">
        {hasDiscount ? (
          <>
            <span className="mr-2 text-[#bfbec8] line-through">
              ${item.compareAtUnitPrice!.toFixed(0)}
            </span>
            <span className="text-arte-orange">${item.unitPrice.toFixed(0)}</span>
          </>
        ) : (
          <span className="text-arte-text">${item.unitPrice.toFixed(0)}</span>
        )}
      </div>

      <div className="w-full md:w-2/12 md:flex md:justify-center">
        <div className="inline-flex h-[38px] w-[120px] items-center justify-between rounded-[4px] border-[1.6px] border-[#e5e5e5]">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={isLoading}
            onClick={decrease}
            className="flex h-[34px] w-[34px] items-center justify-center text-arte-text-muted disabled:opacity-50"
          >
            <Minus size={14} />
          </button>
          <span className="w-[34px] text-center text-[15px] text-arte-text">{item.quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={isLoading}
            onClick={increase}
            className="flex h-[34px] w-[34px] items-center justify-center text-arte-text-muted disabled:opacity-50"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="w-full text-[15px] text-arte-text md:w-2/12 md:text-center">
        ${lineTotal.toFixed(0)}
      </div>

      <div className="w-full md:w-1/12 md:flex md:justify-end">
        <button
          type="button"
          aria-label="Remove item"
          disabled={isLoading}
          onClick={() => removeItem(item.id)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-arte-text/5 text-arte-text disabled:opacity-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
