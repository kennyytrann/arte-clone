import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductSetPageTemplate } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/product-sets/ProductSetPageTemplate";
import {
  getAllProductSetHandles,
  getProductSetData,
} from "@/components/sites/arte-collective-com-1c7b1bdd/shared/product-sets/getProductSetData";

/**
 * Dedicated route for Product Sets — `/sets/[handle]` — kept fully separate
 * from the normal product route `/products/[handle]`. Mirrors that route's
 * shape (generateStaticParams / generateMetadata / notFound) but points at
 * the isolated `ProductSetPageTemplate`.
 */
export function generateStaticParams() {
  return getAllProductSetHandles().map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const set = await getProductSetData(handle);

  if (!set) {
    return {};
  }

  return {
    title: `${set.title} – Arte Collective`,
  };
}

export default async function ProductSetPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const set = await getProductSetData(handle);

  if (!set) {
    notFound();
  }

  return <ProductSetPageTemplate set={set} />;
}
