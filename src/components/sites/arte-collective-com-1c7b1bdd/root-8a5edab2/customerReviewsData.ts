export interface CustomerReview {
  rating: number;
  title: string;
  body: string;
  name: string;
  country: string;
}

/**
 * TEMPORARY design/demo review data for the homepage "Customer Reviews"
 * carousel (consumed by `CustomerReviews.tsx`).
 *
 * These are NOT verified customer reviews — they exist only so the carousel
 * has enough realistic content to lay out and cycle. Replace this whole array
 * with real review data (same shape) when it's available; nothing else in
 * `CustomerReviews.tsx` needs to change.
 */
export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    rating: 5,
    title: "Exactly what my living room needed",
    body: "The Supra print arrived rolled in a sturdy tube with zero creases. Colors are punchy and the matte finish kills the glare from my window. Framing it this weekend.",
    name: "Marcus R.",
    country: "United States",
  },
  {
    rating: 4,
    title: "Better in person than on screen",
    body: "I was worried the neon tones would look washed out, but the blacks are deep and the print is razor sharp. Shipping took five days to Chicago, which felt fair.",
    name: "Priya N.",
    country: "United States",
  },
  {
    rating: 5,
    title: "Third order and still impressed",
    body: "I've been slowly building a wall of these in my garage. Consistent quality every time, and the paper weight feels genuinely premium. Support swapped a bent corner with no hassle.",
    name: "Danielle K.",
    country: "United States",
  },
  {
    rating: 5,
    title: "Perfect gift for a car guy",
    body: "Bought the GT-R poster for my brother's birthday and he hung it in his home office the same day. Packaging was tidy and it showed up two days early.",
    name: "Anthony G.",
    country: "United States",
  },
  {
    rating: 5,
    title: "Clean design, great size",
    body: "The 24x36 fills the space above my desk exactly how I hoped. Lines are crisp with no pixelation up close. I'll be ordering another for the hallway.",
    name: "Sophie L.",
    country: "United States",
  },
  {
    rating: 5,
    title: "Held up to a cross-country move",
    body: "I packed these for a move from Austin to Portland and every print came through flat and undamaged. The shipping tube is no joke and the art quality speaks for itself.",
    name: "Wesley T.",
    country: "United States",
  },
  {
    rating: 5,
    title: "Framed set looks incredible",
    body: "Ordered the two-print set and hung them side by side in the hallway. Guests always ask where they're from, and the color match between the two prints is spot on.",
    name: "Renee M.",
    country: "United States",
  },
  {
    rating: 5,
    title: "Small studio, big impact",
    body: "One print completely changed the vibe of my apartment. Matte stock, accurate color, and it was affordable enough that I'm already planning the next one.",
    name: "Carlos D.",
    country: "United States",
  },
];
