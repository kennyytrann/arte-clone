import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { Hero } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/Hero";
import { EmailCaptureModal } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/EmailCaptureModal";
import { LogoStrip } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/LogoStrip";
import { ShopTheLook } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/ShopTheLook";
import { CollectionsStack } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/CollectionsStack";
import { AboutUs } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/AboutUs";
import { VideoTabs } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/VideoTabs";
import { PrintOfWeekGrid } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/PrintOfWeekGrid";
import { InstagramStrip } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/InstagramStrip";
import { FAQAccordion } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/FAQAccordion";
import { DecorativeCTA } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/DecorativeCTA";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { ProductCarousel } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/ProductCarousel";
import {
  bestsellerProducts,
  newArrivalProducts,
  artemisProducts,
  printOfWeekProducts,
} from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/data/products";
import { attachProductHrefs } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/getProductData";

export default async function Home() {
  // These four arrays are the cloned homepage's decorative/reference product
  // data (not fetched from Medusa — see the Medusa integration report's
  // HOMEPAGE section). `attachProductHrefs` is the one place that decides
  // which of them happen to have a resolvable /products/{handle} today
  // (currently just "saturn-v-beige"); it's a single request-memoized
  // lookup shared across all four lists, not one call per product.
  const [bestsellers, newArrivals, artemis, printOfWeek] = await Promise.all([
    attachProductHrefs(bestsellerProducts),
    attachProductHrefs(newArrivalProducts),
    attachProductHrefs(artemisProducts),
    attachProductHrefs(printOfWeekProducts),
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
      />

      <LogoStrip />
      <ShopTheLook />

      <ProductCarousel
        eyebrow="New arrivals"
        heading="Fresh from"
        headingAccent="The lab"
        products={newArrivals}
      />

      <CollectionsStack />
      <AboutUs />

      <ProductCarousel
        eyebrow="Back to the moon"
        heading="Celebrate"
        headingAccent="Artemis II"
        products={artemis}
      />

      <VideoTabs />
      <PrintOfWeekGrid products={printOfWeek} />
      <InstagramStrip />
      <FAQAccordion />
      <DecorativeCTA />
      <Footer />
    </main>
  );
}
