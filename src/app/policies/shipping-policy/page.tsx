import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { EmailCaptureModal } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/EmailCaptureModal";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { PolicyPage } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/PolicyPage";
import { shippingPolicyContent } from "@/components/sites/arte-collective-com-1c7b1bdd/policies-shipping-policy-64928ae0/content";

export const metadata = {
  title: "Shipping policy – Arte Collective",
};

export default function ShippingPolicyPage() {
  return (
    <main className="relative min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header />
      <EmailCaptureModal />
      <PolicyPage {...shippingPolicyContent} />
      <Footer />
    </main>
  );
}
