"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } =
    useCartStore();

  const subtotal = getTotal();
  const itemCount = getItemCount();
  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500">Add some products to get started.</p>
        </div>
        <Link
          href="/products"
          className="bg-green-500 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-green-600 transition-colors shadow-lg"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-500 text-sm mt-1">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">

            {/* Column labels */}
            <div className="hidden md:grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">
              <span className="col-span-6">Product</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Total</span>
            </div>

            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 grid grid-cols-12 gap-4 items-center group"
              >
                {/* Image + Name */}
                <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="object-contain w-14 h-14"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    {item.product.category && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.product.category}</p>
                    )}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors mt-1 flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>

                {/* Unit Price */}
                <div className="col-span-4 md:col-span-2 text-center">
                  <p className="text-xs text-gray-400 md:hidden mb-0.5">Price</p>
                  <div>
                    <span className="font-semibold text-gray-900">₦{item.product.price.toLocaleString()}</span>
                    {item.product.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">₦{item.product.originalPrice.toLocaleString()}</p>
                    )}
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-4 md:col-span-2 flex items-center justify-center">
                  <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                      aria-label="Decrease"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-sm font-bold text-gray-900 min-w-[1.5ch] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                      aria-label="Increase"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Line Total */}
                <div className="col-span-4 md:col-span-2 text-right">
                  <p className="text-xs text-gray-400 md:hidden mb-0.5">Total</p>
                  <span className="font-bold text-gray-900">
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors mt-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? "text-green-600" : "text-gray-900"}`}>
                    {shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`}
                  </span>
                </div>

                {/* Free shipping progress */}
                {subtotal < SHIPPING_THRESHOLD && (
                  <div className="bg-orange-50 rounded-xl px-4 py-3 text-xs text-orange-700">
                    Add <span className="font-bold">₦{(SHIPPING_THRESHOLD - subtotal).toLocaleString()}</span> more for free shipping
                    <div className="mt-2 h-1.5 bg-orange-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full bg-green-500 text-white text-center py-4 rounded-full font-semibold hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl text-base"
              >
                Proceed to Checkout
              </Link>

              {/* Trust badges */}
              <div className="mt-5 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure checkout
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Protected
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

