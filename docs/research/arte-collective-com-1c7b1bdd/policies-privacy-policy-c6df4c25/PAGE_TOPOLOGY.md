# Page Topology — Privacy Policy

URL: https://arte-collective.com/policies/privacy-policy
Route: `src/app/policies/privacy-policy/page.tsx`
Page key: `policies-privacy-policy-c6df4c25`

## Structure

```
<AnnouncementBar />
<Header />
<EmailCaptureModal />
<PolicyPage>
  H1: "Privacy policy"
  "Last updated: February 4, 2026"
  Intro paragraph (bold "Arte Collective", link to arte-collective.com)
  1. What Information Do We Collect?  — paragraph + 3-item bullet list
  2. How Do We Use Your Data?          — paragraph + 4-item bullet list
  3. Who Do We Share It With?          — paragraph + 3-item bullet list
  4. Your Rights (GDPR & CCPA)         — paragraph + 4-item bullet list
  5. Cookies                           — single paragraph
  6. Get in Touch                      — single paragraph
</PolicyPage>
<Footer />
```

Shared visual template documented in
`../policies-privacy-policy-c6df4c25/components/PolicyPage.spec.md` (this
folder — used as the canonical spec referenced by the other 3 policy pages).

## Content source

Data file: `src/components/sites/arte-collective-com-1c7b1bdd/policies-privacy-policy-c6df4c25/content.ts`

Content transcribed verbatim from the live page's rendered HTML
(`.shopify-policy__body .rte`), fetched directly via HTTP rather than through
the browser automation tool (see note below), to guarantee exact text with no
paraphrasing.

## Screenshots

- `docs/design-references/arte-collective-com-1c7b1bdd/policies-privacy-policy-c6df4c25/live-desktop.jpg` — live site, desktop (1440px)
- `docs/design-references/arte-collective-com-1c7b1bdd/policies-privacy-policy-c6df4c25/build-desktop.jpg` — this build, desktop (1440px), local dev server

## Notes / known limitations

- The Chrome MCP browser session used for inspection is shared across
  multiple sibling agents building other pages of this same clone
  concurrently (confirmed via tab titles/URLs belonging to other worktrees'
  dev servers, and via shared scratchpad files from sibling agents). This
  caused repeated tab closures/hijacks mid-inspection. Verbatim text content
  was instead pulled via direct HTTP fetch of the live page's HTML (reliable,
  not subject to this contention). Computed CSS values were captured
  opportunistically in the brief windows the shared tab was available; core
  typography (H1, H3, paragraph, "Last updated" line, list padding, container
  max-width) was measured successfully. Header-clearance padding is a close
  approximation validated by one live vs. one local screenshot comparison —
  worth a final pixel-check pass if a dedicated (uncontended) browser session
  becomes available.
- Mobile (390px) screenshots of the live site could not be captured reliably
  due to the same contention; the component's mobile styles follow the same
  proportional scale-down pattern as the rest of the site (smaller H1/H3 sizes
  at the `sm:` breakpoint) rather than a separately measured mobile
  breakpoint.
