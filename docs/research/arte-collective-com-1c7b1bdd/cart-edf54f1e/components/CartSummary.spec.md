# CartSummary Specification

## Overview
- **Target file:** `src/components/sites/arte-collective-com-1c7b1bdd/cart-edf54f1e/CartSummary.tsx`
- **Screenshot:** `docs/design-references/arte-collective-com-1c7b1bdd/cart-edf54f1e/cart-empty-desktop.jpg` (right-hand box, visible in both populated and empty states with real values)
- **Interaction model:** static display + one submit button (visually cloned, not wired to real checkout)

## DOM Structure
```
<div class="sidebar-box">
  <div class="subtotal-row"> "Subtotal:" ........ "$78 USD" </div>
  <p> "Shipping calculated at checkout" </p>
  <button> "Check Out" </button>
</div>
```

## Computed Styles

### Container
- border: `0.8px solid rgb(229, 229, 229)` → `#e5e5e5`
- borderRadius: `0`
- padding: `30px`
- marginBottom: `40px` (spacing below the box, matches the live page's empty space beneath it)
- background: transparent (page background shows through — white)

### Subtotal row
- `display: flex`, `justify-content: space-between`, `align-items: center`
- Label "Subtotal:" — `<strong>` (bold), default text color
- Value — real fontSize/weight matches the label's row but is not italic/orange; format: `${amount} {currencyCode}` uppercased (e.g. "$78 USD", "$0 USD")

### Shipping note
- Text: "Shipping calculated at checkout" (verbatim)
- fontSize small, color `#858585` (muted, matches project's `--arte-text-muted`)

### Check Out button
- Full width of the box's inner content area
- `height: 50px`, `padding: 0`, `border-radius: 0`
- background `rgb(34, 34, 34)` → `#222222` (exact match for this project's existing `--arte-text` token)
- color white
- fontFamily `"Roboto Mono", monospace` (already the project's `--font-roboto-mono` token, used elsewhere for the collection page's filter chips)
- fontSize `13px`, fontWeight `500`, `text-transform: uppercase`
- Text: "Check Out" (verbatim, note the real site's DOM has a trailing space: `"Check Out "` — render as "Check Out" cleanly)
- **Not wired to a real checkout** — visual clone only, per this project's explicit "do not implement checkout" constraint. Clicking it does nothing (or is `disabled` — implementer's choice, whichever preserves the visual style better; a plain non-submitting button with no `onClick` is simplest and matches the "preserve UI, don't fake behavior" pattern already used for the product page's Add to Cart button before it was wired, and for other unwired CTAs across this project).

## States & Behaviors
- Renders identically whether the cart is populated or empty — only the Subtotal value and (implicitly) the item rows above it change. Confirmed live: empty cart still shows the full sidebar box with "$0 USD".

## Assets
- None.

## Text Content (verbatim)
- "Subtotal:"
- "Shipping calculated at checkout"
- "Check Out"

## Responsive Behavior
- **Desktop (≥1024px / lg):** right column, ~33% page width, sits beside the cart table
- **Below 1024px:** full width, stacked below the cart table/empty-state
- **Breakpoint:** 1024px (Tailwind `lg:`)
