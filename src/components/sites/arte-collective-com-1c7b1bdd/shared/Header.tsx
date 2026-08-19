import { HeaderMenu, type HeaderCollectionLink } from "./HeaderMenu";
import { hasCollectionData } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/collections/getCollectionData";
import { collectionHref } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";

const THEME = "/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/theme/";

// `handle` prepares each entry for /collections/[handle]; only handles with
// registered collection data (live Medusa category or local reference — see
// getCollectionData.ts) resolve to a real link today. `hasCollectionData` is
// backed by a single request-memoized lookup, so checking all 9 entries here
// costs one Medusa request total, not nine.
const COLLECTION_LINKS: { label: string; handle: string; icon: string; isNew?: boolean }[] = [
  { label: "Aerospace", handle: "aerospace", icon: THEME + "Aerospatials.png" },
  { label: "Space", handle: "space", icon: THEME + "Space.png" },
  { label: "Aesthetic", handle: "aesthetic", icon: THEME + "Aesthetic.png" },
  { label: "Science", handle: "science", icon: THEME + "Science.png" },
  { label: "Historic Shots", handle: "historic-shots", icon: THEME + "History.png", isNew: true },
  { label: "Technology", handle: "technology", icon: THEME + "code-pill.png" },
  { label: "History", handle: "history", icon: THEME + "History.png" },
  { label: "Social Sciences", handle: "social-sciences", icon: THEME + "Social_Sciences.png" },
  {
    label: "Biology",
    handle: "biology",
    icon: THEME + "biology_68d6d791-caa2-4bd4-93e1-b5adc7807249.png",
  },
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
      icon: c.icon,
      isNew: c.isNew,
      href: (await hasCollectionData(c.handle)) ? collectionHref(c.handle) : undefined,
    }))
  );

  return <HeaderMenu collections={collections} />;
}
