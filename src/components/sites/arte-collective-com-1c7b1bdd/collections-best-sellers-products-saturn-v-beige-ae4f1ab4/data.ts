import type {
  ProductData,
  ProductSizeVariant,
} from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/types";
import { bestsellerProducts } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/data/products";

const GALLERY =
  "/sites/arte-collective-com-1c7b1bdd/collections-best-sellers-products-saturn-v-beige-ae4f1ab4/images/gallery/";
const THEME =
  "/sites/arte-collective-com-1c7b1bdd/collections-best-sellers-products-saturn-v-beige-ae4f1ab4/images/theme/";

const sizeVariants: ProductSizeVariant[] = [
  {
    id: "57754387710287",
    label: "small",
    dimensions: '12" x 18"',
    price: 39.0,
    compareAtPrice: 56.0,
  },
  {
    id: "57754387743055",
    label: "medium",
    dimensions: '20" x 30"',
    price: 49.0,
    compareAtPrice: 70.0,
    popular: true,
  },
  {
    id: "57754387775823",
    label: "large",
    dimensions: '24" x 36"',
    price: 59.0,
    compareAtPrice: 84.0,
  },
];

export const saturnVBeigeProduct: ProductData = {
  handle: "saturn-v-beige",
  title: "Saturn V - Beige",
  rating: 4.86,
  images: [
    GALLERY + "gallery-1.png",
    GALLERY + "gallery-2.png",
    GALLERY + "gallery-3.png",
    GALLERY + "gallery-4.png",
  ],
  variants: sizeVariants,
  buy2Get1ThumbSrc: THEME + "buy2get1-thumb.png",
  phoneWallpaperThumbSrc: THEME + "phone-wallpaper-thumb.png",
  relatedProducts: bestsellerProducts,
};
