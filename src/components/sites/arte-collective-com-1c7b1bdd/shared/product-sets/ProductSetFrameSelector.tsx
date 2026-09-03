"use client";

import type { ProductSizeVariant } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/products/types";

/**
 * Product-Set-only "Select frame" selector.
 *
 * Reproduces the existing single-product frame selector (the secondary-axis
 * tab row inside `../products/VariantSelector.tsx`, lines ~194-243): same
 * axis-detection strategy, same label, same button markup and selected /
 * unselected classes, same cheapest-first ordering. Button text is the raw
 * Medusa option value ("Unframed" / "Black Metal").
 *
 * It renders nothing when the product has no Frame axis — exactly like the
 * single-product page, which only shows the frame row for real 2-option
 * (Size × Frame) Medusa products.
 *
 * Isolated in `shared/product-sets/`; the shared `VariantSelector` is NOT
 * touched.
 */

export interface FrameAxis {
  /** The real Medusa option title, e.g. "Frame". */
  title: string;
  /** Distinct option values, cheapest first, e.g. ["Unframed", "Black Metal"]. */
  values: string[];
}

/**
 * Same detection as `VariantSelector`: needs every variant to carry
 * `optionValues` and at least two distinct option titles; the non-"Size"
 * title is the frame axis.
 */
export function getFrameAxis(variants: ProductSizeVariant[]): FrameAxis | null {
  if (variants.length === 0 || !variants.every((v) => v.optionValues)) return null;

  const titles: string[] = [];
  for (const v of variants) {
    for (const t of Object.keys(v.optionValues ?? {})) {
      if (!titles.includes(t)) titles.push(t);
    }
  }
  if (titles.length < 2) return null;

  const sizeTitle = titles.find((t) => t.toLowerCase() === "size") ?? titles[0];
  const frameTitle = titles.find((t) => t !== sizeTitle);
  if (!frameTitle) return null;

  const values: string[] = [];
  const seen = new Set<string>();
  for (const v of variants) {
    const val = v.optionValues![frameTitle];
    if (val && !seen.has(val)) {
      seen.add(val);
      values.push(val);
    }
  }

  // Cheapest first (e.g. Unframed before Black Metal) — Medusa variant order
  // reflects import order, not price. Mirrors VariantSelector's frame-row sort.
  const minPriceForFrame = (frame: string) =>
    Math.min(
      ...variants
        .filter((v) => v.optionValues![frameTitle] === frame)
        .map((v) => v.price)
    );
  values.sort((a, b) => minPriceForFrame(a) - minPriceForFrame(b));

  return { title: frameTitle, values };
}

export function ProductSetFrameSelector({
  variants,
  selected,
  onSelect,
}: {
  variants: ProductSizeVariant[];
  /** Currently selected raw frame value, or null before the axis resolves. */
  selected: string | null;
  onSelect: (frameValue: string) => void;
}) {
  const axis = getFrameAxis(variants);
  if (!axis) return null;

  return (
    <div className="mb-4">
      <p className="mb-2 text-[13px] text-arte-text">
        Select {axis.title.toLowerCase()}
      </p>
      <div className="flex flex-wrap gap-2">
        {axis.values.map((value) => {
          const isSelected = selected === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              className={`border px-3 py-1.5 text-[12px] ${
                isSelected
                  ? "border-arte-orange bg-arte-orange/10 text-arte-text"
                  : "border-neutral-300 text-arte-text"
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
