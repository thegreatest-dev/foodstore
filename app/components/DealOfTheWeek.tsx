"use client";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/app/types/product";
import AddToCartButton from "@/app/components/AddToCartButton";

interface DealOfTheWeekProps {
  products: Product[];
  allProducts?: Product[];
}

function ProductCard({ product }: { product: Product }) {
  const showOriginal = (product.originalPrice ?? 0) > product.price;
  const discount = showOriginal
    ? Math.round(100 - (product.price / (product.originalPrice ?? product.price)) * 100)
    : null;
  return (
    <article className="group relative flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {showOriginal && discount !== null && (
        <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
          -{discount}%
        </span>
      )}
      <div className="relative h-36 w-full overflow-hidden bg-gray-50">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, 50vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-400">
          {product.category || "Trending"}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 leading-snug">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <p className="text-base font-bold text-gray-900 leading-none">
              ₦{product.price.toLocaleString()}
            </p>
            {showOriginal && (
              <p className="mt-0.5 text-[11px] text-gray-400 line-through">
                ₦{(product.originalPrice ?? 0).toLocaleString()}
              </p>
            )}
          </div>
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.image,
              category: product.category,
            }}
          />
        </div>
      </div>
    </article>
  );
}

export default function DealOfTheWeek({ products, allProducts = [] }: DealOfTheWeekProps) {
  const [activeTab, setActiveTab] = useState<"deals" | "all">("deals");

  if (!products || products.length === 0) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400 text-sm">
        No deals this week yet — check back soon!
      </div>
    );
  }

  // Mobile: show first 4 deals (2×2) and first 8 all-products (4 rows × 2 cols)
  const mobileDeals = products.slice(0, 4);
  const mobileAll = allProducts.slice(0, 8);

  return (
    <div>
      {/* ── Mobile Tab Switcher (hidden on lg+) ── */}
      <div className="flex lg:hidden rounded-xl overflow-hidden border border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("deals")}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "deals"
              ? "bg-green-500 text-white"
              : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          Current Selection
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "all"
              ? "bg-green-500 text-white"
              : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          All Products
        </button>
      </div>

      {/* ── Mobile: Current Selection (2×2 = 4 items) ── */}
      {activeTab === "deals" && (
        <div className="grid grid-cols-2 gap-4 lg:hidden">
          {mobileDeals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* ── Mobile: All Products (2 cols × 4 rows = 8 items) ── */}
      {activeTab === "all" && (
        <div className="grid grid-cols-2 gap-4 lg:hidden">
          {mobileAll.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* ── Desktop: deal products in 4 columns (no tabs) ── */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
