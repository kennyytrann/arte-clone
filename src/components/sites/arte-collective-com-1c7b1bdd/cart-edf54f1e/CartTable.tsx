"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/CartProvider";
import { CartItemRow } from "./CartItemRow";

const COLUMNS = ["Product", "Price", "Quantity", "Total"];

export function CartTable() {
  const { cart } = useCart();
  const items = cart?.items ?? [];

  return (
    <div>
      <div className="hidden border-b-[1.6px] border-[#e5e5e5] pb-[10px] md:grid md:grid-cols-12 md:gap-x-3">
        <span className="md:col-span-5 text-[13px] font-semibold uppercase text-arte-text">
          {COLUMNS[0]}
        </span>
        <span className="md:col-span-2 text-center text-[13px] font-semibold uppercase text-arte-text">
          {COLUMNS[1]}
        </span>
        <span className="md:col-span-2 text-center text-[13px] font-semibold uppercase text-arte-text">
          {COLUMNS[2]}
        </span>
        <span className="md:col-span-2 text-center text-[13px] font-semibold uppercase text-arte-text">
          {COLUMNS[3]}
        </span>
        <span className="md:col-span-1" />
      </div>

      {items.length > 0 ? (
        <div>
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="my-[100px] text-center">
          <ShoppingCart size={74} strokeWidth={1.5} className="mx-auto text-arte-text" />
          <h1 className="mb-5 mt-6 text-[50px] font-light text-arte-text">Your cart is empty.</h1>
          <p className="mx-auto max-w-[520px] text-[15px] leading-[25.5px] text-arte-text-muted">
            Before proceed to checkout you must add some products to your shopping cart. You will
            find a lot of interesting products on our &quot;Shop&quot; page.
          </p>
        </div>
      )}
    </div>
  );
}
