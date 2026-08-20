"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import type { ProductSizeVariant } from "./types";
import { SizeGuideModal } from "./SizeGuideModal";

function SizeSwatchGrid({
  options,
  selectedValue,
  onSelect,
}: {
  options: { value: string; variant: ProductSizeVariant }[];
  selectedValue: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map(({ value, variant: v }) => {
        const selected = value === selectedValue;
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
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-arte-orange px-2 py-[3px] text-[9px] font-medium uppercase tracking-wide text-white">
                  Popular
                </span>
              ) : null}
              <span className="h-1 w-6 rounded-full bg-neutral-300" />
              <span className="relative flex w-full flex-1 items-center justify-center overflow-hidden bg-white">
                <span className="font-accent text-[13px] italic text-arte-text-muted">
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
              {v.dimensions}
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

  const guideVariants = primaryValues.map((p) => p.variant);

  return (
    <div>
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
      />

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
        return (
          <div key={title} className="mt-4">
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
                    className={`border px-4 py-2 text-[12px] ${
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

      {guideOpen ? (
        <SizeGuideModal variants={guideVariants} onClose={() => setGuideOpen(false)} />
      ) : null}
    </div>
  );
}
