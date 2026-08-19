import Medusa from "@medusajs/js-sdk";

const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

/**
 * Whether both required env vars are present. Data loaders check this
 * before calling the SDK so a missing/misconfigured backend degrades to
 * reference/fallback data instead of throwing.
 */
export const isMedusaConfigured = Boolean(backendUrl && publishableKey);

if (!backendUrl) {
  console.warn(
    "[medusa] NEXT_PUBLIC_MEDUSA_BACKEND_URL is not set — Medusa-backed data will fall back to reference/local data."
  );
}
if (backendUrl && !publishableKey) {
  console.warn(
    "[medusa] NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is not set — Store API requests will be rejected. Falling back to reference/local data."
  );
}

/**
 * Single centralized Medusa JS SDK instance for the whole app. Every data
 * loader (getProductData, getCollectionData) imports this rather than
 * constructing its own client.
 */
export const medusa = new Medusa({
  baseUrl: backendUrl || "http://localhost:9000",
  publishableKey,
});
