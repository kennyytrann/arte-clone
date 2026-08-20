import { AnnouncementBar } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/AnnouncementBar";
import { Header } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Header";
import { Footer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/Footer";
import { CartTable } from "@/components/sites/arte-collective-com-1c7b1bdd/cart-edf54f1e/CartTable";
import { CartSummary } from "@/components/sites/arte-collective-com-1c7b1bdd/cart-edf54f1e/CartSummary";

export const metadata = {
  title: "Cart – Arte Collective",
};

export default function CartPage() {
  return (
    <main className="relative min-h-screen w-full bg-white">
      <AnnouncementBar />
      <Header />

      <div className="mx-auto w-full max-w-[1320px] px-5 pb-24 pt-[86px] sm:pt-[104px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <CartTable />
          </div>
          <div className="lg:col-span-4">
            <CartSummary />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
