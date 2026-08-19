import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { EmailCaptureModal } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/EmailCaptureModal";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { ProductCarousel } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/ProductCarousel";
import { ProductGallery } from "./ProductGallery";
import { ProductBuyBox } from "./ProductBuyBox";
import { InstagramStrip } from "./InstagramStrip";
import type { ProductData } from "./types";

export function ProductPageTemplate({ product }: { product: ProductData }) {
  return (
    <main className="min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header />
      <EmailCaptureModal />

      <section className="mx-auto max-w-[1200px] px-4 pt-[100px] pb-16 sm:px-8 sm:pt-[110px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <ProductGallery images={product.images} alt={product.title} />
          <ProductBuyBox product={product} />
        </div>
      </section>

      {product.relatedProducts.length > 0 ? (
        <ProductCarousel
          eyebrow="Best sellers"
          heading="You may"
          headingAccent="also like"
          products={product.relatedProducts}
        />
      ) : null}

      <InstagramStrip />
      <Footer />
    </main>
  );
}
