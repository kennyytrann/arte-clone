import { getCollectionData } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/collections/getCollectionData";
import { collectionHref } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";
import { CollectionsDeck, type DeckCollection } from "./CollectionsDeck";

/**
 * Homepage "Our exclusive collections" section.
 *
 * Server component: resolves a curated set of REAL storefront collections and
 * hands them to the client `CollectionsDeck` (the animated stacked-card deck
 * built from the reference MP4).
 *
 * Medusa product categories carry no dedicated hero image, so each card's art
 * is the collection's first product thumbnail (real catalog imagery). If a
 * handle doesn't resolve or has no usable image it is simply skipped.
 */
const COLLECTION_HANDLES = [
  "japanese-legends",
  "automotive-art",
  "ferrari",
  "porsche",
  "formula-1",
];

export async function CollectionsStack() {
  const resolved = await Promise.all(
    COLLECTION_HANDLES.map((handle) => getCollectionData(handle))
  );

  const collections: DeckCollection[] = resolved.flatMap((c): DeckCollection[] => {
    if (!c) return [];
    const image =
      c.heroImage ?? c.products.find((p) => p.image)?.image ?? null;
    if (!image) return [];
    return [
      {
        handle: c.handle,
        title: c.title,
        count: c.products.length,
        image,
        href: collectionHref(c.handle),
      },
    ];
  });

  if (collections.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1200px] overflow-hidden px-4 py-16 text-center sm:px-8">
      <span className="inline-block rounded-full border border-[#e5e5e5] bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-arte-text-muted">
        Explore more
      </span>
      <h2 className="mb-9 mt-4 font-sans text-[30px] leading-tight text-arte-text sm:text-[38px]">
        Our exclusive{" "}
        <em className="font-accent italic text-arte-orange">collections</em>
      </h2>

      <CollectionsDeck collections={collections} />
    </section>
  );
}
