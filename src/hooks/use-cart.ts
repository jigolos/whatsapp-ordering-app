"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  itemNote?: string;
};

type CartState = {
  shopSlug: string | null;
  items: CartItem[];
  setShop: (slug: string) => void;
  addItem: (shopSlug: string, item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      shopSlug: null,
      items: [],
      setShop: (slug) => set({ shopSlug: slug }),
      addItem: (shopSlug, item) =>
        set((state) => {
          const resetCart = state.shopSlug && state.shopSlug !== shopSlug;
          const baseItems = resetCart ? [] : state.items;
          const existing = baseItems.find((entry) => entry.productId === item.productId);

          if (existing) {
            return {
              shopSlug,
              items: baseItems.map((entry) =>
                entry.productId === item.productId
                  ? { ...entry, quantity: entry.quantity + 1 }
                  : entry,
              ),
            };
          }

          return {
            shopSlug,
            items: [...baseItems, { ...item, quantity: 1 }],
          };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.productId !== productId)
              : state.items.map((item) =>
                  item.productId === productId ? { ...item, quantity } : item,
                ),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      clear: () => set({ shopSlug: null, items: [] }),
    }),
    {
      name: "shop-cart",
    },
  ),
);
