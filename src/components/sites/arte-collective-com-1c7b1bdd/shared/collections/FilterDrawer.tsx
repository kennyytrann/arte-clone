"use client";

import { X } from "lucide-react";

const SIZES = ['12" x 18"', '20" x 30"', '24" x 36"'];
const PRICES = ["$39", "$49", "$59"];

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  inStockCount: number;
}

export function FilterDrawer({ open, onClose, inStockCount }: FilterDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close filters overlay"
        className="flex-1 bg-black/40"
        onClick={onClose}
      />
      <div className="flex h-full w-[320px] max-w-full flex-col overflow-y-auto bg-white px-5 py-5 sm:w-[390px]">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-[13px] font-medium uppercase tracking-widest text-arte-text">
            Filter by
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-arte-text-muted"
          >
            <X size={14} /> Close
          </button>
        </div>

        <FacetGroup title="Size">
          {SIZES.map((size) => (
            <label key={size} className="flex items-center gap-2 py-1 text-[13px] text-arte-text">
              <input type="checkbox" className="accent-arte-orange" />
              {size}
            </label>
          ))}
        </FacetGroup>

        <FacetGroup title="Price">
          {PRICES.map((price) => (
            <label key={price} className="flex items-center gap-2 py-1 text-[13px] text-arte-text">
              <input type="checkbox" className="accent-arte-orange" />
              {price}
            </label>
          ))}
        </FacetGroup>

        <FacetGroup title="Availability">
          <label className="flex items-center gap-2 py-1 text-[13px] text-arte-text-muted">
            <input type="checkbox" checked disabled className="accent-arte-orange" />
            In stock ({inStockCount})
          </label>
        </FacetGroup>

        <div className="mt-auto flex gap-2 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-arte-text/20 py-3 text-[12px] font-medium uppercase tracking-wide text-arte-text"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-arte-orange py-3 text-[12px] font-medium uppercase tracking-wide text-white"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 border-b border-arte-text/10 pb-5">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-arte-text-muted">
        {title}
      </p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
