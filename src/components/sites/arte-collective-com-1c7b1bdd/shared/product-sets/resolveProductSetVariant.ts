import type {
  ProductData,
  ProductSizeVariant,
} from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/types";
import { SET_SIZE_ORDER, type SetSize } from "./ProductSetSizeSelector";

/** `"12x18"` | `'12" x 18"'` | `" 12 X 18 "` -> `"12x18"`. */
function normalizeSize(value: string): string {
  const m = /(\d+)\s*x\s*(\d+)/i.exec(value);
  return m ? `${m[1]}x${m[2]}` : value.trim().toLowerCase();
}

/**
 * Resolves the real variant for a Product-Set selection (size + frame) against
 * ANY member product — so the SAME selection can be resolved independently for
 * `set.products[0]` and `set.products[1]`, each yielding its own product's
 * variant id.
 *
 * Matching strategy is the reliable one used by the single-product page's
 * `VariantSelector.resolveVariant()` — real Medusa option VALUES, never array
 * position:
 *   - `optionValues[Size]` normalised and compared to `size`
 *   - `optionValues[Frame]` compared to `frame`
 * Falls back to a size-only match if that exact frame value is absent, then
 * (for the option-less reference catalog only) to a `dimensions`-digit match
 * and finally position.
 */
export function resolveProductSetVariant(
  product: ProductData,
  size: SetSize,
  frame: string | null
): ProductSizeVariant | undefined {
  const variants = product.variants;
  const withOptions = variants.filter((v) => v.optionValues);

  if (withOptions.length > 0) {
    const titles = Array.from(
      new Set(withOptions.flatMap((v) => Object.keys(v.optionValues!)))
    );
    const sizeTitle = titles.find((t) => t.toLowerCase() === "size") ?? titles[0];
    const frameTitle = titles.find((t) => t !== sizeTitle);

    const matchesSize = (v: ProductSizeVariant) =>
      normalizeSize(v.optionValues![sizeTitle] ?? "") === size;
    const matchesFrame = (v: ProductSizeVariant) =>
      !frameTitle || frame == null || v.optionValues![frameTitle] === frame;

    const exact = withOptions.find((v) => matchesSize(v) && matchesFrame(v));
    if (exact) return exact;
    const sizeOnly = withOptions.find(matchesSize);
    if (sizeOnly) return sizeOnly;
  }

  const digits = size.replace("x", "");
  return (
    variants.find((v) => v.dimensions.replace(/\D/g, "") === digits) ??
    variants[SET_SIZE_ORDER.indexOf(size)] ??
    variants[0]
  );
}
