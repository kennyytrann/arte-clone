import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { Hero } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/Hero";
import { LogoStrip } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/LogoStrip";
import { EmailCaptureModal } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/EmailCaptureModal";
import { ShopTheLook } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/ShopTheLook";
import { CollectionsStack } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/CollectionsStack";
import { AboutUs } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/AboutUs";
import { VideoTabs } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/VideoTabs";
import { PrintOfWeekGrid } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/PrintOfWeekGrid";
import { CustomerReviews } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/CustomerReviews";
import { FAQAccordion } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/FAQAccordion";
import { DecorativeCTA } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/DecorativeCTA";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { ProductCarousel } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/ProductCarousel";
import {
  getBestSellerProducts,
  getCategoryProductsForHomepage,
  getAllProductsForHomepage,
} from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/getHomepageProducts";
import { staticRoutes, collectionHref } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";

export default async function Home() {
  // Real Medusa data for the three commerce sections — see the Invasive
  // Frames migration report for why each section maps to this specific
  // source: Best Sellers is a Medusa Product Collection; Automotive Art is
  // a real taxonomy category; Print of the Week is the full unfiltered
  // catalog. Each fetch degrades to an empty array (never fake data) if
  // Medusa is unreachable.
  const [bestsellers, automotiveArt, allProducts] = await Promise.all([
    getBestSellerProducts(),
    getCategoryProductsForHomepage("automotive-art"),
    getAllProductsForHomepage(),
  ]);

  return (
    <main className="min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Hero />
      <Header />
      <EmailCaptureModal />

      <ProductCarousel
        eyebrow="Trending now"
        heading="Explore our iconic"
        headingAccent="bestsellers"
        products={bestsellers}
        headingHref={collectionHref("best-sellers")}
      />

      <LogoStrip />
      <ShopTheLook />

      <ProductCarousel
        eyebrow="Back to Japan"
        heading="Celebrate"
        headingAccent="JDM"
        products={automotiveArt}
        headingHref={collectionHref("automotive-art")}
      />

      <CollectionsStack />
      <AboutUs />

      <VideoTabs />
      <PrintOfWeekGrid products={allProducts} headingHref={staticRoutes.allProducts} />
      <FAQAccordion />
      <CustomerReviews />
      <DecorativeCTA />
      <Footer />
    </main>
  );
}
