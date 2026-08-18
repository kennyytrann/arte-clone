import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { EmailCaptureModal } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/EmailCaptureModal";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { CollectionBanner } from "./CollectionBanner";
import { CollectionContent } from "./CollectionContent";
import { FloatingDiscountPill } from "./FloatingDiscountPill";
import type { CollectionData } from "./types";

export function CollectionPageTemplate({ collection }: { collection: CollectionData }) {
  return (
    <main className="relative min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header />
      <EmailCaptureModal />

      <CollectionBanner
        heroImage={collection.heroImage}
        heroLabel={collection.heroLabel}
        rating={collection.rating}
      />
      <CollectionContent products={collection.products} />

      <FloatingDiscountPill />
      <Footer />
    </main>
  );
}
