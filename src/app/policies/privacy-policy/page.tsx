import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { PolicyPage } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/PolicyPage";
import { privacyPolicyContent } from "@/components/sites/arte-collective-com-1c7b1bdd/policies-privacy-policy-c6df4c25/content";

export const metadata = {
  title: "Privacy policy – Arte Collective",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header />
      <PolicyPage {...privacyPolicyContent} />
      <Footer />
    </main>
  );
}
