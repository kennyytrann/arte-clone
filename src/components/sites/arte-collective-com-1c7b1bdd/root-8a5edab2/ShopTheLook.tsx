import Image from "next/image";
import Link from "next/link";
import {
  productCardDetailsClass,
  productCardImageClass,
  productCardImageOverlayClass,
} from "@/components/sites/arte-collective-com-1c7b1bdd/shared/productCardHover";
import { getProductSetListing } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/product-sets/getProductSetData";

const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

/**
 * The two paired room shots for "Shop the look".
 *
 * - `count` drives the number badge on the "See the full set" button.
 * - `setHandle`: when set, BOTH the large image and the "See the full set"
 *   pill link to `/sets/<handle>` (two sibling `next/link`s sharing one href —
 *   no nested anchors), and `getProductSetListing` supplies the title + price.
 *   When `null` the card has no Product Set yet: the image is not clickable,
 *   the pill stays non-interactive, and only `fallbackTitle` (a placeholder)
 *   is shown, with no price.
 * - The large image gets the EXACT normal `ProductCard` hover treatment —
 *   `productCardImageClass` (the `brightness/saturate/grayscale` filter) plus
 *   the `productCardImageOverlayClass` `#71717a` wash — and the title/price
 *   get `productCardDetailsClass`. The "See the full set" pill has NO hover
 *   treatment of its own. `ProductCard` itself is not touched.
 */
const looks: {
  image: string;
  alt: string;
  count: number;
  setHandle: string | null;
  fallbackTitle: string;
}[] = [
  {
    image: THEME + "shop-the-look-1.png",
    alt: "Toyota Supra poster pair hanging in a dark, moody living room",
    count: 2,
    setHandle: "toyota-supra-mkiv-tokyo-nights-2-print-set",
    fallbackTitle: "Toyota Supra MKIV Tokyo Nights – 2 Print Set",
  },
  {
    image: THEME + "shop-the-look-2.png",
    alt: "Automotive poster pair hanging in a bright, modern office",
    count: 2,
    // No Product Set exists for this card yet — image not clickable,
    // placeholder title, no price.
    setHandle: null,
    fallbackTitle: "Automotive 2 Print Set",
  },
];

// The "See the full set" pill. No hover treatment of its own — it stays
// visually unchanged while the card / image is hovered.
const pillClass =
  "absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md bg-black/80 px-4 py-2";

export async function ShopTheLook() {
  const cards = await Promise.all(
    looks.map(async (look) => {
      const listing = look.setHandle
        ? await getProductSetListing(look.setHandle)
        : undefined;
      return {
        ...look,
        title: listing?.title ?? look.fallbackTitle,
        price: listing?.price ?? null,
        compareAtPrice: listing?.compareAtPrice ?? null,
        href: look.setHandle ? `/sets/${look.setHandle}` : null,
      };
    })
  );

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
        {cards.map((card, i) => {
          const pillContent = (
            <>
              <span className="text-[10px] font-medium uppercase tracking-wide text-white">
                See the full set
              </span>
              <span className="rounded-[3px] border border-white/40 px-1 text-[10px] leading-none text-white">
                {card.count}
              </span>
            </>
          );
          const hasDiscount =
            card.compareAtPrice != null &&
            card.price != null &&
            card.compareAtPrice > card.price;

          return (
            // `group` scopes the shared ProductCard hover effect (image
            // gray/dim + title/price float). No layout change.
            <div key={i} className="group">
              {/* Image box — unchanged classes/aspect/radius. */}
              <div className="relative aspect-[7/6] overflow-hidden rounded-lg bg-neutral-200">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={productCardImageClass}
                />
                {/* Exact ProductCard gray wash. `pointer-events-none`; sits
                    below the links so the pill is never tinted. */}
                <span aria-hidden className={productCardImageOverlayClass} />

                {/* Full-bleed image link. Sibling of the pill link below (not
                    nested) — both share `card.href`. Sits above the image but
                    below the later-in-DOM pill, so the pill keeps its own
                    click target. Invisible: no background, no hover effect. */}
                {card.href ? (
                  <Link
                    href={card.href}
                    aria-label={`View ${card.title}`}
                    className="absolute inset-0"
                  />
                ) : null}

                {card.href ? (
                  <Link href={card.href} className={pillClass}>
                    {pillContent}
                  </Link>
                ) : (
                  <div className={pillClass}>{pillContent}</div>
                )}
              </div>

              {/* Title + price — SAME markup + classes as ProductCard's info
                  block: title stays put, price floats up + fades on hover. */}
              <div className="px-1 py-3">
                <p className="truncate text-[13px] text-arte-text">
                  {card.title}
                </p>
                {card.price != null ? (
                  <p className={`mt-1 text-[13px] ${productCardDetailsClass}`}>
                    {hasDiscount ? (
                      <span className="mr-2 text-arte-text-muted line-through">
                        ${card.compareAtPrice!.toFixed(0)}
                      </span>
                    ) : null}
                    <span className="font-medium text-arte-orange">
                      ${card.price.toFixed(0)}
                    </span>
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
