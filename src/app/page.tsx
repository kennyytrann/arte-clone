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

export default function Home() {
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
        products={bestsellerProducts}
      />

      <LogoStrip />
      <ShopTheLook />

      <ProductCarousel
        eyebrow="New arrivals"
        heading="Fresh from"
        headingAccent="The lab"
        products={newArrivalProducts}
      />

      <CollectionsStack />
      <AboutUs />

      <ProductCarousel
        eyebrow="Back to the moon"
        heading="Celebrate"
        headingAccent="Artemis II"
        products={artemisProducts}
      />

      <VideoTabs />
      <PrintOfWeekGrid products={printOfWeekProducts} />
      <InstagramStrip />
      <FAQAccordion />
      <DecorativeCTA />
      <Footer />
    </main>
  );
}
