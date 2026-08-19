"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import {
  addToCart as addToCartService,
  getCart,
  removeCartItem as removeCartItemService,
  updateCartItem as updateCartItemService,
  type CartSummary,
} from "@/lib/cart";

interface CartContextValue {
  cart: CartSummary | null;
  totalQuantity: number;
  isLoading: boolean;
  error: string | null;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Shares one Medusa cart across the whole app (Header's count, product page
 * Add to Cart) without a state-management library — just React Context
 * around the centralized service in src/lib/cart.ts.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCart()
      .then((existing) => {
        if (!cancelled) setCart(existing);
      })
      .catch(() => {
        // No cart yet, or the stored ID was stale — getCart() already
        // clears it; nothing further to do here.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      setCart(await addToCartService(variantId, quantity));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item to cart.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItem = useCallback(async (lineItemId: string, quantity: number) => {
    setIsLoading(true);
    setError(null);
    try {
      setCart(await updateCartItemService(lineItemId, quantity));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update cart item.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (lineItemId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      setCart(await removeCartItemService(lineItemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove cart item.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const totalQuantity = cart?.totalQuantity ?? 0;

  return (
    <CartContext.Provider
      value={{ cart, totalQuantity, isLoading, error, addItem, updateItem, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider.");
  }
  return ctx;
}
