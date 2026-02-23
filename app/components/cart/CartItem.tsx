import { Product } from "@/app/types/product";
import Image from "next/image";

interface CartItemProps {
  product: Product;
  quantity: number;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemove?: (productId: string) => void;
}

export default function CartItem({
  product,
  quantity,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 py-4">
      <div className="relative h-20 w-20 flex-shrink-0">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          ₦{product.price.toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity?.(product.id, quantity - 1)}
          disabled={quantity <= 1}
          className="h-8 w-8 rounded border border-zinc-300 dark:border-zinc-700 disabled:opacity-50"
        >
          -
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button
          onClick={() => onUpdateQuantity?.(product.id, quantity + 1)}
          className="h-8 w-8 rounded border border-zinc-300 dark:border-zinc-700"
        >
          +
        </button>
      </div>
      <button
        onClick={() => onRemove?.(product.id)}
        className="text-red-600 hover:text-red-700 dark:text-red-400"
      >
        Remove
      </button>
    </div>
  );
}
