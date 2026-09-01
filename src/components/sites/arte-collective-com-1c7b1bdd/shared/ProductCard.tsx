import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import {
  productCardDetailsClass,
  productCardImageBoxClass,
  productCardImageClass,
  productCardImageOverlayClass,
} from "@/components/sites/arte-collective-com-1c7b1bdd/shared/productCardHover";

export function ProductCard({ product }: { product: Product }) {
  const cardClassName = "group relative block w-full bg-white";
  const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.price;

  const content = (
    <>
      {product.badge ? (
        <span className="absolute left-0 top-0 z-10 bg-arte-orange px-[6px] py-[4px] text-[9px] font-medium uppercase tracking-[-0.27px] text-white">
          {product.badge}
        </span>
      ) : null}
      <div className={productCardImageBoxClass}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="240px"
            className={productCardImageClass}
          />
        ) : null}
        <span aria-hidden className={productCardImageOverlayClass} />
      </div>
      <div className="px-1 py-3">
        <p className="truncate text-[13px] text-arte-text">{product.title}</p>
        <p className={`mt-1 text-[13px] ${productCardDetailsClass}`}>
          {hasDiscount ? (
            <span className="mr-2 text-arte-text-muted line-through">
              ${product.compareAtPrice!.toFixed(0)}
            </span>
          ) : null}
          <span className="font-medium text-arte-orange">
            ${product.price.toFixed(0)}
          </span>
        </p>
      </div>
    </>
  );

  // `href` is precomputed by whoever assembled this product list (page or
  // template Server Component) — cards never decide linkability themselves.
  if (product.href) {
    return (
      <Link href={product.href} className={cardClassName}>
        {content}
      </Link>
    );
  }

  return <div className={cardClassName}>{content}</div>;
}
