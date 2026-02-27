
"use client";

import { Product } from "@/app/types/product";
import Image from "next/image";
import { useState } from "react";
import { ProductSpecification } from "@/app/types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedSpecIdx, setSelectedSpecIdx] = useState(0);
  const hasSpecs = product.specifications && product.specifications.length > 0;
  const displayPrice = hasSpecs ? (product.specifications ?? [])[selectedSpecIdx]?.price : product.price;
  const displayLabel = hasSpecs ? (product.specifications ?? [])[selectedSpecIdx]?.label : undefined;

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2 transition-shadow hover:shadow-md bg-white dark:bg-zinc-900">
      <div className="w-full bg-gray-50 dark:bg-zinc-800 rounded-md overflow-hidden shadow-sm flex items-center justify-center aspect-square">
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

        <h3 className="text-sm font-semibold leading-tight">{product.name}</h3>

        {(product.description) && (
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{product.description}</p>
        )}

        {hasSpecs && (
          <div className="mt-2">
            <select
              className="border border-gray-200 rounded px-2 py-1 text-xs w-full"
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
            <span className="text-sm font-bold text-emerald-600">₦{displayPrice?.toLocaleString()}</span>
            {product.rating && product.rating > 0 && (
              <span className="text-[11px] text-zinc-500">★ {product.rating}</span>
            )}
          </div>

          <button
            onClick={() => onAddToCart?.({ ...product, price: displayPrice, name: displayLabel ? `${product.name} (${displayLabel})` : product.name })}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1 rounded-full"
            aria-label={`Add ${product.name} to cart`}
          >
            <span className="text-sm">＋</span>
            <span className="text-[12px]">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
