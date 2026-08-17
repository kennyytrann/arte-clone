import type { Product } from "@/types/product";
import { ProductCard } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/ProductCard";

export function PrintOfWeekGrid({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8">
      <div className="mb-8 text-center">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-arte-text-muted">
          Weekly feature
        </p>
        <h2 className="font-sans text-[28px] leading-tight text-arte-text sm:text-[34px]">
          Print of <em className="font-accent italic text-arte-orange">the Week</em>
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.handle} product={product} />
        ))}
      </div>
    </section>
  );
}
