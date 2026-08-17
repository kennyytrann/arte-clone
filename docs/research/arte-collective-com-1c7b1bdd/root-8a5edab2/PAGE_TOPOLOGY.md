# Page Topology — arte-collective.com/

Shopify storefront (Bee/Beep theme). Source: curl-fetched HTML + browser scroll sweep at 1440px.

## Stacking order (top to bottom)

1. **AnnouncementBar** — sticky-ish top marquee, orange bg `#FE6016`, "ADD 2 PRINTS, GET 1 FREE", white text, 20px tall. Flow content (not fixed).
2. **Header** — semi-transparent dark overlay (`rgba(37,33,34,0.5)`) sitting on top of hero background (absolutely positioned over hero, not solid). Hamburger (left), logo "arte." center, search + cart icons (right).
3. **Hero** — full-bleed blurred room photo background, 5 layered poster `<img>` overlays arranged like a gallery wall, heading "Science you'll be proud to display" (Inter 40px + orange Crimson-Text italic accent), CTA button "EXPLORE ALL PRINTS", rating line "4.86/5 +300 Reviews".
4. **EmailCaptureModal** — triggered on scroll/timer (appeared after ~1 scroll tick). Dark overlay card, "10% Off first order", tag pills (News & Contents / Early Access / Exclusive Discounts), email input, orange "GET 10% OFF" button. Dismissible via × top-right.
5. **Bestsellers carousel** — "TRENDING NOW" eyebrow, "Explore our iconic bestsellers" heading, flickity-style horizontal carousel of ProductCards (POPULAR/NEW badges), prev/next arrow buttons.
6. **LogoStrip** — "INSPIRED BY" eyebrow, grayscale partner logos (Blue Origin, National Geographic, NASA, SpaceX, ESA, Nature, BBC Earth, JAXA).
7. **ShopTheLook** — "CURATED SETS" eyebrow, "Shop the look" heading, 4-up grid of room photos with white hotspot dots overlaid, "SEE THE FULL SET [n]" caption bar at bottom of each.
8. **New Arrivals carousel** — "NEW ARRIVALS" eyebrow, "Fresh from The lab" heading, same ProductCarousel component, all NEW badges.
9. **CollectionsStack** — "EXPLORE MORE" eyebrow, "Our exclusive collections" heading, a fanned/stacked deck of cards (each a category tile: Historic Shots, Space, etc. with count badge), swipeable.
10. **AboutUs** — light-gray full-width box, "ABOUT US" eyebrow, decorative sentence-as-heading with inline emoji avatars and hand-drawn circle/squiggle underline accents on "creative lab" and "creating" and "our love".
11. **Artemis carousel** — "BACK TO THE MOON" eyebrow, "Celebrate Artemis II" heading, same ProductCarousel, mixed NEW/POPULAR badges.
12. **VideoTabs** — "UP CLOSE" eyebrow, "Watch our prints in action" heading, UNBOXING/FRAMING pill tabs (click-driven) above a video player, "SEE ALL" thumbnail nav bottom-right.
13. **PrintOfWeekGrid** — "WEEKLY FEATURE" eyebrow, "Print of the Week" heading, static 4-column x 2-row grid of ProductCards (no carousel/arrows).
14. **InstagramStrip** — "INSTAGRAM" eyebrow, "Share your poster: @artecollective_" heading, horizontally scrollable strip of UGC photo tiles with @handle chip overlay.
15. **FAQAccordion** — "HELP & SUPPORT" eyebrow, "Frequently asked Questions" heading, 2-column x up to 5-row accordion list (9 items total), click to expand/collapse (+/− icon toggle).
16. **DecorativeCTA** — "Nerd out your space" heading over a graph-paper background with scattered rotated product photos, plant, pencil, coffee-cup illustrations, "SHOP ALL" orange button.
17. **Footer** — solid orange `#FE6016`/`#EE6325`-ish background, social icons (Facebook, Instagram, TikTok), country/currency selector pill, payment method icons, legal links row, copyright line.

## Layout notes
- Max content width ~1170-1200px, centered, with side gutters.
- Header floats over the hero via negative margin / absolute positioning (transparent-to-solid is NOT scroll-triggered here — it's a fixed semi-transparent overlay throughout, confirmed by scroll sweep: no header restyle observed on scroll).
- All carousels share one visual component (ProductCard + ProductCarousel wrapper with prev/next arrow buttons at 8px above card vertical-center, positioned outside card edges).
- Section vertical rhythm: ~80-90px top padding before each eyebrow label, alternating white/`#F2F2F2`-ish light-gray section backgrounds for AboutUs only; everything else is white.

## Assets
- Product images: `public/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/images/products/*.png` (101 files, real Shopify CDN, resized to width=800).
- Theme/decorative images: `.../images/theme/*.{png,svg}` (66 files: logo, hamburger/search icons, partner logos, about-us avatars, pill/decoration graphics, social icons).
- Videos: `.../videos/{unboxing.mp4,unboxing.webm,framing.mp4}`.
- Product data: `src/components/sites/arte-collective-com-1c7b1bdd/root-8a5edab2/data/products.ts` (real titles/prices/images grouped by section).

## Known gaps
- 5 of 106 referenced product handles could not be resolved to a real image after repeated attempts against Shopify's bot-check (`the-suns-dying-soon-green`, `the-suns-dying-soon-orange`, `whale-black`, `triple-seven-white`, plus one substitute used twice for `turing-test` — actually recovered). These do not appear in the 4 curated section datasets used for the build, so no placeholder/fallback was needed.
