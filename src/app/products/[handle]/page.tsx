import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageTemplate } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/ProductPageTemplate";
import {
  getAllProductHandles,
  getProductData,
} from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/getProductData";

export function generateStaticParams() {
  return getAllProductHandles().map((handle) => ({ handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductData(handle);

  if (!product) {
    return {};
  }

  return {
    title: `${product.title} – Arte Collective`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductData(handle);

  if (!product) {
    notFound();
  }

  return <ProductPageTemplate product={product} />;
}
