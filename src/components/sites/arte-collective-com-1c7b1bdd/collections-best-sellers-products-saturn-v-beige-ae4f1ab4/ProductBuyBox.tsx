"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ArrowDownRight } from "lucide-react";
import {
  productTitle,
  productRating,
  sizeVariants,
  buy2Get1ThumbSrc,
} from "./data";
import { VariantSelector } from "./VariantSelector";
import { TrustBadges } from "./TrustBadges";

export function ProductBuyBox() {
  const [selectedId, setSelectedId] = useState(sizeVariants[0].id);
  const variant =
    sizeVariants.find((v) => v.id === selectedId) ?? sizeVariants[0];
  const savePct = Math.round(
    (1 - variant.price / variant.compareAtPrice) * 100
  );

  return (
    <div className="sticky top-6 lg:top-8">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="flex items-center gap-[1px] text-arte-orange">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
          ))}
        </span>
        <span className="text-[13px] text-arte-text-muted">
          {productRating.toFixed(2)}/5
        </span>
      </div>

      <h1 className="mb-2 text-[26px] font-medium leading-tight text-arte-text sm:text-[30px]">
        {productTitle}
      </h1>

      <div className="mb-5 flex items-center gap-2">
        <span className="text-[16px] text-arte-text-muted line-through">
          ${variant.compareAtPrice.toFixed(0)}
        </span>
        <span className="text-[20px] font-medium text-arte-orange">
          ${variant.price.toFixed(0)}
        </span>
        <span className="bg-arte-orange/10 px-2 py-1 text-[11px] font-medium uppercase text-arte-orange">
          Save {savePct}%
        </span>
      </div>

      <VariantSelector
        variants={sizeVariants}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <div className="my-4 flex items-center gap-3 bg-neutral-100 px-3 py-2">
        <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-sm bg-white">
          <Image
            src={buy2Get1ThumbSrc}
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

      <button
        type="button"
        className="w-full bg-arte-orange py-3.5 text-[14px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-arte-orange-dark"
      >
        Add to cart
      </button>
      <p className="mt-2 text-center text-[11px] text-arte-text-muted">
        No import/customs fees guaranteed.
      </p>

      <div className="mt-5">
        <TrustBadges />
      </div>
    </div>
  );
}
