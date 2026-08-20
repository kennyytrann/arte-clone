"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface ProductCarouselProps {
  eyebrow: string;
  heading: string;
  headingAccent: string;
  products: Product[];
  /** When present, the heading links to the section's real destination (e.g. a collection page). */
  headingHref?: string;
}

export function ProductCarousel({
  eyebrow,
  heading,
  headingAccent,
  products,
  headingHref,
}: ProductCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCards(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 260, behavior: "smooth" });
  }

  const headingContent = (
    <h2 className="font-sans text-[28px] leading-tight text-arte-text sm:text-[34px]">
      {heading} <em className="font-accent italic text-arte-orange">{headingAccent}</em>
    </h2>
  );

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8">
      <div className="mb-8 text-center">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-arte-text-muted">
          {eyebrow}
        </p>
        {headingHref ? <Link href={headingHref}>{headingContent}</Link> : headingContent}
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollByCards(-1)}
          className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center bg-arte-orange p-2 text-white sm:flex"
        >
          <ChevronLeft size={18} />
        </button>

        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto scroll-smooth px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div key={product.handle} className="w-[220px] shrink-0 sm:w-[240px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByCards(1)}
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center bg-arte-orange p-2 text-white sm:flex"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
