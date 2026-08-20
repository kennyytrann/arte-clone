"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import type { ProductSizeVariant } from "./types";
import { SizeGuideModal } from "./SizeGuideModal";

/** "12x18" -> `12" x 18"`, matching the reference card style's pill format. Falls back to the raw value for anything that doesn't match (e.g. non-numeric option values), never fabricating a size. */
function formatSizeLabel(value: string): string {
  const match = /^(\d+)\s*x\s*(\d+)$/i.exec(value.trim());
  if (!match) return value;
  return `${match[1]}" x ${match[2]}"`;
}

function SizeSwatchGrid({
  options,
  selectedValue,
  onSelect,
  pillLabel,
}: {
  options: { value: string; variant: ProductSizeVariant }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  /** Optional override for the pill text below each card (defaults to variant.dimensions). The multi-axis (Size × Frame) caller passes just the size, e.g. `12" x 18"`, now that Frame is its own separate selector. */
  pillLabel?: (option: { value: string; variant: ProductSizeVariant }) => string;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => {
        const { value, variant: v } = option;
        const selected = value === selectedValue;
        const pillText = pillLabel ? pillLabel(option) : v.dimensions;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className="flex flex-col items-center gap-2 text-left"
          >
            <span
              className={`relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 border p-3 ${
                selected
                  ? "border-arte-orange bg-arte-orange/10"
                  : "border-transparent bg-neutral-100"
              }`}
            >
              {v.popular ? (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-arte-orange/15 px-2 py-[3px] text-[9px] font-medium uppercase tracking-wide text-arte-orange">
                  Popular
                </span>
              ) : null}
              <span className="h-1 w-6 rounded-full bg-neutral-300" />
              <span className="relative flex w-full flex-1 items-center justify-center overflow-hidden bg-white">
                <span
                  className={`font-accent text-[13px] italic ${
                    selected ? "text-arte-orange" : "text-arte-text-muted"
                  }`}
                >
                  {v.label}
                </span>
                <span
                  className={`absolute inset-x-3 bottom-2 top-1/2 ${
                    selected ? "bg-arte-orange/15" : "bg-neutral-200"
                  }`}
                />
              </span>
              <span className="h-1 w-8 rounded-full bg-neutral-300" />
            </span>

            <span
              className={`w-full rounded-full py-1 text-center text-[12px] ${
                selected
                  ? "bg-arte-orange text-white"
                  : "border border-neutral-300 text-arte-text"
              }`}
            >
              {pillText}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: {
  variants: ProductSizeVariant[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [guideOpen, setGuideOpen] = useState(false);

  const axisTitles = useMemo(() => {
    const titles: string[] = [];
    for (const v of variants) {
      for (const title of Object.keys(v.optionValues ?? {})) {
        if (!titles.includes(title)) titles.push(title);
      }
    }
    return titles;
  }, [variants]);

  const hasMultiAxis = axisTitles.length >= 2 && variants.every((v) => v.optionValues);

  // Single-option products (the reference catalog, or any real Medusa
  // product with just one option) keep the original flat grid unchanged.
  if (!hasMultiAxis) {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[13px] text-arte-text">
            Select size{" "}
            <span className="text-arte-text-muted">
              (unframed <Info size={11} className="inline -translate-y-px" />)
            </span>
          </p>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="text-[12px] text-arte-text underline underline-offset-2"
          >
            Size guide
          </button>
        </div>

        <SizeSwatchGrid
          options={variants.map((v) => ({ value: v.id, variant: v }))}
          selectedValue={selectedId}
          onSelect={onSelect}
        />

        {guideOpen ? (
          <SizeGuideModal variants={variants} onClose={() => setGuideOpen(false)} />
        ) : null}
      </div>
    );
  }

  // Real 2-option Medusa products (Size × Frame): resolve the exact variant
  // from the combination of both selections, rather than flattening all 6
  // variants into one "Select size" grid (which would show duplicate size
  // labels with no way to tell Unframed from Black Metal apart).
  const primaryTitle = axisTitles.find((t) => t.toLowerCase() === "size") ?? axisTitles[0];
  const secondaryTitles = axisTitles.filter((t) => t !== primaryTitle);

  const selectedVariant = variants.find((v) => v.id === selectedId) ?? variants[0];
  const selectedPrimaryValue = selectedVariant.optionValues![primaryTitle];
  const selectedSecondaryValues: Record<string, string> = {};
  secondaryTitles.forEach((t) => {
    selectedSecondaryValues[t] = selectedVariant.optionValues![t];
  });

  function resolveVariant(primaryValue: string, secondaryValues: Record<string, string>) {
    return variants.find(
      (v) =>
        v.optionValues![primaryTitle] === primaryValue &&
        secondaryTitles.every((t) => v.optionValues![t] === secondaryValues[t])
    );
  }

  const primaryValues: { value: string; variant: ProductSizeVariant }[] = [];
  const seenPrimary = new Set<string>();
  for (const v of variants) {
    const value = v.optionValues![primaryTitle];
    if (seenPrimary.has(value)) continue;
    seenPrimary.add(value);
    // Prefer the representative currently matching the active secondary
    // selection so the swatch's price/label reflects what's actually shown.
    primaryValues.push({ value, variant: resolveVariant(value, selectedSecondaryValues) ?? v });
  }
  // Order smallest to largest, left to right — real Medusa variant order
  // reflects import order, not size. Parses "WxH" values (e.g. "12x18") by
  // area; anything that doesn't match that shape (e.g. the reference
  // catalog's Small/Medium/Large) keeps its original order, unaffected.
  const sizeArea = (value: string): number | null => {
    const match = /^(\d+)\s*x\s*(\d+)$/i.exec(value.trim());
    return match ? Number(match[1]) * Number(match[2]) : null;
  };
  if (primaryValues.every((p) => sizeArea(p.value) != null)) {
    primaryValues.sort((a, b) => sizeArea(a.value)! - sizeArea(b.value)!);
  }

  const guideVariants = primaryValues.map((p) => p.variant);

  return (
    <div>
      {/* Secondary axis (Frame) renders above the primary Size grid — a
          simple compact tab row, no "Size guide" link (that stays attached
          to the Size heading below). */}
      {secondaryTitles.map((title) => {
        const values: string[] = [];
        const seen = new Set<string>();
        for (const v of variants) {
          const value = v.optionValues![title];
          if (!seen.has(value)) {
            seen.add(value);
            values.push(value);
          }
        }
        // Cheapest first (e.g. Unframed before Black Metal) — real Medusa
        // variant order reflects import order, not price. Resolved against
        // the current size/other-axis selection so the ordering always
        // matches what's actually being compared.
        values.sort((a, b) => {
          const priceA = resolveVariant(selectedPrimaryValue, { ...selectedSecondaryValues, [title]: a })?.price ?? Infinity;
          const priceB = resolveVariant(selectedPrimaryValue, { ...selectedSecondaryValues, [title]: b })?.price ?? Infinity;
          return priceA - priceB;
        });
        return (
          <div key={title} className="mb-4">
            <p className="mb-2 text-[13px] text-arte-text">Select {title.toLowerCase()}</p>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const selected = selectedSecondaryValues[title] === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      const next = resolveVariant(selectedPrimaryValue, {
                        ...selectedSecondaryValues,
                        [title]: value,
                      });
                      if (next) onSelect(next.id);
                    }}
                    className={`border px-3 py-1.5 text-[12px] ${
                      selected
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
      })}

      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] text-arte-text">
          Select {primaryTitle.toLowerCase()}
        </p>
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="text-[12px] text-arte-text underline underline-offset-2"
        >
          Size guide
        </button>
      </div>

      <SizeSwatchGrid
        options={primaryValues}
        selectedValue={selectedPrimaryValue}
        onSelect={(value) => {
          const next = resolveVariant(value, selectedSecondaryValues);
          if (next) onSelect(next.id);
        }}
        pillLabel={(option) => formatSizeLabel(option.value)}
      />

      {guideOpen ? (
        <SizeGuideModal variants={guideVariants} onClose={() => setGuideOpen(false)} />
      ) : null}
    </div>
  );
}
