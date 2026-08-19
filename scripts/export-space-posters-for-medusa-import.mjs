#!/usr/bin/env node
// Transforms the cloned Space collection's reference data
// (src/components/sites/arte-collective-com-1c7b1bdd/collections-space-8bb32a7c/data/products.ts)
// into a normalized, version-controlled import format consumable by the
// Medusa backend's import-space-posters.ts script.
//
// Source data only has ONE price point per product (the smallest/default
// size, matching the live site's collection-grid teaser price) — there is
// no per-product Medium/Large tier pricing anywhere in the clone. The one
// product we DO have full 3-tier data for (Saturn V - Beige, scraped
// directly from its own live product page) showed a uniform ladder:
//   Small = base, Medium = base + $10, Large = base + $20
//   compareAt: 56 / 70 / 84 (an exact 30%-off pattern at every tier)
// 129 of 131 Space products share Saturn V's exact base price/compareAt
// signature ($39 / $56), so the ladder is applied ONLY to that group as an
// explicit, data-supported transformation rule. The 2 products that don't
// match the signature are excluded and flagged rather than guessed at.
//
// Run: node scripts/export-space-posters-for-medusa-import.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const SOURCE_FILE = path.join(
  REPO_ROOT,
  "src/components/sites/arte-collective-com-1c7b1bdd/collections-space-8bb32a7c/data/products.ts"
);
const IMAGE_DIR = path.join(
  REPO_ROOT,
  "public/sites/arte-collective-com-1c7b1bdd/collections-space-8bb32a7c/images/products"
);

// The one fully-verified, live-scraped pricing ladder (Saturn V - Beige).
const PROVEN_LADDER = {
  baseSignature: { price: 39, compareAtPrice: 56 },
  variants: [
    { optionValue: "Small", priceUsd: 39, compareAtPriceUsd: 56 },
    { optionValue: "Medium", priceUsd: 49, compareAtPriceUsd: 70 },
    { optionValue: "Large", priceUsd: 59, compareAtPriceUsd: 84 },
  ],
};

const OUTPUT_FILE = path.resolve(
  REPO_ROOT,
  "../medusa-backend/apps/backend/src/migration-scripts/data/space-posters.generated.json"
);

const source = readFileSync(SOURCE_FILE, "utf-8");

// Each product is a uniform object literal:
// { handle: "...", title: "...", price: N, compareAtPrice: N, image: IMG + "file.png", badges: [...] }
const PRODUCT_RE =
  /{\s*handle:\s*"([^"]+)",\s*title:\s*"((?:[^"\\]|\\.)*)",\s*price:\s*(\d+),\s*compareAtPrice:\s*(\d+),\s*image:\s*IMG \+ "([^"]+)",\s*badges:\s*(\[[^\]]*\]),?\s*}/g;

const products = [];
let match;
while ((match = PRODUCT_RE.exec(source)) !== null) {
  const [, handle, title, price, compareAtPrice, imageFile, badgesRaw] = match;
  products.push({
    handle,
    title: title.replace(/\\"/g, '"'),
    price: Number(price),
    compareAtPrice: Number(compareAtPrice),
    imageFile,
    badges: JSON.parse(badgesRaw.replace(/'/g, '"')),
  });
}

if (products.length === 0) {
  throw new Error(
    `No products matched in ${SOURCE_FILE} — the source file's format may have changed; update PRODUCT_RE.`
  );
}

const imported = [];
const excluded = [];

for (const p of products) {
  const matchesProvenSignature =
    p.price === PROVEN_LADDER.baseSignature.price &&
    p.compareAtPrice === PROVEN_LADDER.baseSignature.compareAtPrice;

  if (!matchesProvenSignature) {
    excluded.push({
      handle: p.handle,
      title: p.title,
      reason: `price/compareAtPrice (${p.price}/${p.compareAtPrice}) does not match the proven ladder's base signature (${PROVEN_LADDER.baseSignature.price}/${PROVEN_LADDER.baseSignature.compareAtPrice}) — needs real per-tier pricing before it can be imported safely.`,
    });
    continue;
  }

  imported.push({
    title: p.title,
    handle: p.handle,
    description: null,
    categoryHandle: "space",
    images: [path.join(IMAGE_DIR, p.imageFile)],
    variants: PROVEN_LADDER.variants.map((v) => ({
      optionValue: v.optionValue,
      sku: `${p.handle.toUpperCase()}-${v.optionValue.toUpperCase()}`,
      priceUsd: v.priceUsd,
      compareAtPriceUsd: v.compareAtPriceUsd,
    })),
    metadata: {
      badges: p.badges,
      pricingSource: "derived-from-saturn-v-ladder",
    },
  });
}

mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
writeFileSync(
  OUTPUT_FILE,
  JSON.stringify({ generatedAt: new Date().toISOString(), imported, excluded }, null, 2)
);

console.log(`Parsed ${products.length} source products.`);
console.log(`Ready to import: ${imported.length}`);
console.log(`Excluded (incomplete pricing data): ${excluded.length}`);
excluded.forEach((e) => console.log(`  - ${e.handle}: ${e.reason}`));
console.log(`Wrote ${OUTPUT_FILE}`);
