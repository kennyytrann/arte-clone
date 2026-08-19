import type { Product } from "@/types/product";

export interface ProductSizeVariant {
  id: string;
  label: "small" | "medium" | "large";
  dimensions: string;
  price: number;
  compareAtPrice: number;
  popular?: boolean;
}

/**
 * Normalized shape the ProductPageTemplate and its children render from.
 * Any data source (static registry today, Medusa later) just needs to
 * produce this shape — see getProductData.ts.
 */
export interface ProductData {
  handle: string;
  title: string;
  rating: number;
  images: string[];
  variants: ProductSizeVariant[];
  buy2Get1ThumbSrc: string;
  phoneWallpaperThumbSrc: string;
  relatedProducts: Product[];
}
