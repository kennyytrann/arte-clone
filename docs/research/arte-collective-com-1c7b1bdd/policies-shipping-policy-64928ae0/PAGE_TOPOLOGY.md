# Page Topology — Shipping Policy

URL: https://arte-collective.com/policies/shipping-policy
Route: `src/app/policies/shipping-policy/page.tsx`
Page key: `policies-shipping-policy-64928ae0`

Uses the same shared shell as Privacy Policy — see
`../policies-privacy-policy-c6df4c25/components/PolicyPage.spec.md` for the
full visual spec (typography, container width, header clearance).

## Structure

```
<AnnouncementBar />
<Header />
<EmailCaptureModal />
<PolicyPage>
  H1: "Shipping policy"
  (no "Last updated" line — the live page does not render one for this policy)
  Intro paragraph (bold "Arte Collective")
  1. Delivery Area                         — single paragraph
  2. Timelines: Printing + Shipping        — paragraph + 2-item bullet list
                                              (2nd item has an embedded line
                                              break + bold "Total Estimated
                                              Time:" sub-line)
  3. Shipping Addresses & Restrictions     — paragraph + 2-item bullet list
  4. Tracking Your Art                     — single paragraph
  5. Lost or Delayed Packages              — single paragraph
  Questions?                               — single paragraph
</PolicyPage>
<Footer />
```

## Content source

Data file: `src/components/sites/arte-collective-com-1c7b1bdd/policies-shipping-policy-64928ae0/content.ts`

Transcribed verbatim from the live page's rendered HTML, fetched directly via
HTTP (see the "Notes / known limitations" section in the Privacy Policy
topology doc for why — the shared Chrome automation session was heavily
contended by sibling agents building other pages concurrently).
