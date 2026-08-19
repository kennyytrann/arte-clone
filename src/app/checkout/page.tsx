import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata = {
  title: "Checkout – Arte Collective",
};

export default function CheckoutPage() {
  return (
    <main className="relative min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header />

      <div className="mx-auto w-full max-w-[1200px] px-5 pb-24 pt-[86px] sm:pt-[104px]">
        <h1 className="mb-10 text-[28px] font-light text-arte-text sm:text-[32px]">Checkout</h1>
        <CheckoutForm />
      </div>

      <Footer />
    </main>
  );
}
