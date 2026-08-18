# FilterBar

Props: `{ activeFilter: "all" | "new"; onFilterChange: (f) => void;
allCount: number; newCount: number; onOpenFilters: () => void }`

## Structure

```
<div class="ac-controls-wrap">   // padding 0 15px, margin 28px auto 14px
                                  // (@lg: max-w 1360px, margin 36px auto 16px)
  <div class="ac-controls">      // flex justify-between items-center gap-10px
    <div class="ac-controls-left"> // inline-flex gap-5px items-center
      <button class="ac-chip [active]">ALL <span class="ac-chip-badge">131</span></button>
      <button class="ac-chip">NEW <span class="ac-chip-badge">20</span></button>
    </div>
    <button class="ac-filter-btn">FILTER BY <span class="ac-filter-badge" /></button>
  </div>
</div>
```

## Exact CSS (scraped from live inline `<style>`)

- `.ac-chip`: `display:inline-flex; align-items:center; justify-content:
  center; gap:6px; height:32px; min-width:65px; padding:0 13px;
  border-radius:999px; font-family:"Roboto Mono",monospace; font-weight:500;
  font-size:12px; line-height:1; text-transform:uppercase; transition:
  transform .15s ease;` hover → `translateY(-1px)`.
- Inactive: `background:#EEEEF0; border:1px solid #EEEEF0; color:#A2A2A3;`
- Active: `background:#F9F9F9; border:1px solid #E8E8E8; color:#5A5A5A;`
- `.ac-chip-badge`: `height:20px; padding:0 6px; border-radius:3px;
  background:#E2E2E2; color:#6C6C6D; font-weight:500; font-size:11px;`
- `.ac-filter-btn`: `height:32px; padding:0 13px; border-radius:4px;
  font-family:"Roboto Mono",monospace; font-weight:500; font-size:12px;
  text-transform:uppercase; color:#5A5A5A; background:#F9F9F9;
  border:1px solid #E8E8E8;`
- `.ac-filter-badge`: hidden unless active filters exist; `background:
  #FE6016; color:#fff; width:20px; height:20px; border-radius:3px;
  font-size:11px;` — not used in our lightweight drawer (always hidden)
  since we don't track a facet count separate from the ALL/NEW toggle.

## Behavior

The "NEW" chip is a REAL filter (see BEHAVIORS.md) — clicking it filters
`spaceProducts` down to only those whose `badges` include `"NEW"` (20
products, matching the live site's `?filter.p.m.custom.new_arrival=true`
result set exactly, since that same list was scraped to build `badges`).
"ALL" resets to all 131. Clicking "FILTER BY" opens `FilterDrawer`.
