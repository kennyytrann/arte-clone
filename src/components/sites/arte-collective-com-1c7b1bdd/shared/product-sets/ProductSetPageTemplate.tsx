import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { ProductCarousel } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/ProductCarousel";
import { collectionHref } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";
import { getInstagramPhotos } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/getHomepageProducts";
import { ProductGallery } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/ProductGallery";
import { InstagramStrip } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/InstagramStrip";
import { ProductSetBuyBox } from "./ProductSetBuyBox";
import type { ProductSetData } from "./types";

/**
 * ISOLATED fork of `../products/ProductPageTemplate.tsx`.
 *
 * Renders the SAME page layout as the normal product page for now, so a
 * Product Set URL looks identical to a normal product URL — a safe starting
 * point. It reads a `ProductSetData` and, for this step only, renders the
 * first member product (`set.products[0]`) through the existing single-product
 * layout.
 *
 * The real 2-product layout is a later step and belongs HERE — editing this
 * file or `ProductSetBuyBox` cannot affect normal product pages, which keep
 * using `../products/ProductPageTemplate.tsx` + `../products/ProductBuyBox.tsx`.
 *
 * Shared (reused as-is, generic): site chrome (AnnouncementBar / Header /
 * Footer), ProductCarousel, ProductGallery, InstagramStrip, getInstagramPhotos,
 * routes helper.
 */
export async function ProductSetPageTemplate({ set }: { set: ProductSetData }) {
  const photos = await getInstagramPhotos();

  // Layout still matches the normal product page. The gallery uses the set's
  // OWN images (`set.images`), independent of either member product; the buy
  // box receives the WHOLE set so one size/frame choice resolves + adds BOTH
  // products. Real 2-product layout comes later.
  const primary = set.products[0];

  return (
    <main className="min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header />

      <section className="mx-auto max-w-[1200px] px-4 pt-[100px] pb-16 sm:px-8 sm:pt-[110px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <ProductGallery images={set.images} alt={set.title} />
          <ProductSetBuyBox set={set} />
        </div>
      </section>

      {primary.relatedProducts.length > 0 ? (
        <ProductCarousel
          eyebrow="Best sellers"
          heading="You may"
          headingAccent="also like"
          products={primary.relatedProducts}
          headingHref={collectionHref("best-sellers")}
        />
      ) : null}

      <InstagramStrip photos={photos} />
      <Footer />
    </main>
  );
}
