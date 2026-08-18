# ProductGallery

Client component. Props: `images: string[]`, `alt: string`.

- Square-ish, light gray background container holding one large `<Image>` (object-contain-ish,
  actually object-cover fill of the mockup image, which already has its own gray background baked
  in / framed poster mockup).
- Index state (`useState(0)`); crossfade transition between images (opacity) on index change.
- Prev/next buttons: absolutely positioned, vertically centered, left-4 / right-4, square
  ~36px, orange-tinted translucent background (`bg-arte-orange/10` or similar light box) with a
  `ChevronLeft`/`ChevronRight` (lucide) icon. Wrap-around index math.
- No dot indicators observed on live site.
