import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category?: string;
  specification?: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: CartProduct) => void;
  removeItem: (productId: string, specification?: string) => void;
  updateQuantity: (productId: string, quantity: number, specification?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product.id === product.id &&
              item.product.specification === product.specification
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id &&
                item.product.specification === product.specification
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { product, quantity: 1 }],
            isOpen: true,
          };
        }),

      removeItem: (productId, specification) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.product.specification === specification)
          ),
        })),

      updateQuantity: (productId, quantity, specification) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (item) => !(item.product.id === productId && item.product.specification === specification)
                )
              : state.items.map((item) =>
                  item.product.id === productId && item.product.specification === specification
                    ? { ...item, quantity }
                    : item
                ),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
