export interface Product {
  handle: string;
  title: string;
  price: number;
  compareAtPrice: number;
  image: string;
  badge?: "POPULAR" | "NEW";
}
