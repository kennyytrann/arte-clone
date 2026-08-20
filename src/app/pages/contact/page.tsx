import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { ContactForm } from "@/components/sites/arte-collective-com-1c7b1bdd/pages-contact-e4ca4298/ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header />

      <div className="pt-[130px] sm:pt-[150px]">
        <ContactForm />
      </div>

      <Footer />
    </main>
  );
}
