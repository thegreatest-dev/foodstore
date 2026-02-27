import Link from "next/link";
import { Suspense } from "react";
import ProductCard from "@/app/components/ProductCard";
import SortSelect from "@/app/components/SortSelect";
import PriceRangeFilter from "@/app/components/PriceRangeFilter";
import { matchesPriceRange, PriceRangeKey } from "@/app/lib/price-ranges";
import { getProducts } from "@/app/lib/products";
import { CATEGORIES, SLUG_TO_CATEGORY } from "@/app/lib/categories";
// ---------------------------------------------------------------------------
// Server component – fetches data from Firestore on every request.
// ---------------------------------------------------------------------------

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; price?: string | string[] }>;
}) {
  const params = await searchParams;
  const categorySlug = params?.category ?? null;
  const sortParam = params?.sort ?? "featured";
  const rawPrice = params?.price;
  const selectedPriceRanges: string[] = rawPrice
    ? Array.isArray(rawPrice)
      ? rawPrice
      : [rawPrice]
    : [];

  // Translate URL slug (e.g. "rice-grains") → Firestore name (e.g. "Rice & Grains")
  const categoryName = categorySlug ? SLUG_TO_CATEGORY[categorySlug] ?? null : null;

  // Fetch ALL products from Firestore (one read), then filter in-memory so the
  // sidebar can show accurate per-category counts without extra reads.
  const allProducts = await getProducts().catch(() => []);

  const baseFiltered = categoryName
    ? allProducts.filter((p) => p.category === categoryName)
    : allProducts;

  const priceFiltered =
    selectedPriceRanges.length > 0
      ? baseFiltered.filter((p) =>
          selectedPriceRanges.some((range) =>
            matchesPriceRange(p.price, range as PriceRangeKey)
          )
        )
      : baseFiltered;

  const filteredProducts = [...priceFiltered].sort((a, b) => {
    switch (sortParam) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        return (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0);
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0);
      default:
        return 0;
    }
  });

  // Build sidebar counts from live data
  const countMap = new Map<string, number>();
  allProducts.forEach((p) => {
    countMap.set(p.category, (countMap.get(p.category) ?? 0) + 1);
  });

  const sidebarCategories = CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.name,
    count: countMap.get(cat.name) ?? 0,
  })).filter((cat) => cat.count > 0);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto" />
            <p className="text-body text-gray-600 mt-4">Loading products...</p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb + header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-green-500">Home</Link>
              <span>/</span>
              <span className="text-gray-900">Products</span>
              {categoryName && (
                <>
                  <span>/</span>
                  <span className="text-gray-900">{categoryName}</span>
                </>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-section-title font-bold mb-2">
                  {categoryName ?? "All Products"}
                </h1>
                <p className="text-body text-gray-600">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"} found
                </p>
              </div>
              {categorySlug && (
                <Link
                  href="/products"
                  className="text-body text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-2"
                >
                  Clear Filter
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* ── Mobile-only filter strip ───────────────────────────── */}
          <div className="lg:hidden mb-5 space-y-2">
            {/* Scrollable category chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:'none'}}>
              <Link
                href="/products"
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  !categorySlug
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-600 border-gray-300 hover:border-green-400 hover:text-green-600"
                }`}
              >
                All
              </Link>
              {sidebarCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    categorySlug === cat.id
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-600 border-gray-300 hover:border-green-400 hover:text-green-600"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Collapsible price filter */}
            <details className="rounded-xl border border-gray-200 bg-gray-50">
              <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-sm font-semibold text-gray-800">
                <span className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                  </svg>
                  Price Range
                  {selectedPriceRanges.length > 0 && (
                    <span className="rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {selectedPriceRanges.length}
                    </span>
                  )}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-3 pt-1">
                <Suspense fallback={null}>
                  <PriceRangeFilter selectedRanges={selectedPriceRanges} />
                </Suspense>
                {selectedPriceRanges.length > 0 && (
                  <Link
                    href={`/products?${new URLSearchParams(
                      [...(categorySlug ? [["category", categorySlug]] : []), ...(sortParam !== "featured" ? [["sort", sortParam]] : [])] as [string, string][]
                    ).toString()}`}
                    className="mt-2 block text-xs font-semibold text-green-600 hover:text-green-700"
                  >
                    Clear price filter
                  </Link>
                )}
              </div>
            </details>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar – desktop only */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-product-name font-bold mb-4">Categories</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/products"
                      className={`text-body flex items-center justify-between hover:text-green-500 transition-colors ${
                        !categorySlug ? "text-green-500 font-semibold" : "text-gray-700"
                      }`}
                    >
                      <span>All Products</span>
                      <span className="text-sm text-gray-400">{allProducts.length}</span>
                    </Link>
                  </li>
                  {sidebarCategories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/products?category=${cat.id}`}
                        className={`text-body flex items-center justify-between hover:text-green-500 transition-colors ${
                          categorySlug === cat.id ? "text-green-500 font-semibold" : "text-gray-700"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-sm text-gray-400">{cat.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range filter */}
              <div className="bg-gray-50 rounded-2xl p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-product-name font-bold">Price Range</h3>
                  {selectedPriceRanges.length > 0 && (
                    <Link
                      href={`/products?${new URLSearchParams(
                        [...(categorySlug ? [["category", categorySlug]] : []), ...(sortParam !== "featured" ? [["sort", sortParam]] : [])] as [string, string][]
                      ).toString()}`}
                      className="text-xs text-green-600 hover:text-green-700 font-semibold"
                    >
                      Clear
                    </Link>
                  )}
                </div>
                <PriceRangeFilter selectedRanges={selectedPriceRanges} />
              </div>
            </div>

            {/* Products grid */}
            <div className="col-span-1 lg:col-span-3">
              {/* Sort & view toggle */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-body text-gray-600">
                  <span>Sort by:</span>
                  <SortSelect />
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      rating={product.rating ?? 0}
                      image={product.image}
                      category={product.category}
                      specifications={product.specifications}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-product-name font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-body text-gray-600 mb-4">
                    {categoryName
                      ? `No products in "${categoryName}" yet.`
                      : "No products available."}
                  </p>
                  {categorySlug && (
                    <Link href="/products" className="text-button text-green-600 hover:text-green-700 font-semibold">
                      View all products
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
