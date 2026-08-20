import { HeaderMenu, type HeaderCollectionLink } from "./HeaderMenu";
import { hasCollectionData } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/collections/getCollectionData";
import { collectionHref } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";

// The real Invasive Frames storefront taxonomy (see the Wix migration
// report). Replaces the cloned Arte Collective space/science categories,
// which no longer represent real navigable commerce data now that the real
// catalog exists. `handle` prepares each entry for /collections/[handle];
// `hasCollectionData` (a single request-memoized lookup, so checking all 7
// entries here costs one Medusa request total, not seven) decides whether
// it currently resolves to a real link. No icon asset exists for this
// taxonomy — HeaderMenu hides the icon slot rather than showing a
// fabricated image (see its `icon?` type).
const COLLECTION_LINKS: { label: string; handle: string }[] = [
  { label: "Ferrari", handle: "ferrari" },
  { label: "Porsche", handle: "porsche" },
  { label: "Japanese Legends", handle: "japanese-legends" },
  { label: "European Exotics", handle: "european-exotics" },
  { label: "Formula 1", handle: "formula-1" },
  { label: "Motorsport", handle: "motorsport" },
  { label: "Automotive Art", handle: "automotive-art" },
];

/**
 * Server Component wrapper: resolves which collection links currently exist
 * (Medusa or reference) and hands the result to the interactive client
 * shell. This split exists so `HeaderMenu` (which needs client-side state
 * for the drawer) never has to call an async Medusa-backed loader itself.
 */
export async function Header() {
  const collections: HeaderCollectionLink[] = await Promise.all(
    COLLECTION_LINKS.map(async (c) => ({
      label: c.label,
      href: (await hasCollectionData(c.handle)) ? collectionHref(c.handle) : undefined,
    }))
  );

  return <HeaderMenu collections={collections} />;
}
