"use client";

import { cn } from "@/lib/utils";

const MONO = { fontFamily: "var(--font-roboto-mono), ui-monospace, monospace" };

interface FilterBarProps {
  activeFilter: "all" | "new";
  onFilterChange: (filter: "all" | "new") => void;
  allCount: number;
  newCount: number;
  onOpenFilters: () => void;
}

export function FilterBar({
  activeFilter,
  onFilterChange,
  allCount,
  newCount,
  onOpenFilters,
}: FilterBarProps) {
  return (
    <div className="mx-auto max-w-[1360px] px-4 py-[14px] sm:px-6 lg:py-4">
      <div className="flex items-center justify-between gap-[10px]">
        <div className="inline-flex items-center gap-[5px]">
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            style={MONO}
            className={cn(
              "inline-flex h-8 min-w-[65px] items-center justify-center gap-[6px] rounded-full px-[13px] text-[12px] font-medium uppercase leading-none transition-transform hover:-translate-y-px",
              activeFilter === "all"
                ? "border border-[#E8E8E8] bg-[#F9F9F9] text-[#5A5A5A]"
                : "border border-[#EEEEF0] bg-[#EEEEF0] text-[#A2A2A3]"
            )}
          >
            All
            <span className="inline-flex h-5 items-center justify-center rounded-[3px] bg-[#E2E2E2] px-[6px] text-[11px] font-medium leading-none text-[#6C6C6D]">
              {allCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange("new")}
            style={MONO}
            className={cn(
              "inline-flex h-8 min-w-[65px] items-center justify-center gap-[6px] rounded-full px-[13px] text-[12px] font-medium uppercase leading-none transition-transform hover:-translate-y-px",
              activeFilter === "new"
                ? "border border-[#E8E8E8] bg-[#F9F9F9] text-[#5A5A5A]"
                : "border border-[#EEEEF0] bg-[#EEEEF0] text-[#A2A2A3]"
            )}
          >
            New
            <span className="inline-flex h-5 items-center justify-center rounded-[3px] bg-[#E2E2E2] px-[6px] text-[11px] font-medium leading-none text-[#6C6C6D]">
              {newCount}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenFilters}
          style={MONO}
          className="inline-flex h-8 items-center justify-center gap-[6px] rounded-[4px] border border-[#E8E8E8] bg-[#F9F9F9] px-[13px] text-[12px] font-medium uppercase leading-none text-[#5A5A5A]"
        >
          Filter by
        </button>
      </div>
    </div>
  );
}
