"use client";

import type { ReactNode } from "react";

export function CheckoutSection({
  step,
  title,
  active,
  complete,
  summary,
  onEdit,
  children,
}: {
  step: number;
  title: string;
  active: boolean;
  complete: boolean;
  summary?: ReactNode;
  onEdit?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-[#e5e5e5] py-6 first:pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] " +
              (complete
                ? "bg-arte-text text-white"
                : active
                  ? "border border-arte-text text-arte-text"
                  : "border border-[#e5e5e5] text-arte-text-muted")
            }
          >
            {step}
          </span>
          <h2 className="text-[15px] font-semibold uppercase tracking-wide text-arte-text">
            {title}
          </h2>
        </div>
        {complete && onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="text-[12px] uppercase tracking-wide text-arte-text-muted underline underline-offset-2"
          >
            Edit
          </button>
        ) : null}
      </div>

      {complete && summary ? (
        <div className="mt-2 pl-9 text-[13px] leading-relaxed text-arte-text-muted">{summary}</div>
      ) : null}
      {active ? <div className="mt-4 pl-9">{children}</div> : null}
    </div>
  );
}
