"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ArrowDownRight } from "lucide-react";
import type { ProductData } from "./types";
import { VariantSelector } from "./VariantSelector";
import { TrustBadges } from "./TrustBadges";
import { useCart } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/CartProvider";

export function ProductBuyBox({ product }: { product: ProductData }) {
  const [selectedId, setSelectedId] = useState(product.variants[0]?.id);
  const variant = product.variants.find((v) => v.id === selectedId) ?? product.variants[0];
  const { addItem, isLoading, error } = useCart();
  const hasDiscount =
    variant != null && variant.compareAtPrice != null && variant.compareAtPrice > variant.price;
  const savePct = hasDiscount
    ? Math.round((1 - variant.price / variant.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="sticky top-6 lg:top-8">
      {product.rating != null ? (
        <div className="mb-2 flex items-center gap-1.5">
          <span className="flex items-center gap-[1px] text-arte-orange">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
            ))}
          </span>
          <span className="text-[13px] text-arte-text-muted">
            {product.rating.toFixed(2)}/5
          </span>
        </div>
      ) : null}

      <h1 className="mb-2 text-[26px] font-medium leading-tight text-arte-text sm:text-[30px]">
        {product.title}
      </h1>

      {variant ? (
        <div className="mb-5 flex items-center gap-2">
          {hasDiscount ? (
            <span className="text-[16px] text-arte-text-muted line-through">
              ${variant.compareAtPrice!.toFixed(0)}
            </span>
          ) : null}
          <span className="text-[20px] font-medium text-arte-orange">
            ${variant.price.toFixed(0)}
          </span>
          {hasDiscount ? (
            <span className="bg-arte-orange/10 px-2 py-1 text-[11px] font-medium uppercase text-arte-orange">
              Save {savePct}%
            </span>
          ) : null}
        </div>
      ) : null}

      {product.variants.length > 0 ? (
        <VariantSelector
          variants={product.variants}
          selectedId={selectedId ?? product.variants[0].id}
          onSelect={setSelectedId}
        />
      ) : null}

      {product.buy2Get1ThumbSrc ? (
        <div className="my-4 flex items-center gap-3 bg-neutral-100 px-3 py-2">
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-sm bg-white">
            <Image
              src={product.buy2Get1ThumbSrc}
              alt="Buy 2 get 1 free"
              fill
              className="object-contain p-1"
            />
          </span>
          <span className="flex-1 text-[13px] font-semibold uppercase tracking-wide text-arte-text">
            Buy 2 get 1 free
          </span>
          <ArrowDownRight size={16} className="shrink-0 text-arte-text-muted" />
        </div>
      ) : null}

      <button
        type="button"
        disabled={!variant || isLoading}
        onClick={() => variant && addItem(variant.id)}
        className="w-full bg-arte-orange py-3.5 text-[14px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-arte-orange-dark disabled:opacity-60"
      >
        {isLoading ? "Adding..." : "Add to cart"}
      </button>
      {error ? (
        <p className="mt-2 text-center text-[11px] text-red-600">{error}</p>
      ) : (
        <p className="mt-2 text-center text-[11px] text-arte-text-muted">
          No import/customs fees guaranteed.
        </p>
      )}

      <div className="mt-5">
        <TrustBadges phoneWallpaperThumbSrc={product.phoneWallpaperThumbSrc} />
      </div>
    </div>
  );
}
