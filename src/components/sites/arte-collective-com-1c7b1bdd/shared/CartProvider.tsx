"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  addToCart as addToCartService,
  getCart,
  removeCartItem as removeCartItemService,
  updateCartItem as updateCartItemService,
  type CartLineItem,
  type CartSummary,
} from "@/lib/cart";

import { CartDrawer } from "@/components/sites/arte-collective-com-1c7b1bdd/shared/CartDrawer";

/**
 * Local line-item ids assigned to optimistic add-to-cart lines before Medusa
 * has confirmed the add and returned the real line id. Any id with this prefix
 * must be resolved through `tempToReal` before it is sent to a Medusa mutation.
 */
const OPTIMISTIC_PREFIX = "optimistic-";

function isOptimisticId(id: string): boolean {
  return id.startsWith(OPTIMISTIC_PREFIX);
}

/**
 * Display data the caller already has when it triggers an add — used to render
 * the line in the drawer instantly, before Medusa responds. Never invented:
 * ProductBuyBox passes the exact product/variant fields it is already showing.
 * The authoritative values replace these as soon as the add request resolves.
 */
export interface OptimisticLineHint {
  productTitle: string;
  variantTitle: string;
  unitPrice: number;
  thumbnail: string | null;
  currencyCode?: string;
}

interface PendingAdd {
  variantId: string;
  quantity: number;
  /** Rejects (after rollback) if the Medusa add fails. */
  promise: Promise<unknown>;
}

interface CartContextValue {
  cart: CartSummary | null;
  totalQuantity: number;
  isLoading: boolean;
  error: string | null;

  addItem: (
    variantId: string,
    quantity?: number,
    optimistic?: OptimisticLineHint
  ) => Promise<void>;
  updateItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  waitForCartSync: () => Promise<void>;

  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Always-current mirror of `cart` so async mutation logic can read the latest
  // state without stale-closure hazards. Maintained only via `writeCart`.
  const cartRef = useRef<CartSummary | null>(null);

  // The single serialized tail of every cart mutation (add / quantity / delete).
  // Each new mutation chains onto this so backend writes never interleave.
  const pendingCartSync = useRef<Promise<void>>(Promise.resolve());

  const quantitySyncTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const queuedQuantityUpdates =
    useRef<Map<string, number>>(new Map());

  // In-flight optimistic deletions, keyed by the line id passed to removeItem
  // (a real Medusa id, or an optimistic temp id). The stored promise rejects if
  // the backend delete fails (after the authoritative cart has been restored),
  // so waitForCartSync() can refuse to let checkout proceed on a stale
  // assumption. Entries are removed once the delete settles.
  const pendingDeletes =
    useRef<Map<string, Promise<void>>>(new Map());

  // In-flight optimistic adds. waitForCartSync() blocks on every entry so
  // checkout cannot load before Medusa has confirmed the add.
  const pendingAdds = useRef<Set<PendingAdd>>(new Set());

  // temp line id -> real Medusa line id (or null when the add failed / created
  // no line). Populated when an add request resolves.
  const tempToReal = useRef<Map<string, string | null>>(new Map());

  // Temp ids that were rendered as their own new drawer line (as opposed to
  // being merged into an existing line for the same variant). Lets reconcile
  // tell "user trashed the optimistic line" apart from "line merged away".
  const optimisticLineIds = useRef<Set<string>>(new Set());

  const optimisticSeq = useRef(0);

