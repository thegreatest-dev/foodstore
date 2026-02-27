"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/app/store/cartStore";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, getItemCount } =
    useCartStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">My Cart</h2>
            {mounted && itemCount > 0 && (
              <span className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Your cart is empty</p>
            <button
              onClick={closeCart}
              className="bg-green-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.product.specification ?? "default"}`}
                  className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 group"
                >
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={56}
                      height={56}
                      className="object-contain w-12 h-12"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">₦{item.product.price.toLocaleString()} each</p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.product.specification)}
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-500 hover:bg-green-50 transition-colors"
                        aria-label="Decrease"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-sm font-bold text-gray-900 min-w-[1.5ch] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.product.specification)}
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-500 hover:bg-green-50 transition-colors"
                        aria-label="Increase"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Line total + remove */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.product.id, item.product.specification)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                <span className="font-semibold text-gray-900">₦{total.toLocaleString()}</span>
              </div>

              {/* Free shipping indicator */}
              {total < 50 && (
                <div className="bg-orange-50 rounded-xl px-4 py-3 text-xs text-orange-700">
                  Add <span className="font-bold">₦{(50 - total).toLocaleString()}</span> more to get free shipping!
                </div>
              )}

              <Link
                href="/cart"
                onClick={closeCart}
                className="block w-full bg-green-500 text-white text-center py-3.5 rounded-full font-semibold hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full bg-gray-900 text-white text-center py-3.5 rounded-full font-semibold hover:bg-gray-700 transition-colors"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
