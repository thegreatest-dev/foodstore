
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
  const displayPrice = hasSpecs ? product.specifications[selectedSpecIdx]?.price : product.price;
  const displayLabel = hasSpecs ? product.specifications[selectedSpecIdx]?.label : undefined;

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 transition-shadow hover:shadow-lg">
      <div className="relative h-48 w-full mb-4">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        {product.description}
      </p>
      {hasSpecs && (
        <div className="mb-2">
          <label className="block text-xs text-gray-500 mb-1">Choose size/specification:</label>
          <select
            className="border border-gray-200 rounded px-2 py-1 text-sm"
            value={selectedSpecIdx}
            onChange={e => setSelectedSpecIdx(Number(e.target.value))}
          >
            {product.specifications.map((spec, idx) => (
              <option key={idx} value={idx}>{spec.label} - ₦{spec.price.toLocaleString()}</option>
            ))}
          </select>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">₦{displayPrice.toLocaleString()}</span>
        <button
          onClick={() => onAddToCart?.({ ...product, price: displayPrice, name: displayLabel ? `${product.name} (${displayLabel})` : product.name })}
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
