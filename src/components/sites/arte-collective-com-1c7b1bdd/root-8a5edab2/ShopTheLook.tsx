import Image from "next/image";

const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

/**
 * The two paired room shots for "Shop the look".
 *
 * - `count` drives the number badge on the "See the full set" button. Set to 2
 *   for both for now — change it here.
 * - `href` is intentionally `null`: the two set destinations don't exist yet, so
 *   the cards render non-interactive, exactly like the previous four-card
 *   version (which also had no links). When the collections are defined, give
 *   each a real path and wrap the card in `next/link`.
 */
const looks: {
  image: string;
  alt: string;
  count: number;
  href: string | null;
}[] = [
  {
    image: THEME + "shop-the-look-1.png",
    alt: "Toyota Supra poster pair hanging in a dark, moody living room",
    count: 2,
    href: null,
  },
  {
    image: THEME + "shop-the-look-2.png",
    alt: "Automotive poster pair hanging in a bright, modern office",
    count: 2,
    href: null,
  },
];

export function ShopTheLook() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-8">
      <div className="mb-8 text-center">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-arte-text-muted">
          Curated sets
        </p>
        <h2 className="font-sans text-[28px] leading-tight text-arte-text sm:text-[34px]">
          Shop the <em className="font-accent italic text-arte-orange">look</em>
        </h2>
        <p className="mt-2 text-[13px] text-arte-text-muted">
          A perfectly matched set to elevate your space
        </p>
      </div>

      {/* 4 portrait cards -> 2 large landscape cards. Stacks on phones,
          side-by-side from tablet (md) up. */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {looks.map((look, i) => (
          <div
            key={i}
            className="relative aspect-[7/6] overflow-hidden rounded-lg bg-neutral-200"
          >
            <Image
              src={look.image}
              alt={look.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md bg-black/80 px-4 py-2">
              <span className="text-[10px] font-medium uppercase tracking-wide text-white">
                See the full set
              </span>
              <span className="rounded-[3px] border border-white/40 px-1 text-[10px] leading-none text-white">
                {look.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
