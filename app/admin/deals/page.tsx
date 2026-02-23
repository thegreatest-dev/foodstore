"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/types/product";
import { getProducts } from "@/app/lib/products";
import { getDealProductIds, saveDealProductIds } from "@/app/lib/deals";

const MAX_DEALS = 4;

export default function AdminDealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function bootstrap() {
      setLoading(true);
      try {
        const [productsResult, dealsResult] = await Promise.allSettled([
          getProducts(),
          getDealProductIds(),
        ]);

        if (productsResult.status === "fulfilled") {
          setProducts(productsResult.value);
        } else {
          console.error(productsResult.reason);
          setError("We couldn't load the product catalog. Please refresh.");
        }

        if (dealsResult.status === "fulfilled") {
          setSelectedIds(dealsResult.value);
        } else {
          console.error(dealsResult.reason);
          setError((prev) => prev ?? "Unable to load current deals. Please refresh.");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load current deals. Please refresh.");
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, []);

  const selectedProducts = useMemo(
    () =>
      selectedIds
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is Product => Boolean(product)),
    [selectedIds, products]
  );

  const filteredProducts = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) {
      return products;
    }

    return products.filter((product) => {
      const category = product.category ? product.category.toLowerCase() : "";
      return (
        product.name.toLowerCase().includes(needle) ||
        category.includes(needle)
      );
    });
  }, [products, search]);

  const toggleDeal = (productId: string) => {
    setSuccess(false);
    setSelectedIds((prev) => {
      if (prev.includes(productId)) {
        setError(null);
        return prev.filter((id) => id !== productId);
      }

      if (prev.length >= MAX_DEALS) {
        setError(`You can only feature ${MAX_DEALS} products at a time.`);
        return prev;
      }

      setError(null);
      return [...prev, productId];
    });
  };

  const moveDeal = (index: number, direction: -1 | 1) => {
    setSelectedIds((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      const temp = next[index];
      next[index] = next[nextIndex];
      next[nextIndex] = temp;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await saveDealProductIds(selectedIds);
      setSuccess(true);
    } catch {
      setError("We couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-5 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Deal of the Week</h1>
          <p className="text-xs text-gray-400">Select up to {MAX_DEALS} featured products.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Deals updated successfully.
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Current Selection</h2>
            <p className="text-sm text-gray-500">
              {selectedIds.length} of {MAX_DEALS} slots filled.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                Save changes
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-10">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Loading selection...</div>
          ) : selectedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-gray-400 text-sm">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7l9-4 9 4m-9 4v9" />
              </svg>
              <p>No products selected yet. Add one from the list below.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              {selectedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-3"
                >
                  <div className="flex flex-col gap-3">
                    <div className="relative h-24 w-full overflow-hidden rounded-xl bg-white">
                      <Image
                        src={product.image || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.category || "Uncategorized"}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => moveDeal(index, -1)}
                        disabled={index === 0}
                        className="rounded-full border border-gray-200 p-2 text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors disabled:opacity-40"
                        aria-label="Move up"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveDeal(index, 1)}
                        disabled={index === selectedProducts.length - 1}
                        className="rounded-full border border-gray-200 p-2 text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors disabled:opacity-40"
                        aria-label="Move down"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => toggleDeal(product.id)}
                        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">All Products</h2>
              <p className="text-sm text-gray-500">Tap Add to include a product in the weekly deal.</p>
            </div>
            <div className="relative w-full sm:w-80">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                className="w-full border border-gray-200 rounded-full pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No products match your search.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {filteredProducts.map((product) => {
                const isSelected = selectedIds.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className={`rounded-2xl border p-3 transition-colors ${
                      isSelected ? "border-green-300 bg-green-50" : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="relative h-24 w-full overflow-hidden rounded-xl bg-white">
                        <Image
                          src={product.image || "/placeholder.png"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.category || "Uncategorized"}</p>
                        <p className="text-sm text-gray-600 mt-1">₦{product.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => toggleDeal(product.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                          isSelected
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                      >
                        {isSelected ? "Remove" : "Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
