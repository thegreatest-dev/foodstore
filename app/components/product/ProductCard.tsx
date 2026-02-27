
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
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 transition-shadow hover:shadow-md bg-white dark:bg-zinc-900 flex flex-col gap-3">
      <div className="w-full bg-gray-50 dark:bg-zinc-800 rounded-md overflow-hidden shadow-sm flex items-center justify-center aspect-square">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-contain p-3"
        />
      </div>

      <div className="flex flex-col gap-2 mt-1">
        {product.category && (
          <div className="text-[10px] uppercase text-zinc-400" style={{lineHeight:1.5}}>{product.category}</div>
        )}

        <h3 className="text-sm font-semibold" style={{lineHeight:1.5}}>{product.name}</h3>

        {(product.description) && (
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2" style={{lineHeight:1.5}}>{product.description}</p>
        )}

        {hasSpecs && (
          <div className="mt-1">
            <select
              className="border border-gray-200 rounded px-2 py-1 text-xs w-full"
              value={selectedSpecIdx}
              onChange={e => setSelectedSpecIdx(Number(e.target.value))}
              style={{lineHeight:1.5}}
            >
              {(product.specifications ?? []).map((spec, idx) => (
                <option key={idx} value={idx}>{spec.label} - ₦{spec.price.toLocaleString()}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center justify-between mt-2 gap-3">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="text-sm font-bold text-emerald-600" style={{lineHeight:1.5}}>₦{displayPrice?.toLocaleString()}</span>
            {originalPrice && (
              <span className="text-xs text-zinc-400 line-through" style={{lineHeight:1.5}}>₦{originalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {product.rating && product.rating > 0 && (
              <span className="text-[13px] text-orange-500 flex items-center gap-1" style={{lineHeight:1.5}}>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                {product.rating}
              </span>
            )}
            <button
              onClick={() => onAddToCart?.({ ...product, price: displayPrice, name: displayLabel ? `${product.name} (${displayLabel})` : product.name })}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1 rounded-full"
              aria-label={`Add ${product.name} to cart`}
              style={{lineHeight:1.5}}
            >
              <span className="text-sm">＋</span>
              <span className="text-[12px]">Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
