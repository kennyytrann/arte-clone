# FilterDrawer

Props: `{ open: boolean; onClose: () => void }`. Lightweight, self-contained
facsimile — see BEHAVIORS.md for why the real native-facets content could
not be captured.

## Structure

Slide-in panel from the right (390px wide on desktop, full-width on
mobile), dark overlay behind it, visual language borrowed from `Header`'s
existing mobile menu drawer (`bg-[#2b1f1d]`, white text) for consistency
with the rest of the site's dark-panel treatment:

```
<div class="fixed inset-0 z-50 flex justify-end">
  <button aria-label="Close overlay" class="flex-1 bg-black/40" />
  <div class="h-full w-[320px] sm:w-[390px] bg-white px-5 py-5 overflow-y-auto">
    <header>FILTER BY <CloseButton /></header>
    <FacetGroup title="Size">
      12" x 18" / 20" x 30" / 24" x 36" — checkboxes
    </FacetGroup>
    <FacetGroup title="Price">
      $39 / $49 / $59 — checkboxes (matches the 3 real variant prices)
    </FacetGroup>
    <FacetGroup title="Availability">
      In stock (checked, disabled — all 131 products are in stock)
    </FacetGroup>
    <button>Apply</button>
    <button>Clear all</button>
  </div>
</div>
```

No network calls — purely a local UI affordance (checkbox state only),
since there's no server-side filter endpoint to call from a static Next.js
page and the real facet definitions could not be verified.
