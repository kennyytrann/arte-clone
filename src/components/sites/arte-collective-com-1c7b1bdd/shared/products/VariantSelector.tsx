"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import type { ProductSizeVariant } from "./types";
import { SizeGuideModal } from "./SizeGuideModal";

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

      <div className="grid grid-cols-3 gap-2">
        {variants.map((v) => {
          const selected = v.id === selectedId;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(v.id)}
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

      {guideOpen ? (
        <SizeGuideModal variants={variants} onClose={() => setGuideOpen(false)} />
      ) : null}
    </div>
  );
}
