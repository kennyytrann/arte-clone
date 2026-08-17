import Image from "next/image";
import { Star } from "lucide-react";

const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

export function Hero() {
  return (
    <>
      <section className="relative aspect-[4096/2329] w-full overflow-hidden bg-neutral-200">
        <Image
          src={THEME + "2-2af58987.png"}
          alt="Living room with a gallery wall of science posters"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-x-0 top-[84%] z-20 flex flex-col items-center px-6 text-center">
          <h1 className="font-sans text-[clamp(20px,2.8vw,40px)] leading-[1.05] text-white drop-shadow-md">
            Science you&apos;ll be
            <br />
            proud <em className="font-accent italic text-arte-orange">to display</em>
          </h1>
          <button
            type="button"
            className="mt-[2%] bg-arte-orange px-8 py-[14px] text-[clamp(12px,1.2vw,18px)] font-medium uppercase tracking-[-0.72px] text-white"
          >
            Explore all prints
          </button>
        </div>
      </section>

      <div className="flex items-center justify-center gap-2 bg-white py-4 text-arte-text">
        <Star size={14} className="fill-arte-orange text-arte-orange" />
        <span className="text-[13px]">4.86/5 +300 Reviews</span>
      </div>
    </>
  );
}
