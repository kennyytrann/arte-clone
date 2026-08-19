export interface Product {
  handle: string;
  title: string;
  price: number;
  /** Absent when Medusa reports no discount (calculated price === original price). */
  compareAtPrice?: number;
  /** Null when the source has no thumbnail/image — cards fall back to their plain background. */
  image: string | null;
  badge?: "POPULAR" | "NEW";
  /**
   * Precomputed by the Server Component that assembles the list (page/template
   * level), never by the card itself — avoids per-card availability checks.
   * Undefined means "not currently linkable" and the card renders inert.
   */
  href?: string;
}
