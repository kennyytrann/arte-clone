# TrustBadges

Presentational. Props: none (static content list) or `items` array.

- List of rows, each separated by a 1px top border (`border-t border-neutral-200`), padded
  vertically (~py-4).
- Row layout: icon (lucide, ~20px, dark gray/`arte-text`) — title (14px arte-text) with optional
  muted 12px subtext below it — optional right-aligned badge pill (`FREE` — light orange bg/orange
  text; or `INCLUDED FREE` — same style, slightly wider).
- Rows 1–4 use lucide icons: `Zap`, a small custom inline USA-flag SVG (no exact lucide
  equivalent), `Sparkles`, `RotateCcw`.
- Row 5 (phone wallpaper pack) swaps the icon slot for the real downloaded product thumbnail
  image (`theme/phone-wallpaper-thumb.png`) in a small rounded square, "Phone wallpaper pack" /
  muted "with every order", badge "INCLUDED FREE".
