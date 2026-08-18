import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/Header";
import { EmailCaptureModal } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/EmailCaptureModal";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/Footer";
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
