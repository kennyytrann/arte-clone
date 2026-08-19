import { cache } from "react";
import { medusa, isMedusaConfigured } from "./medusa";

export interface RegionContext {
  regionId: string;
  currencyCode: string;
  countryCode?: string;
  /** False when no region serves "us" and we fell back to the first available region. */
  isUsRegion: boolean;
}

/**
 * Resolves the region to price products in. Prefers a region that serves the
 * US; if none exists (as in a fresh Medusa install, which only seeds a
 * Europe/EUR region), falls back to the first available region and flags
 * `isUsRegion: false` so callers/report can surface the real currency
 * instead of silently mislabeling prices as USD.
 *
 * Memoized per-request via React `cache()` so every product/collection card
 * on a page shares one region lookup instead of issuing its own.
 */
export const getRegionContext = cache(async (): Promise<RegionContext | null> => {
  if (!isMedusaConfigured) return null;

  try {
    const { regions } = await medusa.store.region.list({
      fields: "id,currency_code,*countries",
    });

    if (!regions.length) return null;

    const usRegion = regions.find((r) => r.countries?.some((c) => c.iso_2 === "us"));
    const region = usRegion ?? regions[0];
    const countryCode = usRegion ? "us" : region.countries?.[0]?.iso_2;

    return {
      regionId: region.id,
      currencyCode: region.currency_code,
      countryCode,
      isUsRegion: Boolean(usRegion),
    };
  } catch (error) {
    console.error("[medusa-region] Failed to resolve a region:", error);
    return null;
  }
});
