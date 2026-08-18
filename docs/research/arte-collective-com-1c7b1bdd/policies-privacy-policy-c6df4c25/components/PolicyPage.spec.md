# PolicyPage — shared component spec

Shared shell used by all 4 Shopify policy pages (Privacy Policy, Refund Policy,
Shipping Policy, Terms of Service). Verified live against
`https://arte-collective.com/policies/privacy-policy` at desktop (1440px).

Component: `src/components/sites/arte-collective-com-1c7b1bdd/shared/PolicyPage.tsx`

Referenced by the other 3 pages' research folders:
- `../policies-refund-policy-4c934ce1/PAGE_TOPOLOGY.md`
- `../policies-shipping-policy-64928ae0/PAGE_TOPOLOGY.md`
- `../policies-terms-of-service-3f95b8b5/PAGE_TOPOLOGY.md`

## Source template

Shopify's default policy page template. DOM structure on the live site:

```html
<div class="shopify-policy__container">
  <div class="shopify-policy__title"><h1>Privacy policy</h1></div>
  <div class="shopify-policy__body">
    <div class="rte">
      <p><b>Last updated:</b> February 4, 2026</p>
      <p>… intro …</p>
      <h3>1. Section heading</h3>
      <p>… paragraph …</p>
      <ul><li><p><b>Label:</b> text</p></li>…</ul>
    </div>
  </div>
</div>
```

Only 2 of the 4 pages actually render a "Last updated" line (Privacy Policy,
Terms of Service) — Refund Policy and Shipping Policy omit it entirely on the
live site. `PolicyPageContent.lastUpdated` is optional to match this.

## Computed styles (measured via DevTools/CDP on the live page, desktop viewport)

| Element | Font | Size | Weight | Line-height | Color |
|---|---|---|---|---|---|
| H1 title | Inter | 37px (measured) / we use 37px desktop, 28px mobile | 600 | 51.8px (~1.4) | `rgb(21,21,21)` → `#151515` |
| "Last updated" line | Inter | 14px | 400 (label bold) | 23.8px (~1.7) | `#858585` (= `--arte-text-muted`) |
| H3 section heading | Inter | 23px desktop / 19px mobile | 600 | 32.2px (~1.4) | `#151515` |
| Paragraph / list-item text | Inter | 14px | 400 | 23.8px (~1.7) | `#858585` |
| Bold inline runs (labels, emphasis) | Inter | inherit | 600 | inherit | `#151515` |
| Links | Inter | inherit | inherit | inherit | inherit, underlined |

Container:
- `.shopify-policy__container` computed `max-width: 574.082px` (~36rem), horizontal
  `padding: 0 20px`, centered (`margin: 0 auto`). This is a **fixed** max-width,
  not viewport-relative — confirmed by comparing `containerRect` at an
  (unusually wide, ~2704px CSS px) browser window where the value held steady.
  Implemented as `max-w-[574px] px-5 mx-auto`.
- `ul` padding-left: `17px` (not the browser default 40px). Implemented as
  `pl-[17px]` with `list-disc` and a muted marker color to stay subtle,
  matching the live page's understated bullets.
- H1 is horizontally centered on the page; the "Last updated" line, intro,
  and all section content below it are left-aligned within the centered
  content column.

## Header clearance

`Header` (`root-8a5edab2/Header.tsx`, reused as-is) is `absolute inset-x-0 top-0
z-40 mt-[33px]` with a 54px-tall bar, so it occupies roughly the 33px–87px band
from the top of the page. Because it's taken out of flow, the first in-flow
element (this component's outer wrapper) needs `padding-top` to clear it.
Implemented as `pt-[86px] sm:pt-[104px]` on the outer wrapper (AnnouncementBar's
own ~33px flow height plus the 54px header height, plus a little breathing
room before the H1). This was verified against one live screenshot and one
local dev screenshot side-by-side; treat as a close approximation — the shared
browser session used for inspection was heavily contended by sibling
page-building agents running concurrently, which limited how many live
DevTools measurements could be taken reliably. If a later pass has a clean
browser session, re-verify this value precisely.

## Content model (typed, no `dangerouslySetInnerHTML`)

```ts
type Run = { text: string; bold?: boolean; link?: string } | { break: true };
type RichText = Run[];

interface PolicySection {
  heading: string;
  hrBefore?: boolean;               // used once, in Terms of Service before Section 1
  paragraphs?: RichText[];
  list?: RichText[];
  paragraphsAfterList?: RichText[];
}

interface PolicyPageContent {
  title: string;
  lastUpdated?: string;
  intro?: RichText[];               // paragraphs before the first section heading
  sections: PolicySection[];
}
```

`Run` supports inline bold spans anywhere in a sentence (not just leading
labels — e.g. "based in **France** but serve the **US**"), inline links, and
explicit line breaks (used in the Shipping Policy's second bullet and in the
Terms of Service image-credit citations), while keeping all real page copy as
plain typed data rendered through JSX — no raw HTML is ever injected.

## Reused shared components (not modified)

- `root-8a5edab2/AnnouncementBar` — orange bar, identical on every page.
- `root-8a5edab2/Header` — absolute, translucent dark header, identical on every page.
- `root-8a5edab2/EmailCaptureModal` — appears ~2.5s after load, identical on every page.
- `root-8a5edab2/Footer` — identical on every page.

Note: the task brief referenced these at
`@/components/sites/arte-collective-com-1c7b1bdd/shared/*`, but as committed
on `master` (commit `90905ab`) they actually live under `root-8a5edab2/*`. The
4 policy routes import from the real, existing location rather than moving or
duplicating them, per "do not modify shared files, the homepage, or other
pages' namespaces."
