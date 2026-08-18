import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/Header";
import { EmailCaptureModal } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/EmailCaptureModal";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/Footer";
import { PolicyPage } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/PolicyPage";
import { refundPolicyContent } from "@/components/sites/arte-collective-com-1c7b1bdd/policies-refund-policy-4c934ce1/content";

export const metadata = {
  title: "Refund policy – Arte Collective",
};

export default function RefundPolicyPage() {
  return (
    <main className="relative min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header />
      <EmailCaptureModal />
      <PolicyPage {...refundPolicyContent} />
      <Footer />
    </main>
  );
}
