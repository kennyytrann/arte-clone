import { Star } from "lucide-react";
import { HeroCarousel, type HeroSlide } from "./HeroCarousel";

const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

// Supplied hero images, in the exact provided order. Index 0 is the initial
// slide. Only the media layer of the hero is a carousel now — the section box
// and the <h1> / CTA overlay below are unchanged.
const HERO_SLIDES: HeroSlide[] = [
  { src: THEME + "hero-01.png", alt: "Neon watch-shield poster in a dark games room with a DeLorean" },
  { src: THEME + "hero-02.png", alt: "Gold 'Explore' world-map poster in a luxury living room" },
  { src: THEME + "hero-03.png", alt: "'Invest' typographic collage poster in a modern office" },
  { src: THEME + "hero-04.png", alt: "Motivational periodic-table posters along a staircase" },
  { src: THEME + "hero-05.png", alt: "Colourful splattered lightbulb poster in a city apartment" },
  { src: THEME + "hero-06.png", alt: "Pop-art Tupac portrait poster in a penthouse living room" },
  { src: THEME + "hero-07.png", alt: "Art-deco arches poster above a tufted sofa" },
  { src: THEME + "hero-08.png", alt: "Pink peony floral poster in a sunset living room" },
  { src: THEME + "hero-09.png", alt: "Dollar-bill paper-plane poster in a wood-panelled office" },
  { src: THEME + "hero-10.png", alt: "Astronaut chimpanzee poster in a night-view living room" },
  { src: THEME + "hero-11.png", alt: "'Supreme' ice-cream cone poster in a dark kitchen" },
  { src: THEME + "hero-12.png", alt: "'Supreme' ice-cream cone poster in a bright kitchen" },
  { src: THEME + "hero-13.png", alt: "'American Success' black-card poster in a snowy-view living room" },
  { src: THEME + "hero-14.png", alt: "Hundred-dollar-bill poster above a white sectional sofa" },
  { src: THEME + "hero-15.png", alt: "'American Success' black-card poster by a fireplace at night" },
  { src: THEME + "hero-16.png", alt: "Expressive Martin Luther King Jr. portrait poster in an office" },
];

export function Hero() {
  return (
    <>
      <section className="relative aspect-[4096/2329] w-full overflow-hidden bg-neutral-200">
        <HeroCarousel slides={HERO_SLIDES} />

        {/*
          Bottom-anchored via flex (inset-0 + justify-end) with a CAPPED
          clamp() bottom offset, instead of the old `top-[84%]` + `mt-[2%]`.
          Those two were both viewport-width-relative with no ceiling, so on
          wide/ultrawide screens (where the aspect-ratio'd section is
          proportionally taller) the growing top-offset + growing margin
          pushed the button below the visible section and into/under the
          carousel's pagination dots. Anchoring from the bottom with a
          bounded offset keeps the CTA's distance from the section's bottom
          edge — and therefore its clearance above the dots — constant past
          a given width, instead of drifting with height.
          `pointer-events-none` (with `pointer-events-auto` back on the
          button) keeps this full-height overlay from covering the
          carousel's arrows/dots/swipe region above the CTA text.
        */}
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-end px-6 pb-[clamp(56px,6vw,64px)] text-center">
          <h1 className="font-sans text-[clamp(20px,2.8vw,40px)] leading-[1.05] text-white drop-shadow-md">
            Inspiration you&apos;ll be
            <br />
            proud <em className="font-accent italic text-arte-orange">to display</em>
          </h1>
          <button
            type="button"
            className="pointer-events-auto mt-[clamp(10px,2vw,24px)] bg-arte-orange px-8 py-[14px] text-[clamp(12px,1.2vw,18px)] font-medium uppercase tracking-[-0.72px] text-white"
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
