import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { EmailCaptureModal } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/EmailCaptureModal";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { CollectionBanner } from "@/components/sites/arte-collective-com-1c7b1bdd/collections-space-8bb32a7c/CollectionBanner";
import { CollectionContent } from "@/components/sites/arte-collective-com-1c7b1bdd/collections-space-8bb32a7c/CollectionContent";
import { FloatingDiscountPill } from "@/components/sites/arte-collective-com-1c7b1bdd/collections-space-8bb32a7c/FloatingDiscountPill";
import { spaceProducts } from "@/components/sites/arte-collective-com-1c7b1bdd/collections-space-8bb32a7c/data/products";

export default function CollectionsSpacePage() {
  return (
    <main className="relative min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header />
      <EmailCaptureModal />

      <CollectionBanner />
      <CollectionContent products={spaceProducts} />

      <FloatingDiscountPill />
      <Footer />
    </main>
  );
}
