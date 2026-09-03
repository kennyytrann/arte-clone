"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";

/**
 * The two decorative side posters for `DecorativeCTA`.
 *
 * Each poster crossfades through the framed product hero images (images[0] of
 * every catalog product — never a secondary gallery shot). A SINGLE shared
 * interval drives both: it fires every 2.5s and alternates which side
 * advances, so each poster changes every 5s and the left / right swaps are
 * always 2.5s apart — they can never fade at the same moment.
 *
 * The frame wrappers (size / rotation / shadow / position) are the exact
 * class strings from the original `DecorativeCTA` and are not touched here —
 * only the artwork inside changes. The centre text/button is passed through
 * as `children` and rendered between the two posters, unchanged.
 *
 * Perf: each poster keeps exactly two <Image> layers in the DOM; the hidden
 * one always holds the NEXT image, preloaded a full cycle ahead, so a
 * fade-in never shows a loading flash. The outgoing layer keeps its image
 * until it has finished fading out.
 *
 * `prefers-reduced-motion`, or fewer than 2 images: no interval, no fade —
 * a single static image. No product images at all (Medusa unreachable):
 * the original static `fallbackSrc`, unchanged.
 */

const FADE_MS = 600;
const HALF_CYCLE_MS = 2500; // each side advances every other tick -> 5s per side
// The repo's shared premium ease-out (CustomerReviews / CollectionsDeck).
// Smooth, not bouncy.
const FADE_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

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

interface PosterProps {
  images: string[];
  /** Index to show. The parent only ever advances this by 1 (mod n). */
  targetIndex: number;
  frameClassName: string;
  fallbackSrc: string;
  animate: boolean;
}

function Poster({
  images,
  targetIndex,
  frameClassName,
  fallbackSrc,
  animate,
}: PosterProps) {
  const n = images.length;
  const wrapped = n > 0 ? ((targetIndex % n) + n) % n : 0;

  const [visible, setVisible] = useState<0 | 1>(0);
  const [srcs, setSrcs] = useState<[string, string]>(() =>
    n > 1
      ? [images[wrapped], images[(wrapped + 1) % n]]
      : [fallbackSrc, fallbackSrc]
  );
  const stateRef = useRef<{ shownIndex: number; visible: 0 | 1 }>({
    shownIndex: wrapped,
    visible: 0,
  });
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!animate || n < 2) return;
    const target = ((targetIndex % n) + n) % n;
    if (target === stateRef.current.shownIndex) return; // initial mount / no-op

    const outgoing = stateRef.current.visible;
    const incoming = (1 - outgoing) as 0 | 1;

    // The incoming layer already holds images[target] (it was preloaded as
    // "next" last cycle) — just fade it in; the outgoing layer keeps its
    // current image while it fades out.
    setVisible(incoming);
    stateRef.current = { shownIndex: target, visible: incoming };

    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      const following = (target + 1) % n;
      setSrcs((prev) => {
        const copy: [string, string] = [prev[0], prev[1]];
        copy[outgoing] = images[following]; // repoint the now-hidden layer
        return copy;
      });
    }, FADE_MS);
  }, [targetIndex, animate, images, n]);

  useEffect(
    () => () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    },
    []
  );

  if (n === 0) {
    return (
      <div className={frameClassName}>
        <Image src={fallbackSrc} alt="" fill sizes="100px" className="object-cover" />
      </div>
    );
  }

  if (!animate || n < 2) {
    return (
      <div className={frameClassName}>
        <Image src={images[wrapped]} alt="" fill sizes="100px" className="object-cover" />
      </div>
    );
  }

  return (
    <div className={frameClassName}>
      {([0, 1] as const).map((layer) => (
        <Image
          key={layer}
          src={srcs[layer]}
          alt=""
          fill
          sizes="100px"
          className="object-cover"
          style={{
            opacity: visible === layer ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ${FADE_EASING}`,
          }}
        />
      ))}
    </div>
  );
}

interface DecorativePostersProps {
  /** Framed hero image (images[0]) of each product — the rotation pool. */
  images: string[];
  leftFallbackSrc: string;
  rightFallbackSrc: string;
  /** The centre text / button block, rendered between the two posters. */
  children: ReactNode;
}

export function DecorativePosters({
  images,
  leftFallbackSrc,
  rightFallbackSrc,
  children,
}: DecorativePostersProps) {
  const reduced = useReducedMotion();
  const n = images.length;
  const animate = n >= 2 && !reduced;

  const [leftIndex, setLeftIndex] = useState(0);
  // Start the right poster on a different image so the two sides never match.
  const [rightIndex, setRightIndex] = useState(() =>
    n > 1 ? Math.max(1, Math.floor(n / 2)) % n : 0
  );

  useEffect(() => {
    if (!animate) return;
    let half = 0;
    const id = setInterval(() => {
      // Alternate sides: right on even ticks (the +2.5s offset), left on odd
      // ticks (the 5s beat). One shared clock => the swaps are never
      // simultaneous.
      if (half % 2 === 0) setRightIndex((i) => (i + 1) % n);
      else setLeftIndex((i) => (i + 1) % n);
      half += 1;
    }, HALF_CYCLE_MS);
    return () => clearInterval(id);
  }, [animate, n]);

  return (
    <>
      <Poster
        images={images}
        targetIndex={leftIndex}
        animate={animate}
        frameClassName="relative h-[130px] w-[100px] -rotate-6 shadow-lg"
        fallbackSrc={leftFallbackSrc}
      />
      {children}
      <Poster
        images={images}
        targetIndex={rightIndex}
        animate={animate}
        frameClassName="relative h-[130px] w-[100px] rotate-6 shadow-lg"
        fallbackSrc={rightFallbackSrc}
      />
    </>
  );
}
