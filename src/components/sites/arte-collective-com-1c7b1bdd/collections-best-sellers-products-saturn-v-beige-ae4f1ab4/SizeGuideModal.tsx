"use client";

import { X } from "lucide-react";
import type { SizeVariant } from "./data";

export function SizeGuideModal({
  variants,
  onClose,
}: {
  variants: SizeVariant[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[360px] bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-arte-text"
        >
          <X size={14} />
        </button>

        <h3 className="mb-4 text-[18px] font-medium text-arte-text">Size guide</h3>

        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {variants.map((v) => (
            <div key={v.id} className="flex items-center justify-between py-3 text-[13px]">
              <span className="capitalize text-arte-text">{v.label}</span>
              <span className="text-arte-text-muted">{v.dimensions}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[11px] text-arte-text-muted">
          All prints are unframed and ship rolled in a protective tube.
        </p>
      </div>
    </div>
  );
}
