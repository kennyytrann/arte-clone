"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface DeckCollection {
  handle: string;
  title: string;
  count: number;
  image: string;
  href: string;
}

/**
 * "Our exclusive collections" — a stacked/fanned card deck (matches the
 * reference MP4).
 *
 * One dominant front card; the rest fan out symmetrically behind it on both
 * sides (translateX + rotate + scale + a darkening wash, deeper cards further
 * out / lower z). Auto-advances like a deck cycling through — the front card
 * peels to the left stack, the right-stack neighbour becomes the new front —
 * looping seamlessly via `(i - active + n) % n` (no full-deck reset).
 *
 * Only `transform` / `opacity` animate. Respects `prefers-reduced-motion`
 * (no autoplay, no transitions — still fully usable). Hovering / focusing the
 * deck pauses autoplay; clicking a background card brings it to the front;
 * clicking the front card navigates to its collection page. Every card is a
 * single `next/link` (background clicks are `preventDefault`ed) so there are
 * never nested anchors and the element type never changes mid-animation.
 */

const AUTOPLAY_MS = 3000;
const EASE = "380ms cubic-bezier(0.22, 1, 0.36, 1)";
const TRANSFORM_ORIGIN = "50% 20%";

// index = stack depth. x is a % of card width; rot in deg; ty in px.
// `dim` = opacity of the black wash over the card (deeper = darker, so the
// deck reads as a stack regardless of how bright each collection image is).
const STEP = [
  { x: 0, rot: 0, scale: 1, ty: 0, dim: 0 },
  { x: 8.5, rot: 5, scale: 0.93, ty: 16, dim: 0.3 },
  { x: 15, rot: 10, scale: 0.86, ty: 28, dim: 0.45 },
  { x: 20, rot: 13, scale: 0.81, ty: 36, dim: 0.55 },
] as const;
const HIDDEN = { x: 23, rot: 15, scale: 0.79, ty: 40, dim: 0.6 } as const;

type Bp = "c" | "m" | "d";

function useBreakpoint(): Bp {
  const [bp, setBp] = useState<Bp>("d");
  useEffect(() => {
    const mqC = window.matchMedia("(max-width: 640px)");
    const mqM = window.matchMedia("(max-width: 1024px)");
    const update = () => setBp(mqC.matches ? "c" : mqM.matches ? "m" : "d");
    update();
    mqC.addEventListener("change", update);
    mqM.addEventListener("change", update);
    return () => {
      mqC.removeEventListener("change", update);
      mqM.removeEventListener("change", update);
    };
  }, []);
  return bp;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function CollectionsDeck({
  collections,
}: {
  collections: DeckCollection[];
}) {
  const n = collections.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const bp = useBreakpoint();
  const reduced = useReducedMotion();

  const { dims, offsetScale, tyScale, maxDepth } = useMemo(() => {
    if (bp === "c")
      return {
        dims: { w: 287, h: 372 },
        offsetScale: 0.5,
        tyScale: 0.5,
        maxDepth: 2,
      };
    if (bp === "m")
      return {
        dims: { w: 330, h: 428 },
        offsetScale: 0.78,
        tyScale: 0.85,
        maxDepth: 3,
      };
    return { dims: { w: 363, h: 470 }, offsetScale: 1, tyScale: 1, maxDepth: 3 };
  }, [bp]);

  useEffect(() => {
    if (reduced || paused || n < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reduced, paused, n]);

  const containerHeight = dims.h + Math.round(HIDDEN.ty * tyScale) + 8;

  return (
    <div
      className="relative mx-auto"
      style={{ width: dims.w, height: containerHeight }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Collections"
    >
      {collections.map((c, i) => {
        const pos = (i - active + n) % n;
        const mid = Math.floor(n / 2);
        let side = 0;
        let depth = 0;
        if (pos !== 0) {
          if (pos <= mid) {
            side = 1;
            depth = pos;
          } else {
            side = -1;
            depth = n - pos;
          }
        }
        const isActive = pos === 0;
        const hidden = depth > maxDepth;
        const g = hidden ? HIDDEN : STEP[Math.min(depth, STEP.length - 1)];

        const x = side * g.x * offsetScale;
        const rot = side * g.rot * offsetScale;
        const ty = g.ty * tyScale;

        return (
          <Link
            key={c.handle}
            href={c.href}
            aria-label={isActive ? undefined : `Show ${c.title} collection`}
            aria-hidden={hidden || undefined}
            tabIndex={hidden ? -1 : 0}
            onClick={(e) => {
              if (!isActive) {
                e.preventDefault();
                setActive(i);
              }
            }}
            className="absolute left-1/2 top-0 block overflow-hidden rounded-2xl bg-neutral-800 shadow-[0_22px_50px_-18px_rgba(0,0,0,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-arte-orange focus-visible:ring-offset-2"
            style={{
              width: dims.w,
              height: dims.h,
              transformOrigin: TRANSFORM_ORIGIN,
              transform: `translateX(-50%) translateX(${x}%) translateY(${ty}px) rotate(${rot}deg) scale(${g.scale})`,
              zIndex: hidden ? 1 : 100 - depth,
              opacity: hidden ? 0 : 1,
              pointerEvents: hidden ? "none" : undefined,
              transition: reduced
                ? "none"
                : `transform ${EASE}, opacity ${EASE}`,
              willChange: "transform",
            }}
          >
            <Image
              src={c.image}
              alt={c.title}
              fill
              sizes="380px"
              className="object-cover"
            />

            {/* depth / readability wash */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-black"
              style={{
                opacity: g.dim,
                transition: reduced ? "none" : `opacity ${EASE}`,
              }}
            />

            {isActive ? (
              <>
                <span className="absolute left-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-[12px] font-medium leading-none text-white backdrop-blur-sm">
                  {c.count}
                </span>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-4 text-left">
                  <p className="text-[18px] font-medium leading-tight text-white">
                    {c.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    Discover
                    <ArrowRight size={13} strokeWidth={2.5} />
                  </p>
                </div>
              </>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
