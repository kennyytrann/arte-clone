import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { EmailCaptureModal } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/EmailCaptureModal";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { ProductCarousel } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/ProductCarousel";
import { bestsellerProducts } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/data/products";
import { ProductGallery } from "@/components/sites/arte-collective-com-1c7b1bdd/collections-best-sellers-products-saturn-v-beige-ae4f1ab4/ProductGallery";
import { ProductBuyBox } from "@/components/sites/arte-collective-com-1c7b1bdd/collections-best-sellers-products-saturn-v-beige-ae4f1ab4/ProductBuyBox";
import { InstagramStrip } from "@/components/sites/arte-collective-com-1c7b1bdd/collections-best-sellers-products-saturn-v-beige-ae4f1ab4/InstagramStrip";
import { galleryImages, productTitle } from "@/components/sites/arte-collective-com-1c7b1bdd/collections-best-sellers-products-saturn-v-beige-ae4f1ab4/data";

export default function SaturnVBeigePage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header />
      <EmailCaptureModal />

      <section className="mx-auto max-w-[1200px] px-4 pt-[100px] pb-16 sm:px-8 sm:pt-[110px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <ProductGallery images={galleryImages} alt={productTitle} />
          <ProductBuyBox />
        </div>
      </section>

      <ProductCarousel
        eyebrow="Best sellers"
        heading="You may"
        headingAccent="also like"
        products={bestsellerProducts}
      />

      <InstagramStrip />
      <Footer />
    </main>
  );
}
