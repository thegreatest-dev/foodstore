import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
}

interface WishlistStore {
  items: WishlistProduct[];
  toggle: (product: WishlistProduct) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) =>
        set((state) =>
          state.items.some((p) => p.id === product.id)
            ? { items: state.items.filter((p) => p.id !== product.id) }
            : { items: [...state.items, product] }
        ),

      has: (id) => get().items.some((p) => p.id === id),

      remove: (id) =>
        set((state) => ({ items: state.items.filter((p) => p.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    { name: "wishlist-storage" }
  )
);
