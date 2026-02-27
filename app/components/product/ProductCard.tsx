
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
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2 transition-shadow hover:shadow-lg max-w-xs text-[70%]">
      <div className="relative h-32 w-full mb-2">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <h3 className="text-base font-semibold mb-1">{product.name}</h3>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
        {product.description}
      </p>
      {hasSpecs && (
        <div className="mb-1">
          <label className="block text-[70%] text-gray-500 mb-0.5">Choose size/specification:</label>
          <select
            className="border border-gray-200 rounded px-1 py-0.5 text-xs"
            value={selectedSpecIdx}
            onChange={e => setSelectedSpecIdx(Number(e.target.value))}
          >
            {(product.specifications ?? []).map((spec, idx) => (
              <option key={idx} value={idx}>{spec.label} - ₦{spec.price.toLocaleString()}</option>
            ))}
          </select>
        </div>
      )}
      <div className="flex items-center justify-between mt-1">
        <span className="text-lg font-bold">₦{displayPrice.toLocaleString()}</span>
        <button
          onClick={() => onAddToCart?.({ ...product, price: displayPrice, name: displayLabel ? `${product.name} (${displayLabel})` : product.name })}
          className="rounded bg-zinc-900 px-2 py-1 text-xs text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
