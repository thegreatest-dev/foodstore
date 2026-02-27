
"use client";

import { Product } from "@/app/types/product";
import Image from "next/image";
import { useState } from "react";
import { ProductSpecification } from "@/app/types/product";
import { useCartStore } from "@/app/store/cartStore";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [selectedSpecIdx, setSelectedSpecIdx] = useState(0);
  const hasSpecs = product.specifications && product.specifications.length > 0;
  const displayPrice = hasSpecs ? (product.specifications ?? [])[selectedSpecIdx]?.price : product.price;
  const displayLabel = hasSpecs ? (product.specifications ?? [])[selectedSpecIdx]?.label : undefined;

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 sm:p-4 transition-shadow hover:shadow-md bg-white dark:bg-zinc-900">
      <div className="w-full bg-gray-50 dark:bg-zinc-800 rounded-md overflow-hidden shadow-sm flex items-center justify-center aspect-square h-36 sm:h-48">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-contain p-3"
        />
      </div>

      <div className="mt-2">
        {product.category && (
          <div className="text-[10px] uppercase text-zinc-400 mb-1">{product.category}</div>
        )}

        <h3 className="text-sm sm:text-base font-semibold leading-tight">{product.name}</h3>

        {(product.description) && (
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{product.description}</p>
        )}

        {hasSpecs && (
          <div className="mt-2">
            <select
              className="border border-gray-200 rounded px-3 py-2 text-sm w-full"
              value={selectedSpecIdx}
              onChange={e => setSelectedSpecIdx(Number(e.target.value))}
            >
              {(product.specifications ?? []).map((spec, idx) => (
                <option key={idx} value={idx}>{spec.label} - ₦{spec.price.toLocaleString()}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-emerald-600">₦{displayPrice?.toLocaleString()}</span>
            {product.rating && product.rating > 0 && (
              <span className="text-[11px] text-zinc-500">★ {product.rating}</span>
            )}
          </div>
            {hasSpecs && (
              <div className="text-[11px] text-zinc-500 mt-1">Options: {(product.specifications ?? []).length}</div>
            )}
          <button
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                price: displayPrice,
                originalPrice: product.originalPrice,
                image: product.image,
                category: product.category,
                specification: displayLabel,
              })
            }
            className="w-full sm:w-auto inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-3 py-2 rounded-full justify-center"
            aria-label={`Add ${product.name} to cart`}
          >
            <span className="text-sm">＋</span>
            <span className="text-sm">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