  const writeCart = useCallback(
    (
      next:
        | CartSummary
        | null
        | ((prev: CartSummary | null) => CartSummary | null)
    ) => {
      setCart((prev) => {
        const resolved =
          typeof next === "function"
            ? (next as (p: CartSummary | null) => CartSummary | null)(prev)
            : next;
        cartRef.current = resolved;
        return resolved;
      });
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    getCart()
      .then((existing) => {
        // Don't clobber optimistic state if the customer has already acted
        // before this initial load resolved — a pending add's reconcile will
        // fold in the authoritative cart instead.
        if (!cancelled && cartRef.current == null) {
          writeCart(existing);
        }
      })
      .catch(() => {
        // No active cart yet.
      });

    return () => {
      cancelled = true;

      if (quantitySyncTimer.current) {
        clearTimeout(quantitySyncTimer.current);
      }
    };
  }, [writeCart]);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const addItem = useCallback(
    async (
      variantId: string,
      quantity = 1,
      optimistic?: OptimisticLineHint
    ) => {
      setError(null);

      // Instant: reveal the drawer without waiting for the Medusa roundtrip.
      setIsCartOpen(true);

      const tempId = `${OPTIMISTIC_PREFIX}${(optimisticSeq.current += 1)}`;
      const preExistingLine =
        cartRef.current?.items.find((i) => i.variantId === variantId) ?? null;
      const createsNewLine = !preExistingLine && Boolean(optimistic);
      if (createsNewLine) {
        optimisticLineIds.current.add(tempId);
      }

      // Instant: represent the add in local cart state.
      writeCart((current) => {
        const base: CartSummary =
          current ?? {
            id: "optimistic-cart",
            currencyCode: optimistic?.currencyCode ?? "usd",
            items: [],
            totalQuantity: 0,
          };

        const idx = base.items.findIndex((i) => i.variantId === variantId);
        let items: CartLineItem[];

        if (idx >= 0) {
          items = base.items.map((i, n) =>
            n === idx ? { ...i, quantity: i.quantity + quantity } : i
          );
        } else if (optimistic) {
          const line: CartLineItem = {
            id: tempId,
            variantId,
            variantSku: undefined,
            productTitle: optimistic.productTitle,
            variantTitle: optimistic.variantTitle,
            quantity,
            unitPrice: optimistic.unitPrice,
            thumbnail: optimistic.thumbnail,
          };
          items = [...base.items, line];
        } else {
          // No display data and no existing line: the drawer still opens and
          // reconcile will populate the line once Medusa responds.
          items = base.items;
        }

        return {
          ...base,
          items,
          totalQuantity: items.reduce((s, i) => s + i.quantity, 0),
        };
      });

      const entry: PendingAdd = {
        variantId,
        quantity,
        promise: Promise.resolve(),
      };

      const run = pendingCartSync.current
        .catch(() => {
          // Ignore earlier mutation failures; this add is chained after them.
        })
        .then(() => addToCartService(variantId, quantity))
        .then((serverCart) => {
          const serverLine =
            serverCart.items.find((i) => i.variantId === variantId) ?? null;
          tempToReal.current.set(tempId, serverLine?.id ?? null);

          writeCart((current) => {
            if (!current) return serverCart;

            const userRemovedThis =
              optimisticLineIds.current.has(tempId) &&
              !current.items.some((i) => i.id === tempId);

            // Prefer the quantity the customer currently sees (it already
            // folds in optimistic increments, queued +/- edits, and the
            // contribution of other still-pending adds) over the server's
            // value, which predates mutations chained after this add.
            const localByVariant = new Map<string, CartLineItem>();
            for (const li of current.items) {
              const key = li.variantId ?? li.id;
              if (!localByVariant.has(key) || !isOptimisticId(li.id)) {
                localByVariant.set(key, li);
              }
            }

            let items: CartLineItem[] = serverCart.items
              .filter((si) => !pendingDeletes.current.has(si.id))
              .filter(
                (si) => !(userRemovedThis && si.variantId === variantId)
              )
              .map((si) => {
                const local = si.variantId
                  ? localByVariant.get(si.variantId)
                  : undefined;
                return local ? { ...si, quantity: local.quantity } : si;
              });

            // Carry over optimistic-only lines for OTHER pending adds whose
            // variant the server cart does not contain yet.
            const serverVariants = new Set(
              serverCart.items.map((i) => i.variantId)
            );
            for (const li of current.items) {
              if (
                isOptimisticId(li.id) &&
                li.id !== tempId &&
                !serverVariants.has(li.variantId) &&
                !items.some((x) => x.id === li.id)
              ) {
                items = [...items, li];
              }
            }

            return {
              ...serverCart,
              items,
              totalQuantity: items.reduce((s, i) => s + i.quantity, 0),
            };
          });

          optimisticLineIds.current.delete(tempId);
        })
        .catch(async (err) => {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to add item to cart."
          );

          optimisticLineIds.current.delete(tempId);
          tempToReal.current.set(tempId, null);

          // Roll back the phantom line to authoritative backend state.
          const realCart = await getCart();
          writeCart(realCart);

          throw err instanceof Error
            ? err
            : new Error("Failed to add item to cart.");
        });

      entry.promise = run;
      pendingAdds.current.add(entry);

      void run
        .finally(() => {
          pendingAdds.current.delete(entry);
        })
        .catch(() => {
          // Failure already surfaced above; swallow on the cleanup chain.
        });

      // Advance the shared mutation chain; never leave it rejected.
      pendingCartSync.current = run.then(
        () => {},
        () => {}
      );

      // Intentionally NOT awaiting `run`: the drawer and optimistic line are
      // already on screen, and the request is tracked in pendingAdds /
      // pendingCartSync so waitForCartSync() (checkout) still blocks on it.
    },
    [writeCart]
  );

  const flushQuantityUpdates =
    useCallback((): Promise<void> => {
      if (quantitySyncTimer.current) {
        clearTimeout(quantitySyncTimer.current);
        quantitySyncTimer.current = null;
      }

      if (queuedQuantityUpdates.current.size === 0) {
        return pendingCartSync.current;
      }

      const updates = Array.from(
        queuedQuantityUpdates.current.entries()
      ).filter(
        // Never send a quantity update for a line item that is being
        // deleted — it would race with (or resurrect) the delete.
        ([lineItemId]) => !pendingDeletes.current.has(lineItemId)
      );

      queuedQuantityUpdates.current.clear();

      if (updates.length === 0) {
        return pendingCartSync.current;
      }

      const sync = pendingCartSync.current
        .catch(() => {
          // Keep future updates usable even if an earlier request failed.
        })
        .then(async () => {
          for (const [lineId, quantity] of updates) {
            // Resolve optimistic temp ids to their real Medusa line id. This
            // runs after the owning add (serialized on pendingCartSync), so
            // the mapping is populated by now.
            let realId: string | null = lineId;
            if (isOptimisticId(lineId)) {
              realId = tempToReal.current.get(lineId) ?? null;
            }
            if (realId == null) continue; // add failed / produced no line
            if (
              pendingDeletes.current.has(lineId) ||
              pendingDeletes.current.has(realId)
            ) {
              continue; // line is being deleted
            }
            await updateCartItemService(realId, quantity);
          }
        })
        .catch(async (err) => {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to update cart item."
          );

          const realCart = await getCart();
          writeCart(realCart);
        });

      pendingCartSync.current = sync;

      return sync;
    }, [writeCart]);

  const updateItem = useCallback(
    async (lineItemId: string, quantity: number) => {
      setError(null);

      // Quantity is clamped to a minimum of 1 — removal is the trash
      // control's job only.
      if (quantity < 1) {
        return;
      }

      // A line item that is already being deleted must not receive further
      // quantity syncs.
      if (pendingDeletes.current.has(lineItemId)) {
        return;
      }

      writeCart((current) => {
        if (!current) {
          return current;
        }

        const items = current.items.map((item) =>
          item.id === lineItemId
            ? {
                ...item,
                quantity,
              }
            : item
        );

        return {
          ...current,
          items,
          totalQuantity: items.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
        };
      });

      queuedQuantityUpdates.current.set(
        lineItemId,
        quantity
      );

      if (quantitySyncTimer.current) {
        clearTimeout(quantitySyncTimer.current);
      }

      quantitySyncTimer.current = setTimeout(() => {
        void flushQuantityUpdates();
      }, 250);
    },
    [flushQuantityUpdates, writeCart]
  );

  const removeItem = useCallback(
    async (lineItemId: string) => {
      setError(null);

      // A queued debounced quantity change for this line must never be sent
      // for a row that is being deleted.
      queuedQuantityUpdates.current.delete(lineItemId);

      // Optimistic, instant local removal — do NOT wait for Medusa, and do
      // NOT flip the global isLoading flag.
      writeCart((current) => {
        if (!current) {
          return current;
        }

        const items = current.items.filter(
          (item) => item.id !== lineItemId
        );

        return {
          ...current,
          items,
          totalQuantity: items.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
        };
      });

      // Serialize the delete after any queued / in-flight quantity sync AND
      // after the owning add (if this is an optimistic line), so a prior
      // mutation for this same line runs first and the delete becomes the
      // final authoritative mutation. flushQuantityUpdates() also pushes
      // other lines' pending edits onto the shared chain.
      const priorSync = flushQuantityUpdates();

      const deletion = priorSync
        .catch(() => {
          // Ignore earlier sync failures; the delete is authoritative here.
        })
        .then(async () => {
          let realId: string | null = lineItemId;
          if (isOptimisticId(lineItemId)) {
            realId = tempToReal.current.get(lineItemId) ?? null;
          }
          // null => the owning add failed; there is nothing on the backend
          // to remove.
          if (realId == null) return;
          await removeCartItemService(realId);
        })
        .catch(async (err) => {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to remove cart item."
          );

          // Restore the authoritative backend cart.
          const realCart = await getCart();
          writeCart(realCart);

          throw err instanceof Error
            ? err
            : new Error("Failed to remove cart item.");
        });

      pendingDeletes.current.set(lineItemId, deletion);

      // Drop the map entry once settled, without altering `deletion`'s state.
      void deletion
        .finally(() => {
          pendingDeletes.current.delete(lineItemId);
        })
        .catch(() => {
          // Failure already handled above; swallow here to avoid an
          // unhandled rejection on this cleanup chain.
        });

      // Advance the shared mutation chain, but never leave it rejected.
      pendingCartSync.current = deletion.then(
        () => {},
        () => {}
      );

      // removeItem itself resolves once the delete settles; failure is
      // surfaced via `error` state and re-thrown through waitForCartSync().
      await deletion.then(
        () => {},
        () => {}
      );
    },
    [flushQuantityUpdates, writeCart]
  );

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const updated = await getCart();
      writeCart(updated);
    } finally {
      setIsLoading(false);
    }
  }, [writeCart]);

  const waitForCartSync = useCallback(async () => {
    // 1. Snapshot every mutation in flight right now — BEFORE any await, so a
    //    request that settles (and cleans itself up) mid-wait is still checked
    //    for failure below.
    const adds = Array.from(pendingAdds.current, (p) => p.promise);
    const deletions = Array.from(pendingDeletes.current.values());

    // 2. Flush debounced quantity edits onto the mutation chain, then wait for
    //    the tail of the serialized chain (covers in-flight quantity syncs,
    //    adds and deletes, in order).
    await flushQuantityUpdates();
    await pendingCartSync.current;

    // 3. Wait for every pending add and delete to settle on the backend.
    const results = await Promise.allSettled([...adds, ...deletions]);

    // 4. If any of them failed, the authoritative cart was already restored
    //    and `error` set — re-throw so checkout does not proceed on a stale
    //    assumption about what is in the cart.
    const rejected = results.find(
      (r): r is PromiseRejectedResult => r.status === "rejected"
    );

    if (rejected) {
      throw rejected.reason instanceof Error
        ? rejected.reason
        : new Error("Failed to synchronize cart.");
    }
  }, [flushQuantityUpdates]);

  const totalQuantity =
    cart?.totalQuantity ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        totalQuantity,
        isLoading,
        error,
        addItem,
        updateItem,
        removeItem,
        refreshCart,
        waitForCartSync,

        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error(
      "useCart must be used within a CartProvider."
    );
  }

  return ctx;
}
