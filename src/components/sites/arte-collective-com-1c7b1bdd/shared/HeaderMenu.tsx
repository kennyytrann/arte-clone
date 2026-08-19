"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { staticRoutes } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";
import { useCart } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/CartProvider";

export interface HeaderCollectionLink {
  label: string;
  icon: string;
  isNew?: boolean;
  /** Precomputed by the server Header wrapper — undefined means not linkable yet. */
  href?: string;
}

/**
 * The interactive shell (hamburger menu state, drawer) for the site header.
 * Data (which collection links currently resolve) is fetched server-side by
 * `Header.tsx` and passed in as `collections`, since this component runs on
 * the client and cannot call Medusa-backed loaders itself.
 */
export function HeaderMenu({ collections }: { collections: HeaderCollectionLink[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalQuantity } = useCart();

  return (
    <header className="absolute inset-x-0 top-0 z-40 mt-[33px]">
      <div className="flex h-[54px] items-center justify-between bg-[#252122]/50 px-4 sm:px-6">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="flex flex-col gap-[5px]"
        >
          <span className="block h-[2px] w-[22px] bg-white" />
          <span className="block h-[2px] w-[22px] bg-white" />
          <span className="block h-[2px] w-[22px] bg-white" />
        </button>

        <Link href={staticRoutes.home} className="font-sans text-[22px] tracking-tight text-white">
          arte<span className="text-arte-orange">.</span>
        </Link>

        <div className="flex items-center gap-4">
          <Search size={18} className="text-white" />
          <Link href={staticRoutes.cart} className="text-[13px] text-white">
            ({totalQuantity})&nbsp;CART
          </Link>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex h-full w-[260px] flex-col bg-[#2b1f1d] px-5 py-5 text-white">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-white/70">
                Menu
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-white/70"
              >
                <X size={14} /> Close
              </button>
            </div>

            <div className="mb-6 flex gap-2">
              {["See All", "Frame Only", "Gift Cards"].map((label) => (
                <div key={label} className="flex-1 text-center">
                  <div className="mb-1 aspect-square w-full bg-white/10" />
                  <p className="text-[10px] text-white/80">{label}</p>
                </div>
              ))}
            </div>

            <p className="mb-3 text-[11px] uppercase tracking-widest text-white/50">
              Collections
            </p>
            <ul className="flex flex-1 flex-col gap-3 overflow-y-auto">
              {collections.map((c) => {
                const itemContent = (
                  <>
                    <span className="relative block h-6 w-6 shrink-0 overflow-hidden rounded-full bg-white/10">
                      <Image src={c.icon} alt="" fill className="object-cover" />
                    </span>
                    <span className="text-[14px]">{c.label}</span>
                    {c.isNew ? (
                      <span className="ml-auto bg-arte-orange px-[6px] py-[2px] text-[9px] font-medium uppercase text-white">
                        New
                      </span>
                    ) : null}
                  </>
                );

                return (
                  <li key={c.label} className="flex items-center gap-3">
                    {c.href ? (
                      <Link
                        href={c.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex flex-1 items-center gap-3"
                      >
                        {itemContent}
                      </Link>
                    ) : (
                      itemContent
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-white/70">
              <span>Arte Collective</span>
              <span>Instagram / Tiktok</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="flex-1 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
        </div>
      ) : null}
    </header>
  );
}
