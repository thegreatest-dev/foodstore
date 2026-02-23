"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { useCartStore } from "@/app/store/cartStore";

export default function WishlistPage() {
  const { items, toggle } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 to-orange-50 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-400">
            ♥ My Favourites
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Your{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-green-500">Wishlist</span>
              <span className="absolute bottom-0 left-0 h-2.5 w-full rounded-full bg-green-100 -z-10" />
            </span>
          </h1>
          <p className="mt-3 text-gray-400 text-sm max-w-md mx-auto">
            {items.length === 0
              ? "You haven't saved any products yet."
              : `You have ${items.length} saved product${items.length !== 1 ? "s" : ""}.`}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-sm">No favourites yet — browse products and click the heart icon.</p>
            <Link
              href="/products"
              className="mt-2 inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors"
            >
              Browse Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {items.map((product) => {
                const showOriginal = (product.originalPrice ?? 0) > product.price;
                const discount = showOriginal
                  ? Math.round(100 - (product.price / (product.originalPrice ?? product.price)) * 100)
                  : null;

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-28 sm:h-44 w-full bg-gray-50 overflow-hidden">
                      {showOriginal && discount !== null && (
                        <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          -{discount}%
                        </span>
                      )}
                      <button
                        onClick={() => toggle(product)}
                        aria-label="Remove from wishlist"
                        className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white shadow border border-red-200 flex items-center justify-center hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4 text-red-500 fill-red-500" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <Image
                        src={product.image || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-2.5 sm:p-4 gap-1.5 sm:gap-2">
                      {product.category && (
                        <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-orange-400 truncate">
                          {product.category}
                        </p>
                      )}
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>

                      <div className="mt-auto pt-2 sm:pt-3 flex items-center justify-between gap-1">
                        <div className="min-w-0">
                          <p className="text-sm sm:text-base font-bold text-gray-900 leading-none truncate">
                            ₦{product.price.toLocaleString()}
                          </p>
                          {showOriginal && (
                            <p className="mt-0.5 text-[10px] sm:text-[11px] text-gray-400 line-through truncate">
                              ₦{(product.originalPrice ?? 0).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => addItem(product)}
                          aria-label="Add to cart"
                          className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow hover:bg-green-600 active:scale-95 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 border border-green-500 text-green-600 px-6 py-3 rounded-full text-sm font-semibold hover:bg-green-500 hover:text-white transition-colors"
              >
                Continue Shopping
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
