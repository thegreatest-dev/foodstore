import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailActions from "@/app/components/product/ProductDetailActions";
import { getProductById, getProducts } from "@/app/lib/products";

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id).catch(() => null);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts().catch(() => []);
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const rating = product.rating ?? 4.5;
  const showOriginal = (product.originalPrice ?? 0) > product.price;
  const discount = showOriginal
    ? Math.round(100 - (product.price / (product.originalPrice ?? product.price)) * 100)
    : null;
  const mainImage = product.image?.trim() ? product.image : "/images/fresh.jfif";

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <span>•</span>
          <Link href="/products" className="hover:text-green-600">Products</Link>
          <span>•</span>
          <span className="text-gray-600">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="relative h-[320px] w-full bg-gray-100 sm:h-[420px] lg:h-[520px]">
              {showOriginal && discount !== null && (
                <span className="absolute left-4 top-4 z-10 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow">
                  Save {discount}%
                </span>
              )}
              <Image
                src={mainImage}
                alt={product.name}
                fill
                priority
                unoptimized
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-500">
              {product.category || "Featured"}
            </div>
            <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-orange-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill={i < Math.round(rating) ? "currentColor" : "none"} stroke="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-600">{rating.toFixed(1)} rating</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <p className="text-base leading-relaxed text-gray-600">
              {product.description || "Premium quality product sourced fresh and delivered with care."}
            </p>

            <ProductDetailActions product={product} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-gray-900">Related Products</h2>
          <Link href="/products" className="text-sm font-semibold text-green-600 hover:text-green-700">View all</Link>
        </div>

        {relatedProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-400">
            No related products yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-40 w-full bg-gray-100">
                  <Image
                    src={item.image?.trim() ? item.image : "/images/fresh.jfif"}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-orange-500">{item.category || "Related"}</p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">{item.name}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-base font-bold text-gray-900">₦{item.price.toLocaleString()}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-500">
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {(item.rating ?? 4.5).toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
