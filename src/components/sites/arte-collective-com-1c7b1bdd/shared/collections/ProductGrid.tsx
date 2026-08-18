"use client";

import { useEffect, useRef, useState } from "react";
import type { CollectionProduct } from "./types";
import { CollectionProductCard } from "./CollectionProductCard";

const BATCH_SIZE = 24;

export function ProductGrid({ products }: { products: CollectionProduct[] }) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset the reveal count whenever the underlying product list changes
  // (e.g. switching between the ALL and NEW filters). This follows React's
  // "adjusting state during render" pattern rather than an effect, so it
  // doesn't cause a cascading-render lint warning.
  const [prevProducts, setPrevProducts] = useState(products);
  if (products !== prevProducts) {
    setPrevProducts(products);
    setVisibleCount(BATCH_SIZE);
  }

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((count) => Math.min(count + BATCH_SIZE, products.length));
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [products.length]);

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="mx-auto max-w-[1360px] px-4 pb-16 sm:px-6">
      <div className="grid grid-cols-2 gap-x-[15px] gap-y-[15px] md:grid-cols-3 md:gap-x-[15px] md:gap-y-[30px] lg:grid-cols-4 lg:gap-x-[30px] lg:gap-y-[30px]">
        {visibleProducts.map((product) => (
          <CollectionProductCard key={product.handle} product={product} />
        ))}
      </div>

      {visibleCount < products.length ? (
        <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
      ) : null}
    </div>
  );
}
