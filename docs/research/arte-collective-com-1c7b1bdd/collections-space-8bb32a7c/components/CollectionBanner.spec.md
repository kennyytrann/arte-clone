# CollectionBanner

Wraps the blurred nebula banner + "SPACE" pill + trust bar. No props (this
route is fixed to the Space collection).

## Structure

```
<section class="pt-[100px] px-4">          // clears absolutely-positioned Header
  <div class="ac-collection-hero-wrap">     // flex column, gap 4px, centered ≥1024px
    <div class="ac-collection-hero">        // relative, max-w 1330px, h 115px,
                                             // border 1px #D0D0D0, radius 6px,
                                             // bg #F5F5F5, overflow hidden
      <img />                               // w/h 100%, object-cover,
                                             // blur(10px) + scale(1.2) @ ≥1024px
      <div class="ac-collection-pill">      // abs centered, glass pill
        <span dot />                        // 4x4 circle, bg #EE6325
        <span>Space</span>
      </div>
    </div>
    <div class="ac-collection-trust">       // max-w 1330px, bg #f7f7f7,
                                             // border 1px #DDDDDD, radius 6px,
                                             // padding 7px, flex centered gap 5px
      <img star icon />                     // 15x15 orange-star.svg
      <p>4.86/5 +300 Reviews</p>
    </div>
  </div>
</section>
```

## Exact values (scraped from live inline `<style>`, not guessed)

- `.ac-collection-hero`: `position:relative; width:100%; max-width:1330px;
  height:115px; border:1px solid #D0D0D0; border-radius:6px;
  overflow:hidden; background:#F5F5F5;`
- `.ac-collection-hero img`: `width:100%; height:100%; object-fit:cover;`
  Additional `@media(min-width:1024px)`: `filter: blur(10px); transform:
  scale(1.20);`. Below 1024px there is no blur override in the scraped CSS,
  but the live desktop screenshot clearly shows the blur at 1440px, so we
  apply `blur(10px)` at all sizes and add the extra `scale(1.2)` only at
  `lg:` to avoid edge artifacts from the blur+scale combo, matching desktop.
- `.ac-collection-pill`: `position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%); display:inline-flex; align-items:center;
  gap:8px; padding:10px 18px; border-radius:999px;
  background:rgba(255,255,255,0.25); backdrop-filter:blur(5px);
  font-family:"Roboto Mono",monospace; font-weight:400; font-size:15px;
  line-height:1; text-transform:uppercase; letter-spacing:-0.05em;
  color:#FFFFFF;`
- `.ac-collection-pill-dot`: `width:4px; height:4px; border-radius:50%;
  background:#EE6325;` (== `--arte-orange-dark`)
- `.ac-collection-trust`: `width:100%; max-width:1330px; background:#f7f7f7;
  border:1px solid #DDDDDD; border-radius:6px; padding:7px; display:flex;
  align-items:center; justify-content:center; gap:5px; font-size:13px;
  font-family:"Roboto Mono",monospace; font-weight:400;`
- `.ac-collection-trust-text`: `color:#5A5A5A;`
- `.ac-collection-trust-highlight` ("4.86"): `color:#757578;` — note this is
  NOT orange; only the star icon image is orange.
- Real banner image: downloaded to
  `images/theme/space-banner.png` (source:
  `Space_ece143b5-816c-4196-a00f-d910ff31108d.png`, 1360×612).
- Star icon: reuse `orange-star.svg` already downloaded for the homepage
  (`root-8a5edab2/images/theme/orange-star.svg`) — same asset, safe to
  reference cross-page since it's a shared theme icon file.

## Header clearance

`Header` is `position:absolute; top:0; mt-[33px]` (33px margin + 54px bar
height = 87px). We verified the live page's banner sits with roughly 100px
of clearance above it at 1440px (announcement bar ~30px + ~70px gap before
the banner section starts), so the section wrapper uses `pt-[100px]` on
desktop. On mobile the announcement bar/header stack is shorter in absolute
terms but the header is still absolutely positioned the same way, so the
same `pt-[100px]` value is kept for simplicity and rechecked visually.
