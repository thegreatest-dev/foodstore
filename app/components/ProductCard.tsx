"use client";


import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { useEffect, useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  category?: string;
  buttonColor?: "green" | "orange";
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  rating,
  image,
  category,
  buttonColor = "green",
}: ProductCardProps) {
  const { addItem, removeItem, updateQuantity, items } = useCartStore();
  const { toggle: toggleWishlist, has: inWishlist } = useWishlistStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const wished = mounted ? inWishlist(id) : false;

  const cartItem = items.find((item) => item.product.id === id);
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem({ id, name, price, originalPrice, image, category });
  };

  const handleIncrease = () => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      removeItem(id);
    } else {
      updateQuantity(id, quantity - 1);
    }
  };

  const bgColor = buttonColor === "green" ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600";

  return (
    <div className="group bg-white rounded-2xl p-3 sm:p-6 border border-gray-200 hover:shadow-xl hover:border-green-500 transition-all duration-300 relative">
      {/* Quick Actions - Show on hover */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        {mounted && (
          <button
            onClick={() => toggleWishlist({ id, name, price, originalPrice, image, category })}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border flex items-center justify-center transition-all ${
              wished
                ? "border-red-400 bg-red-50"
                : "border-gray-200 hover:bg-green-50 hover:border-green-500"
            }`}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                wished ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-green-500"
              }`}
              fill={wished ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
        <Link
          href={`/products/${id}`}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-green-50 hover:border-green-500 transition-all"
          aria-label="Quick view"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Link>
      </div>

      {/* Product Image */}
      <Link href={`/products/${id}`} className="block">
        <div className="relative mb-2 sm:mb-4 h-28 sm:h-48 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <Image
            src={image}
            alt={name}
            width={200}
            height={200}
            className="object-contain h-full w-auto"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="space-y-1 sm:space-y-2">
        {category && (
          <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide truncate">{category}</p>
        )}
        <Link href={`/products/${id}`}>
          <h4 className="text-xs sm:text-product-name font-semibold text-gray-900 hover:text-green-500 transition-colors line-clamp-2 leading-snug">
            {name}
          </h4>
        </Link>

        {/* Price and Rating */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-xl font-bold text-gray-900 truncate">₦{price.toLocaleString()}</span>
            {originalPrice && (
              <span className="text-[10px] sm:text-sm text-gray-400 line-through truncate">₦{originalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center gap-0.5 text-orange-500 text-xs shrink-0">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="hidden sm:inline">{rating}k</span>
          </div>
        </div>

        {/* Add to Cart Button / Quantity Controls */}
        {quantity > 0 ? (
          <div className="flex items-center justify-center gap-2 sm:gap-3 border-2 border-green-500 rounded-full py-1.5 sm:py-3 bg-green-50">
            <button
              onClick={handleDecrease}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
              aria-label="Decrease quantity"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="font-bold text-green-500 text-sm min-w-[2ch] text-center">{quantity}</span>
            <button
              onClick={handleIncrease}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
              aria-label="Increase quantity"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className={`w-full ${bgColor} text-white py-2 sm:py-3 rounded-full text-xs sm:text-button transition-all duration-300 inline-flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 relative overflow-hidden group/btn`}
          >
            {/* Animated background overlay */}
            <span className={`absolute inset-0 ${buttonColor === "green" ? "bg-green-600" : "bg-orange-600"} transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out rounded-full`}></span>
            <span className="relative z-10 inline-flex items-center justify-center gap-1.5 sm:gap-2">
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
