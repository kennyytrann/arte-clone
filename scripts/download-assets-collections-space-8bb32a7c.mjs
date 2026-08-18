// Downloads product images and the banner image for the
// collections/space (space-8bb32a7c) page of arte-collective-com-1c7b1bdd.
//
// Usage: node scripts/download-assets-collections-space-8bb32a7c.mjs

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const OUT_DIR = path.join(
  ROOT,
  "public/sites/arte-collective-com-1c7b1bdd/collections-space-8bb32a7c"
);
const PRODUCTS_DIR = path.join(OUT_DIR, "images/products");
const THEME_DIR = path.join(OUT_DIR, "images/theme");

const PRODUCTS_JSON_URL =
  "https://arte-collective.com/collections/space/products.json?limit=250";

const BANNER_URL =
  "https://arte-collective.com/cdn/shop/files/Space_ece143b5-816c-4196-a00f-d910ff31108d.png";

function extFromUrl(url) {
  const clean = url.split("?")[0];
  const ext = path.extname(clean);
  return ext && ext.length <= 5 ? ext : ".png";
}

async function downloadOne(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buf);
  return buf.length;
}

async function pool(items, concurrency, worker) {
  const results = new Array(items.length);
  let i = 0;
  async function run() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, run));
  return results;
}

async function main() {
  await mkdir(PRODUCTS_DIR, { recursive: true });
  await mkdir(THEME_DIR, { recursive: true });

  console.log("Fetching product catalog...");
  const res = await fetch(PRODUCTS_JSON_URL);
  if (!res.ok) throw new Error(`Failed to fetch products.json: HTTP ${res.status}`);
  const data = await res.json();
  const products = data.products;
  console.log(`Found ${products.length} products.`);

  console.log("Downloading banner image...");
  await downloadOne(BANNER_URL, path.join(THEME_DIR, "space-banner.png"));

  let ok = 0;
  let failed = [];

  await pool(products, 4, async (p) => {
    const image = p.images && p.images[0];
    if (!image) {
      failed.push(p.handle + " (no image)");
      return;
    }
    const ext = extFromUrl(image.src);
    const dest = path.join(PRODUCTS_DIR, `${p.handle}${ext}`);
    try {
      const size = await downloadOne(image.src, dest);
      ok++;
      console.log(`  ok  ${p.handle}${ext}  (${(size / 1024).toFixed(0)} KB)`);
    } catch (err) {
      failed.push(`${p.handle}: ${err.message}`);
      console.error(`  FAIL ${p.handle}: ${err.message}`);
    }
  });

  console.log(`\nDone. ${ok}/${products.length} product images downloaded.`);
  if (failed.length) {
    console.log("Failures:", failed);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
