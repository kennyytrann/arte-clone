"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * The media layer of the homepage hero, turned into a slide carousel.
 *
 * It renders ONLY inside the existing hero `<section>` (which keeps its exact
 * `aspect-[4096/2329] w-full overflow-hidden bg-neutral-200` box) as an
 * `absolute inset-0` layer, so there is ZERO layout impact — the hero
 * occupies exactly the space it did as a single image, and the `<h1>` / CTA
 * overlay is untouched above it.
 *
 * Windowed 3-cell slider: at any moment only [previous, current, next] are in
 * the DOM (keyed by src so the DOM node is reused across the post-slide snap —
 * no reload, no flash). Forward = current slides left / next enters from the
 * right; backward = the mirror. Transform-only animation. After the transition
 * the track snaps back one cell with `transition: none`, which is invisible
 * because the in-view image is the same reused node at the same pixel spot.
 * The snap is driven by whichever fires first — `transitionend` or a
 * `SLIDE_MS + buffer` fallback timer — so it can never deadlock.
 *
 * Auto-advances every 4000ms (single timer, reset on every manual nav and on
 * hover-out). Arrows (desktop), pagination dots, keyboard arrows, and touch
 * swipe all drive it. `prefers-reduced-motion` disables autoplay and the
 * slide animation while keeping manual navigation fully functional.
 */

export interface HeroSlide {
  src: string;
  alt: string;
}

const AUTOPLAY_MS = 4000;
const SLIDE_MS = 600;
// The repo's shared premium ease-out (CustomerReviews / CollectionsDeck).
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const SWIPE_THRESHOLD = 45; // px

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

function canHover(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const n = slides.length;
  const reduced = useReducedMotion();

  const [active, setActive] = useState(0);
  const [move, setMove] = useState<{ target: number; dir: 1 | -1 } | null>(null);
  const [snapping, setSnapping] = useState(false);
  const [paused, setPaused] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const finalizeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const unsnapTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const moveRef = useRef<{ target: number; dir: 1 | -1 } | null>(null);
  const movingRef = useRef(false);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const goRef = useRef<(dir: 1 | -1, target?: number) => void>(() => {});

  const prevIdx = (active - 1 + n) % n;
  const nextIdx = (active + 1) % n;

  const clearAutoTimer = useCallback(() => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    autoTimerRef.current = undefined;
  }, []);

  // Commit a finished slide: adopt the target as `active` and snap the track
  // back one cell without animating. Idempotent — safe for both the
  // `transitionend` and the fallback timer to call.
  const finalizeMove = useCallback(() => {
    const m = moveRef.current;
    if (!m) return;
    moveRef.current = null;
    if (finalizeTimerRef.current) clearTimeout(finalizeTimerRef.current);
    setSnapping(true);
    setActive(m.target);
    setMove(null);
    movingRef.current = false;
    if (unsnapTimerRef.current) clearTimeout(unsnapTimerRef.current);
    unsnapTimerRef.current = setTimeout(() => setSnapping(false), 50);
  }, []);

  // One auto-advance timer. (Re)armed whenever the slide settles or
  // pause / reduced-motion changes.
  useEffect(() => {
    clearAutoTimer();
    if (paused || reduced || n < 2) return;
    autoTimerRef.current = setTimeout(() => goRef.current(1), AUTOPLAY_MS);
    return clearAutoTimer;
  }, [active, paused, reduced, n, clearAutoTimer]);

  useEffect(
    () => () => {
      clearAutoTimer();
      if (finalizeTimerRef.current) clearTimeout(finalizeTimerRef.current);
      if (unsnapTimerRef.current) clearTimeout(unsnapTimerRef.current);
    },
    [clearAutoTimer]
  );

  const go = useCallback(
    (dir: 1 | -1, target?: number) => {
      if (movingRef.current || n < 2) return;
      const dest =
        target ?? (dir === 1 ? (active + 1) % n : (active - 1 + n) % n);
      if (dest === active) return;

      clearAutoTimer(); // reset the 4s auto-advance on every navigation

      if (reduced) {
        setActive(dest);
        return;
      }
      movingRef.current = true;
      moveRef.current = { target: dest, dir };
      setMove({ target: dest, dir });
      if (finalizeTimerRef.current) clearTimeout(finalizeTimerRef.current);
      finalizeTimerRef.current = setTimeout(finalizeMove, SLIDE_MS + 80);
    },
    [active, n, reduced, clearAutoTimer, finalizeMove]
  );
  useEffect(() => {
    goRef.current = go;
  }, [go]);

  const goTo = useCallback(
    (i: number) => {
      if (i === active || movingRef.current) return;
      go(i > active ? 1 : -1, i);
    },
    [active, go]
  );

  const onTrackTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== trackRef.current || e.propertyName !== "transform") return;
    finalizeMove();
  };

  // --- pointer / touch swipe (never blocks vertical scroll) ----------------
  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  };
  const clearDrag = () => {
    dragRef.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  // Which three slides are mounted, and where the track sits.
  let cells: number[];
  let trackX: string;
  if (move) {
    cells =
      move.dir === 1
        ? [prevIdx, active, move.target]
        : [move.target, active, nextIdx];
    trackX = move.dir === 1 ? "-200%" : "0%";
  } else {
    cells = [prevIdx, active, nextIdx];
    trackX = "-100%";
  }

  const trackTransition =
    reduced || snapping ? "none" : `transform ${SLIDE_MS}ms ${EASE}`;

  return (
    <div
      className="absolute inset-0 z-10"
      style={{ touchAction: "pan-y" }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero image carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => canHover() && setPaused(true)}
      onMouseLeave={() => canHover() && setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={clearDrag}
      onPointerLeave={clearDrag}
    >
      <div
        ref={trackRef}
        className="absolute inset-0 flex h-full w-full"
        style={{
          transform: `translateX(${trackX})`,
          transition: trackTransition,
          willChange: "transform",
        }}
        onTransitionEnd={onTrackTransitionEnd}
      >
        {cells.map((idx) => (
          <div key={slides[idx].src} className="relative h-full w-full shrink-0">
            <Image
              src={slides[idx].src}
              alt={slides[idx].alt}
              fill
              sizes="100vw"
              className="object-cover"
              {...(idx === 0
                ? { priority: true }
                : { loading: "eager" as const })}
            />
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous hero image"
            onClick={() => go(-1)}
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center bg-arte-orange p-2 text-white transition-colors hover:bg-arte-orange-dark sm:flex"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next hero image"
            onClick={() => go(1)}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center bg-arte-orange p-2 text-white transition-colors hover:bg-arte-orange-dark sm:flex"
          >
            <ChevronRight size={18} />
          </button>

          <div
            className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.45))" }}
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to hero slide ${i + 1}`}
                aria-current={i === active}
                onClick={() => goTo(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === active
                    ? "bg-neutral-900"
                    : "bg-neutral-300 hover:bg-neutral-100"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
