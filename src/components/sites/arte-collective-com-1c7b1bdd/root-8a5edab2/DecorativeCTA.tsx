import { getProductHeroImages } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/getHomepageProducts";
import { DecorativePosters } from "./DecorativePosters";

const PRODUCTS = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/products/";

export async function DecorativeCTA() {
  // The two decorative side posters cycle through the framed hero image
  // (images[0]) of every real catalog product. Empty pool (Medusa
  // unreachable) -> each poster keeps its original static art, unchanged.
  const heroImages = await getProductHeroImages();

  return (
    <section className="relative mx-auto flex max-w-[1200px] flex-col items-center overflow-hidden px-4 py-20 sm:px-8">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative hidden w-full items-center justify-center gap-10 sm:flex">
        <DecorativePosters
          images={heroImages}
          leftFallbackSrc={PRODUCTS + "apollo-launch.png"}
          rightFallbackSrc={PRODUCTS + "stellar.png"}
        >
          <div className="z-10 text-center">
            <h2 className="mb-2 font-sans text-[30px] leading-tight text-arte-text">
              Stay hungry.
              <br />
              Stay focused.
            </h2>
            <p className="mb-6 max-w-[280px] text-[13px] text-arte-text-muted">
              Explore more inspirational posters in one place, and find the perfect print to
              surround yourself with reminders of the greater goal.
            </p>
            <button
              type="button"
              className="bg-arte-orange px-10 py-[10px] text-[13px] font-medium uppercase tracking-wide text-white"
            >
              Shop all
            </button>
          </div>
        </DecorativePosters>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center gap-6 text-center sm:hidden">
        <h2 className="font-sans text-[26px] leading-tight text-arte-text">
          Stay hungry.
          <br />
          Stay focused.
        </h2>
        <p className="max-w-[280px] text-[13px] text-arte-text-muted">
          Explore more inspirational posters in one place, and find the perfect print to
          surround yourself with reminders of the greater goal.
        </p>
        <button
          type="button"
          className="bg-arte-orange px-10 py-[10px] text-[13px] font-medium uppercase tracking-wide text-white"
        >
          Shop all
        </button>
      </div>
    </section>
  );
}
