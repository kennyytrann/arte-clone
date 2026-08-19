import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { hasProductData } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/getProductData";
import { productHref } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";

export function ProductCard({ product }: { product: Product }) {
  const cardClassName = "group relative block w-full bg-[#e5e5e5]";

  const content = (
    <>
      {product.badge ? (
        <span className="absolute left-0 top-0 z-10 bg-arte-orange px-[6px] py-[4px] text-[9px] font-medium uppercase tracking-[-0.27px] text-white">
          {product.badge}
        </span>
      ) : null}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="240px"
          className="object-cover transition-opacity duration-200"
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
