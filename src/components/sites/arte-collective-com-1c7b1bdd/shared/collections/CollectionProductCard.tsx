import Image from "next/image";
import Link from "next/link";
import type { CollectionProduct } from "./types";
import { hasProductData } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/getProductData";
import { productHref } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";

const MONO = { fontFamily: "var(--font-roboto-mono), ui-monospace, monospace" };

export function CollectionProductCard({ product }: { product: CollectionProduct }) {
  const cardClassName = "group relative block w-full bg-[#e5e5e5]";

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

      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-opacity duration-200 group-hover:opacity-90"
        />
      </div>

      <div className="px-1 py-3">
        <p className="truncate text-[13px] text-arte-text">{product.title}</p>
        <p className="mt-1 text-[13px]">
          <span className="mr-2 text-arte-text-muted line-through">
            ${product.compareAtPrice.toFixed(0)}
          </span>
          <span className="font-medium text-arte-orange">
            ${product.price.toFixed(0)}
          </span>
        </p>
      </div>
    </>
  );

  if (hasProductData(product.handle)) {
    return (
      <Link href={productHref(product.handle)} className={cardClassName}>
        {content}
      </Link>
    );
  }

  return <div className={cardClassName}>{content}</div>;
}
