"use client";

/**
 * ISOLATED fork of `../products/ProductBuyBox.tsx`.
 *
 * Product-Set buy box: ONE size/frame choice drives BOTH member products. It
 * exists as its own file so set-specific behaviour (dual add-to-cart here) is
 * built WITHOUT touching the normal product page's `ProductBuyBox`.
 *
 * Low-level pieces stay shared: `TrustBadges`, the `ProductData` type,
 * `useCart`. Variant resolution lives in `./resolveProductSetVariant`.
 */

import { useCallback, useState } from "react";
import Image from "next/image";
import { Star, ArrowDownRight } from "lucide-react";
import type {
  ProductData,
  ProductSizeVariant,
} from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/types";
import { TrustBadges } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/TrustBadges";
import { useCart } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/CartProvider";
import { ProductSetSizeSelector, type SetSize } from "./ProductSetSizeSelector";
import {
  ProductSetFrameSelector,
  getFrameAxis,
} from "./ProductSetFrameSelector";
import { resolveProductSetVariant } from "./resolveProductSetVariant";
import type { ProductSetData } from "./types";

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

/** Optimistic drawer-line placeholder for one resolved set member. */
function lineHint(product: ProductData, variant: ProductSizeVariant) {
  return {
    productTitle: product.title,
    // Full "20x30 / Black Metal" — matches Medusa's `variant_title` so the
    // optimistic line doesn't flicker when the add reconciles.
    variantTitle: variant.dimensions,
    unitPrice: variant.price,
    thumbnail: product.images[0] ?? null,
  };
}

export function ProductSetBuyBox({ set }: { set: ProductSetData }) {
  const primary = set.products[0];
  const secondary = set.products[1];

  const [selectedSize, setSelectedSize] = useState<SetSize>("12x18");
  // Raw Medusa frame value ("Unframed" | "Black Metal"), or null until the
  // frame axis resolves — `effectiveFrame` then defaults to the cheapest
  // ("Unframed"). Independent of `selectedSize`: changing one never resets
  // the other. The SAME size + frame apply to BOTH products.
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const frameAxis = getFrameAxis(primary.variants);
  const effectiveFrame = selectedFrame ?? frameAxis?.values[0] ?? null;

  // One selection -> one variant per member product (own product's variant id).
  const variantA = resolveProductSetVariant(primary, selectedSize, effectiveFrame);
  const variantB = secondary
    ? resolveProductSetVariant(secondary, selectedSize, effectiveFrame)
    : undefined;

  const { addItem, error } = useCart();

  // Displayed price reflects the FIRST member product's resolved variant, using
  // the existing per-variant pricing. (Combined set pricing is a later step —
  // out of scope for this data/resolution/cart task.)
  const pricing = variantA ? resolvePricing(primary.variants, variantA) : null;
  const hasDiscount = pricing != null;
  const savePct = pricing?.savePct ?? 0;

  // Dedicated add-pending state (not the global cart `isLoading`).
  const [isAdding, setIsAdding] = useState(false);
  // Set-resolution error (a size/frame combo that doesn't exist for a member),
  // shown in the same slot as the cart error — never partially adds.
  const [resolveError, setResolveError] = useState<string | null>(null);

  const handleAdd = useCallback(async () => {
    if (isAdding) return;

    // ATOMIC guard: both member variants must resolve BEFORE the cart is
    // touched. If either doesn't, show an error and add nothing.
    if (!variantA || (secondary && !variantB)) {
      setResolveError(
        "This size / frame combination isn't available for the full set."
      );
      return;
    }
    setResolveError(null);
    setIsAdding(true);
    try {
      // Both adds hit the SAME Medusa cart (addItem -> getOrCreateCart). Two
      // distinct variant ids => two separate line items. Each add is tracked
      // independently in the CartProvider's pendingAdds + serialized on
      // pendingCartSync, so waitForCartSync() (checkout) already blocks on
      // BOTH. No CartProvider change needed.
      await addItem(variantA.id, 1, lineHint(primary, variantA));
      if (secondary && variantB) {
        await addItem(variantB.id, 1, lineHint(secondary, variantB));
      }
    } finally {
      setIsAdding(false);
    }
  }, [addItem, isAdding, primary, secondary, variantA, variantB]);

  return (
    <div className="sticky top-6 lg:top-8">
      {primary.rating != null ? (
        <div className="mb-2 flex items-center gap-1.5">
          <span className="flex items-center gap-[1px] text-arte-orange">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
            ))}
          </span>
          <span className="text-[13px] text-arte-text-muted">
            {primary.rating.toFixed(2)}/5
          </span>
        </div>
      ) : null}

      <h1 className="mb-2 text-[26px] font-medium leading-tight text-arte-text sm:text-[30px]">
        {set.title}
      </h1>

      {variantA ? (
        <div className="mb-5 flex items-center gap-1.5">
          {hasDiscount ? (
            <span className="text-[15px] text-arte-text-muted line-through">
              ${pricing!.originalPrice.toFixed(0)}
            </span>
          ) : null}
          <span className="text-[20px] font-medium text-arte-orange">
            ${variantA.price.toFixed(0)}
          </span>
          {hasDiscount ? (
            <span className="bg-arte-orange/10 px-1.5 py-0.5 text-[11px] font-medium uppercase text-arte-orange">
              Save {savePct}%
            </span>
          ) : null}
        </div>
      ) : null}

      <ProductSetFrameSelector
        variants={primary.variants}
        selected={effectiveFrame}
        onSelect={setSelectedFrame}
      />

      {primary.variants.length > 0 ? (
        <ProductSetSizeSelector
          selected={selectedSize}
          onSelect={setSelectedSize}
        />
      ) : null}

      {primary.buy2Get1ThumbSrc ? (
        <div className="my-4 flex items-center gap-3 bg-neutral-100 px-3 py-2">
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-sm bg-white">
            <Image
              src={primary.buy2Get1ThumbSrc}
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
        disabled={!variantA || isAdding}
        onClick={handleAdd}
        className="mt-5 w-full bg-arte-orange py-3.5 text-[14px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-arte-orange-dark disabled:opacity-60"
      >
        {isAdding ? "Adding..." : "Add to cart"}
      </button>
      {resolveError || error ? (
        <p className="mt-2 text-center text-[11px] text-red-600">
          {resolveError || error}
        </p>
      ) : (
        <p className="mt-2 text-center text-[11px] text-arte-text-muted">
          No import/customs fees guaranteed.
        </p>
      )}

      <div className="mt-5">
        <TrustBadges phoneWallpaperThumbSrc={primary.phoneWallpaperThumbSrc} />
      </div>
    </div>
  );
}
