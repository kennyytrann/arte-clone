# FloatingDiscountPill

Props: `{ onClick: () => void }`. Best-effort reconstruction — see
BEHAVIORS.md for why the exact trigger/styling could not be captured live.

## Behavior

- Hidden until `window.scrollY > 400`, then fades/slides in
  (`translate-y-2 opacity-0` → `translate-y-0 opacity-100`, 200ms).
- Fixed position, bottom-right, above the footer's stacking context
  (`z-40`, clear of `Header`'s `z-40` since it only renders after scrolling
  past the banner where Header is no longer visible/relevant, but z-40 kept
  consistent with the rest of the site's overlay layer).
- Clicking it re-opens `EmailCaptureModal` (reuses the shared component's
  existing open state via a shared `useState` lifted into the page, OR — if
  `EmailCaptureModal` doesn't expose imperative control — simply triggers
  the same visual promo by rendering a second lightweight `<EmailCaptureModal
  />`-style trigger). Since the shared `EmailCaptureModal` manages its own
  timer-based `open` state internally with no props, we don't attempt to
  puppet it; instead the pill click scrolls to top / is a purely visual
  affordance labeled "GET 10% OFF" that, on click, dispatches a custom
  event the page listens for to force-open a second lightweight controlled
  instance is overkill for one pill — simplest faithful choice: clicking it
  smooth-scrolls to top where the announcement bar reiterates the offer.

## Visual

```
<button class="fixed bottom-5 right-4 z-40 bg-arte-orange text-white
               text-[12px] font-medium uppercase tracking-wide
               px-4 py-3 rounded-full shadow-lg">
  Get 10% off
</button>
```
