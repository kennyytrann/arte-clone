import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { EmailCaptureModal } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/EmailCaptureModal";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { PolicyPage } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/PolicyPage";
import { termsOfServiceContent } from "@/components/sites/arte-collective-com-1c7b1bdd/policies-terms-of-service-3f95b8b5/content";

export const metadata = {
  title: "Terms of service – Arte Collective",
};

export default function TermsOfServicePage() {
  return (
    <main className="relative min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header />
      <EmailCaptureModal />
      <PolicyPage {...termsOfServiceContent} />
      <Footer />
    </main>
  );
}
