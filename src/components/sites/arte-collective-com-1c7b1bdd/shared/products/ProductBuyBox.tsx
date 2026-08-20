"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ArrowDownRight } from "lucide-react";
import type { ProductData, ProductSizeVariant } from "./types";
import { VariantSelector } from "./VariantSelector";
import { TrustBadges } from "./TrustBadges";
import { useCart } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/CartProvider";

// The real Wix catalog migration applied a flat 30% promotional discount to
// every product's base price at import time (verified against the source
// catalog: all real products/variants use discountMode=PERCENT,
// discountValue=30, zero deviations). Medusa only stores the resulting
// final price for these variants — there's no separate "before discount"
// price the way there is for e.g. a genuine Medusa price-list discount
// (that case already has its own real `compareAtPrice` and is handled
// first, below, untouched). This constant exists only to reconstruct that
// real original price from the product's own real current variant prices —
// never an invented number.
const REAL_CATALOG_DISCOUNT_PERCENT = 30;

/**
 * Resolves { originalPrice, savePct } for `selected`, preferring a genuine
 * Medusa `compareAtPrice` when the variant already has one. Otherwise, for
 * real multi-option Wix products (`optionValues` present — never the static
 * reference catalog, which has no such discount), reconstructs the real
 * pre-discount price: the cheapest sibling variant is always the
 * zero-surcharge base tier, so its true original price is exactly
 * `price / (1 - 0.30)`; every other variant's original is that same base
 * plus whatever surcharge is implied by its own real current price. Returns
 * null when there isn't real evidence of an actual discount.
 */
function resolvePricing(
  variants: ProductSizeVariant[],
  selected: ProductSizeVariant
): { originalPrice: number; savePct: number } | null {
  if (selected.compareAtPrice != null && selected.compareAtPrice > selected.price) {
    return {
      originalPrice: selected.compareAtPrice,
      savePct: Math.round((1 - selected.price / selected.compareAtPrice) * 100),
    };
  }

  if (!selected.optionValues || variants.length < 2) return null;

  const discountFraction = REAL_CATALOG_DISCOUNT_PERCENT / 100;
  const basePrice = Math.min(...variants.map((v) => v.price));
  const baseOriginal = Math.round(basePrice / (1 - discountFraction));
  const baseDiscounted = Math.round(baseOriginal * (1 - discountFraction));
  const impliedSurcharge = selected.price - baseDiscounted;
  const originalPrice = baseOriginal + impliedSurcharge;

  if (originalPrice <= selected.price) return null;
  return { originalPrice, savePct: REAL_CATALOG_DISCOUNT_PERCENT };
}

export function ProductBuyBox({ product }: { product: ProductData }) {
  const [selectedId, setSelectedId] = useState(product.variants[0]?.id);
  const variant = product.variants.find((v) => v.id === selectedId) ?? product.variants[0];
  const { addItem, isLoading, error } = useCart();
  const pricing = variant ? resolvePricing(product.variants, variant) : null;
  const hasDiscount = pricing != null;
  const savePct = pricing?.savePct ?? 0;

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
        <div className="mb-5 flex items-center gap-1.5">
          {hasDiscount ? (
            <span className="text-[15px] text-arte-text-muted line-through">
              ${pricing!.originalPrice.toFixed(0)}
            </span>
          ) : null}
          <span className="text-[20px] font-medium text-arte-orange">
            ${variant.price.toFixed(0)}
          </span>
          {hasDiscount ? (
            <span className="bg-arte-orange/10 px-1.5 py-0.5 text-[11px] font-medium uppercase text-arte-orange">
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
        className="mt-5 w-full bg-arte-orange py-3.5 text-[14px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-arte-orange-dark disabled:opacity-60"
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
