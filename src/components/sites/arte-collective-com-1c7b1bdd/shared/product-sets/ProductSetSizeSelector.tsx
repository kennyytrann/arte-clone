"use client";

import Image from "next/image";

/**
 * Product-Set-only size selector. Isolated in `shared/product-sets/` — the
 * normal product page keeps using `../products/VariantSelector.tsx`, which is
 * NOT touched.
 *
 * 3 fixed size options, each = a large size-reference image card + a pill
 * button beneath it. Selection is controlled by the parent
 * (`ProductSetBuyBox`) via `selected` / `onSelect`. This will later drive
 * variant resolution for BOTH products in a set; for now it only owns the
 * size choice.
 */

const ASSET = "/sites/arte-collective-com-1c7b1bdd/shared/product-sets/images/";

export type SetSize = "12x18" | "20x30" | "24x36";

/** Canonical order, also used as an index fallback when matching variants. */
export const SET_SIZE_ORDER: SetSize[] = ["12x18", "20x30", "24x36"];

interface SizeOption {
  value: SetSize;
  /** Accessible label for the image card. */
  label: string;
  /** Visible pill-button text. */
  buttonLabel: string;
  image: string;
}

const OPTIONS: SizeOption[] = [
  {
    value: "12x18",
    label: '12" × 18"',
    buttonLabel: '2 × 12" × 18" PRINTS',
    image: ASSET + "set-size-12x18.png",
  },
  {
    value: "20x30",
    label: '20" × 30"',
    buttonLabel: '2 × 20" × 30" PRINTS',
    image: ASSET + "set-size-20x30.png",
  },
  {
    value: "24x36",
    label: '24" × 36"',
    buttonLabel: '2 × 24" × 36" PRINTS',
    image: ASSET + "set-size-24x36.png",
  },
];

export function ProductSetSizeSelector({
  selected,
  onSelect,
}: {
  selected: SetSize;
  onSelect: (size: SetSize) => void;
}) {
  return (
    <div className="mb-5">
      <p className="mb-3 text-[13px] font-medium uppercase tracking-wide text-arte-text">
        Select size
      </p>

      {/* Stacks on phones so the dimension graphics stay readable; 3 equal
          columns from sm up. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {OPTIONS.map((opt) => {
          const isSelected = opt.value === selected;
          return (
            <div key={opt.value} className="flex flex-col">
              <button
                type="button"
                aria-pressed={isSelected}
                aria-label={opt.label}
                onClick={() => onSelect(opt.value)}
                className={`relative aspect-[5/6] w-full overflow-hidden rounded-lg border-2 bg-white transition-colors ${
                  isSelected
                    ? "border-arte-orange"
                    : "border-[#e5e5e5] hover:border-arte-text/30"
                }`}
              >
                <Image
                  src={opt.image}
                  alt={`${opt.label} size reference`}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 22vw, 90vw"
                  className="object-cover"
                />
              </button>

              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(opt.value)}
                className={`mt-2 rounded-full border px-2 py-2 text-center text-[11px] font-medium leading-tight transition-colors ${
                  isSelected
                    ? "border-arte-orange bg-arte-orange text-white"
                    : "border-[#d8d8d8] bg-white text-arte-text hover:border-arte-text/40"
                }`}
              >
                {opt.buttonLabel}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
