# VariantSelector

Client component. Props: `variants: Variant[]`, `selectedId: string`, `onSelect(id): void`.
`Variant = { id, label: "small"|"medium"|"large", dimensions: string, price, compareAtPrice,
popular?: boolean }`.

- Row header: "Select size " + muted "(unframed" + info-circle glyph + ")" on the left,
  underlined "Size guide" link on the right (opens SizeGuideModal).
- 3-column grid of swatch cards. Each card:
  - Light gray (`bg-neutral-100`) background, ~140px tall illustration area containing thin
    placeholder line segments (top-left/top-right "text" bars), a soft gray/tinted rectangle
    block, and the size word ("small"/"medium"/"large") overlaid in a serif/muted style.
  - Selected card: light orange tint background + orange 1px border.
  - "medium" card only: small orange "POPULAR" pill badge pinned top-center, overlapping the
    card's top edge.
  - Below each card: a pill button showing the literal dimension text. Selected = solid orange
    bg + white text; unselected = white bg + thin gray border + dark text.
- Clicking a card or its pill selects that variant (shared onSelect handler) and updates price
  display in the parent.
