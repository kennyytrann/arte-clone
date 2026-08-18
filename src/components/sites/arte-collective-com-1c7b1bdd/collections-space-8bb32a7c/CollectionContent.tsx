"use client";

import { useMemo, useState } from "react";
import type { SpaceProduct } from "./types";
import { FilterBar } from "./FilterBar";
import { FilterDrawer } from "./FilterDrawer";
import { ProductGrid } from "./ProductGrid";

export function CollectionContent({ products }: { products: SpaceProduct[] }) {
  const [activeFilter, setActiveFilter] = useState<"all" | "new">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const newProducts = useMemo(
    () => products.filter((p) => p.badges.includes("NEW")),
    [products]
  );

  const visibleProducts = activeFilter === "new" ? newProducts : products;

  return (
    <>
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        allCount={products.length}
        newCount={newProducts.length}
        onOpenFilters={() => setFiltersOpen(true)}
      />
      <ProductGrid products={visibleProducts} />
      <FilterDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </>
  );
}
