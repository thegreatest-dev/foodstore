import { Product } from "@/types/product";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 transition-shadow hover:shadow-lg">
      <div className="relative h-48 w-full mb-4">
        <Image
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
        {product.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
        <button
          onClick={() => onAddToCart?.(product)}
          className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
