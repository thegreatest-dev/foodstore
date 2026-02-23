import Image from "next/image";
import { Product } from "@/app/types/product";
import AddToCartButton from "@/app/components/AddToCartButton";

interface DealOfTheWeekProps {
  products: Product[];
}

export default function DealOfTheWeek({ products }: DealOfTheWeekProps) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400 text-sm">
        No deals this week yet — check back soon!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map((product) => {
        const showOriginal = (product.originalPrice ?? 0) > product.price;
        const discount = showOriginal
          ? Math.round(100 - (product.price / (product.originalPrice ?? product.price)) * 100)
          : null;

        return (
          <article
            key={product.id}
            className="group relative flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            {/* Discount badge */}
            {showOriginal && discount !== null && (
              <span className="absolute top-2.5 left-2.5 z-10 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                -{discount}%
              </span>
            )}

            {/* Image */}
            <div className="relative h-36 w-full overflow-hidden bg-gray-50">
              <Image
                src={product.image || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>

            {/* Body */}
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
      })}
    </div>
  );
}
