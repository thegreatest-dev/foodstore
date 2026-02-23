"use client";

import { useMemo, useState } from "react";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { Product } from "@/app/types/product";

interface ProductDetailActionsProps {
  product: Product;
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.has(product.id));

  const inStock = product.stock > 0;

  const subtotal = useMemo(() => product.price * quantity, [product.price, quantity]);

  const addSelectedQuantity = () => {
    if (!inStock) return;
    for (let i = 0; i < quantity; i += 1) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
      });
    }
  };

  const buyNow = () => {
    addSelectedQuantity();
    openCart();
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400">Price</p>
          <p className="text-2xl font-extrabold text-gray-900">₦{product.price.toLocaleString()}</p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-sm text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</p>
          )}
        </div>
        <button
          onClick={() =>
            toggleWishlist({
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.image,
              category: product.category,
            })
          }
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            isWishlisted
              ? "border-red-300 bg-red-50 text-red-500"
              : "border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-600"
          }`}
        >
          <svg className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {isWishlisted ? "Saved" : "Save"}
        </button>
      </div>

      <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
        <span className="text-sm font-medium text-gray-600">Quantity</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-600"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-[2ch] text-center font-bold text-gray-900">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-600"
            aria-label="Increase quantity"
            disabled={!inStock}
          >
            +
          </button>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 text-xs text-orange-700">
        Subtotal: <span className="font-bold">₦{subtotal.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          onClick={addSelectedQuantity}
          disabled={!inStock}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500 px-4 py-2.5 text-sm font-semibold text-green-600 transition-colors hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
          </svg>
          Add to Cart
        </button>
        <button
          onClick={buyNow}
          disabled={!inStock}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Buy Now
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
