import Image from "next/image";

const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

const logos = [
  { name: "Blue Origin", src: THEME + "Blue_origin.svg", w: 130 },
  { name: "National Geographic", src: THEME + "National_geo.svg", w: 110 },
  { name: "NASA", src: THEME + "Nasa.svg", w: 60 },
  { name: "SpaceX", src: THEME + "Space_x.svg", w: 110 },
  { name: "ESA", src: THEME + "Esa.svg", w: 60 },
  { name: "Nature", src: THEME + "NAture.svg", w: 90 },
  { name: "BBC Earth", src: THEME + "BBC_earth.svg", w: 90 },
  { name: "JAXA", src: THEME + "jaxa.svg", w: 40 },
];

export function LogoStrip() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-8">
      <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-widest text-arte-text-muted">
        Inspired by
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-60 grayscale">
        {logos.map((logo) => (
          <span key={logo.name} className="relative h-6" style={{ width: logo.w }}>
            <Image src={logo.src} alt={logo.name} fill className="object-contain" />
          </span>
        ))}
      </div>
    </section>
  );
}
