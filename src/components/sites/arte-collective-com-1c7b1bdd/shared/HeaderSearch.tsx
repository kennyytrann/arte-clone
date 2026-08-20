"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { medusa } from "@/lib/medusa";
import { productHref } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/routes";

interface SearchResult {
  handle: string;
  title: string;
  thumbnail: string | null;
}

/**
 * Minimal live product search — the cloned header's Search icon was purely
 * decorative (no onClick, no interaction) before this. Clicking it opens a
 * small dropdown with a text input; typing queries real Medusa products via
 * the Store API's `q` parameter and lists real matches. No price is shown
 * here (would need a region-priced lookup this lightweight dropdown doesn't
 * do) — see ProductBuyBox for real pricing once a result is opened.
 */
export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!query.trim()) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      medusa.store.product
        .list({ q: query.trim(), limit: 5 })
        .then(({ products }) => {
          if (cancelled) return;
          setResults(
            products.map((p) => ({
              handle: p.handle ?? p.id,
              title: p.title,
              thumbnail: p.thumbnail ?? null,
            }))
          );
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen((v) => !v)}
        className="text-white"
      >
        {open ? <X size={18} /> : <Search size={18} />}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[280px] bg-[#2b1f1d] p-3 text-white shadow-xl">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full border border-white/30 bg-transparent px-3 py-2 text-[13px] text-white placeholder:text-white/50 focus:outline-none"
          />

          <div className="mt-2 max-h-[300px] overflow-y-auto">
            {loading ? (
              <p className="px-1 py-2 text-[12px] text-white/60">Searching…</p>
            ) : !query.trim() ? null : results.length === 0 ? (
              <p className="px-1 py-2 text-[12px] text-white/60">No products found.</p>
            ) : (
              results.map((r) => (
                <Link
                  key={r.handle}
                  href={productHref(r.handle)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-1 py-2 hover:bg-white/5"
                >
                  <span className="relative h-9 w-9 shrink-0 overflow-hidden bg-white/10">
                    {r.thumbnail ? (
                      <Image src={r.thumbnail} alt="" fill className="object-cover" />
                    ) : null}
                  </span>
                  <span className="text-[13px]">{r.title}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
