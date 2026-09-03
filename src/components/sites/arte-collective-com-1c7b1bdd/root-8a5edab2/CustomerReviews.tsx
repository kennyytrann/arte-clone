"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Star } from "lucide-react";
import {
  CUSTOMER_REVIEWS,
  type CustomerReview,
} from "./customerReviewsData";

/**
 * Homepage "Customer Reviews" carousel (rebuilt from the reference MP4).
 *
 * A horizontal track of large white review cards: the active card is centered
 * and elevated (soft shadow); the previous / next cards peek in at the left
 * and right edges (the section clips horizontally, never the page). Cards
 * physically slide — the track's `translateX` animates. Auto-advances on a
 * calm interval, pauses on hover / focus / drag, and restarts its timer after
 * any manual navigation. Pagination dots below reflect and control the active
 * card. Touch + pointer drag to swipe; ArrowLeft / ArrowRight when the
 * carousel is focused. `prefers-reduced-motion` disables autoplay and the
 * slide transition (dots still jump between reviews).
 *
 * Review copy is demo data — see `customerReviews.ts`.
 */

const AUTOPLAY_MS = 4500;
const SLIDE_TRANSITION = "transform 550ms cubic-bezier(0.22, 1, 0.36, 1)";
const MAX_SLIDE = 560; // px — active card + its side gutters at the widest
const SLIDE_VIEWPORT_RATIO = 0.86; // slide pitch as a fraction of the viewport
const CARD_GUTTER = 24; // px — visual gap between adjacent cards
const SWIPE_THRESHOLD = 48; // px of drag before a swipe commits

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

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span
      role="img"
      aria-label={`Rated ${rating} out of 5`}
      className="flex items-center gap-[3px] text-[#2fb98a]"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          strokeWidth={0}
          fill="currentColor"
          className={i < rounded ? "opacity-100" : "opacity-25"}
          aria-hidden
        />
      ))}
    </span>
  );
}

function ReviewCard({
  review,
  active,
}: {
  review: CustomerReview;
  active: boolean;
}) {
  return (
    <article
      style={{
        // Hover expand uses the repo's premium ease-out (same curve as
        // SLIDE_TRANSITION); box-shadow keeps its original 500ms fade for the
        // active-card change. Only `transform` is animated for the scale.
        transition:
          "transform 350ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 500ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className={[
        "relative flex h-full flex-col rounded-md bg-white p-8 text-left [transform:scale(1)] [will-change:transform] sm:p-10",
        // Desktop (hover-capable pointers) only: lift the whole card to 1.03
        // and above its neighbours. No width/height/padding/margin change, so
        // the carousel layout stays put.
        "can-hover:hover:z-10 can-hover:hover:[transform:scale(1.03)]",
        active
          ? "shadow-[0_22px_55px_-18px_rgba(0,0,0,0.22)] ring-1 ring-black/[0.06]"
          : "ring-1 ring-black/[0.05]",
      ].join(" ")}
    >
      <Stars rating={review.rating} />
      <h3 className="mt-4 text-[15px] font-semibold leading-snug text-arte-text">
        {review.title}
      </h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-arte-text">
        {review.body}
      </p>
      <div className="mt-6 flex-1" />
      <p className="text-[13px] font-semibold text-arte-text">{review.name}</p>
      <p className="mt-0.5 text-[12px] text-arte-text-muted">{review.country}</p>
    </article>
  );
}

export function CustomerReviews() {
  const reviews = CUSTOMER_REVIEWS;
  const n = reviews.length;

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(0);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  // Manual navigation bumps this so the autoplay effect re-runs and the
  // interval starts fresh (no immediate jump right after a user action).
  const [manualNudge, setManualNudge] = useState(0);

  // Drag state (touch + pointer).
  const dragStartX = useRef<number | null>(null);
  const [dragDX, setDragDX] = useState(0);
  const [dragging, setDragging] = useState(false);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setViewportW(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const slide =
    viewportW > 0
      ? Math.min(MAX_SLIDE, Math.round(viewportW * SLIDE_VIEWPORT_RATIO))
      : MAX_SLIDE;

  const goTo = useCallback(
    (next: number) => {
      setActive(Math.max(0, Math.min(n - 1, next)));
      setManualNudge((v) => v + 1);
    },
    [n]
  );

  useEffect(() => {
    if (reduced || paused || dragging || n < 2) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % n),
      AUTOPLAY_MS
    );
    return () => clearInterval(id);
  }, [reduced, paused, dragging, n, manualNudge]);

  // --- drag handlers ---------------------------------------------------------
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragStartX.current = e.clientX;
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current == null) return;
    setDragDX(e.clientX - dragStartX.current);
  };
  const endDrag = () => {
    if (dragStartX.current == null) return;
    const dx = dragDX;
    dragStartX.current = null;
    setDragDX(0);
    setDragging(false);
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      goTo(active + (dx < 0 ? 1 : -1));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(active - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(active + 1);
    }
  };

  const offset =
    viewportW / 2 - slide / 2 - active * slide + (dragging ? dragDX : 0);

  return (
    <section className="overflow-hidden py-16 sm:py-20">
      <div className="mx-auto mb-10 max-w-[1200px] px-4 text-center sm:mb-12 sm:px-8">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-arte-text">
          Customer Reviews
        </h2>
      </div>

      <div
        ref={viewportRef}
        /* `overflow-x-clip` keeps the horizontal partial-card clipping while
           letting a hovered card's slight vertical scale spill into the
           section's padding instead of being cut off. */
        className="relative w-full select-none overflow-x-clip"
        role="group"
        aria-roledescription="carousel"
        aria-label="Customer reviews"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <div
          className="flex items-stretch"
          style={{
            transform: `translate3d(${offset}px, 0, 0)`,
            transition:
              reduced || dragging ? "none" : SLIDE_TRANSITION,
            visibility: viewportW ? "visible" : "hidden",
            willChange: "transform",
            touchAction: "pan-y",
          }}
        >
          {reviews.map((review, i) => (
            <div
              key={`${review.name}-${i}`}
              className="shrink-0"
              style={{ width: slide, padding: `0 ${CARD_GUTTER / 2}px` }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={i === active ? undefined : true}
            >
              <ReviewCard review={review} active={i === active} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-9 flex justify-center gap-2 sm:mt-10">
        {reviews.map((review, i) => (
          <button
            key={`dot-${review.name}-${i}`}
            type="button"
            aria-label={`Go to review ${i + 1}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={[
              "h-[7px] rounded-full transition-all duration-300",
              i === active
                ? "w-[7px] bg-arte-text"
                : "w-[7px] bg-arte-text/20 hover:bg-arte-text/40",
            ].join(" ")}
          />
        ))}
      </div>
    </section>
  );
}
