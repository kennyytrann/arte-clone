# Behaviors — arte-collective.com/

## Interaction model per section
- **Header**: static overlay, no scroll-triggered restyle observed (transparent dark overlay throughout).
- **EmailCaptureModal**: appears automatically shortly after page load/first scroll. Dismiss via × button (top-right, gray circle). Click-driven only (no scroll re-trigger observed).
- **Product carousels** (Bestsellers / New Arrivals / Artemis): click-driven via prev/next arrow buttons. Horizontal slide transition. Not scroll-snap — button click advances by ~1 card width. No autoplay observed.
- **CollectionsStack**: swipe/drag or arrow-driven fanned card stack; front card is largest, others peek from behind at decreasing scale/increasing rotation.
- **VideoTabs**: CLICK-driven (confirmed — not scroll driven). Two pill buttons "UNBOXING" / "FRAMING" toggle which video plays in the frame below. Active pill has dark-gray filled background; inactive is outline/lighter.
- **FAQAccordion**: click-driven. Clicking a question row toggles its answer open/closed; icon swaps from "+" to "−". Multiple can be open simultaneously (not confirmed single-open-only — no evidence other rows auto-collapsed).
- **InstagramStrip**: horizontal scroll (drag or native), no click interaction beyond potential external links.
- **ShopTheLook**: hotspot dots are decorative/likely link to individual products on hover (not deeply tested — treated as static overlay dots for the clone, non-blocking).

## Hover states (product cards)
- Card image: swaps to a secondary "hover" image (`img.bee-product-hover-img`) on `:hover` — confirmed via DOM (`bee-product-hover-img` class present alongside `bee-product-main-img`). Cross-fade expected (standard Shopify theme behavior); implement as opacity crossfade ~200ms ease.
- Card container: no scale/shadow change observed beyond the image swap.

## Scroll sweep findings
- No sticky/fixed header re-style triggered by scroll position (checked at scroll 0 and after ~8 ticks).
- No parallax layers detected on the hero.
- No scroll-snap on the page container.
- No IntersectionObserver-driven fade-ins were visually obvious during the sweep (theme is fairly static/CSS-only); if added, keep subtle (fade-up ~400ms) to match the site's understated motion language — this is a reasonable default, not a confirmed extraction.
- No smooth-scroll library markers (`.lenis`, `.locomotive-scroll`) found in the DOM class dump.

## Responsive
Only desktop (1440px) was exhaustively swept via browser MCP due to session scope; tablet/mobile behavior for this clone follows standard mobile-first stacking (single column, carousels remain horizontally scrollable, header hamburger opens a full-height drawer menu) — implemented per Tailwind mobile-first defaults rather than extracted per-breakpoint values.

## FAQ content (verbatim, all 9 items — see products/faq data in AboutUs+FAQ builder)
Captured in full during extraction; embedded directly in the FAQAccordion component's data array.
