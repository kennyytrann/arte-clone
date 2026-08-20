import Image from "next/image";
import Link from "next/link";
import type { CollectionProduct } from "./types";

const MONO = { fontFamily: "var(--font-roboto-mono), ui-monospace, monospace" };

export function CollectionProductCard({ product }: { product: CollectionProduct }) {
  const cardClassName = "group relative block w-full bg-white";
  const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.price;

  const content = (
    <>
      {product.badges.length > 0 ? (
        <div className="absolute left-[5px] top-[5px] z-10 flex flex-wrap gap-[3px]">
          {product.badges.map((badge) =>
            badge === "POPULAR" ? (
              <span
                key={badge}
                style={MONO}
                className="bg-arte-orange px-1 py-1 text-[9px] leading-none tracking-[-0.03em] text-white"
              >
                POPULAR
              </span>
            ) : (
              <span
                key={badge}
                style={MONO}
                className="bg-white px-1 py-1 text-[9px] leading-none tracking-[-0.03em] text-black"
              >
                NEW
              </span>
            )
          )}
        </div>
      ) : null}

      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#e5e5e5]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-opacity duration-200 group-hover:opacity-90"
          />
        ) : null}
      </div>

      <div className="px-1 py-3">
        <p className="truncate text-[13px] text-arte-text">{product.title}</p>
        <p className="mt-1 text-[13px]">
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

  // `href` is precomputed by getCollectionData/normalizeMedusaCollection (or
  // attachProductHrefs for reference data) — the card never decides this.
  if (product.href) {
    return (
      <Link href={product.href} className={cardClassName}>
        {content}
      </Link>
    );
  }

  return <div className={cardClassName}>{content}</div>;
}
