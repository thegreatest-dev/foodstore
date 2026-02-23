"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, deleteProduct } from "@/app/lib/products";
import { Product } from "@/app/types/product";
import ProductForm from "./ProductForm";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      // collection may be empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const closeForm = () => { setShowAdd(false); setEditing(null); fetchProducts(); };

  if (showAdd || editing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center gap-3">
          <button onClick={closeForm} className="text-gray-400 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {editing ? "Edit Product" : "Add New Product"}
          </h1>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8">
            <ProductForm initial={editing ? { ...editing, originalPrice: editing.originalPrice ?? 0, rating: editing.rating ?? 0 } : undefined} onSuccess={closeForm} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Products</h1>
            <p className="text-xs text-gray-400">{products.length} total</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Search */}
        <div className="mb-6 relative max-w-sm">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
            <p className="text-sm">{search ? "No products match your search." : "No products yet. Add your first one!"}</p>
          </div>
        ) : (
          <>
            <div className="md:hidden space-y-3">
              {filtered.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} width={44} height={44} className="object-contain w-11 h-11" />
                      ) : (
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{product.category || "Uncategorized"}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-2">₦{product.price.toFixed(2)}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.stock > 10 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                      {product.stock}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditing(product)}
                      className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 bg-white hover:border-green-400 hover:text-green-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                      className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-600 bg-white hover:border-red-400 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                      {deleting === product.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block bg-white overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
              <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="text-left px-6 py-4 font-semibold">Product</th>
                  <th className="text-left px-4 py-4 font-semibold">Category</th>
                  <th className="text-right px-4 py-4 font-semibold">Price</th>
                  <th className="text-right px-4 py-4 font-semibold">Stock</th>
                  <th className="text-right px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {product.image ? (
                            <Image src={product.image} alt={product.name} width={40} height={40} className="object-contain w-9 h-9" />
                          ) : (
                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">{product.category}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-semibold text-gray-900">₦{product.price.toFixed(2)}</p>
                      {(product.originalPrice ?? 0) > 0 && (product.originalPrice ?? 0) > product.price && (
                        <p className="text-xs text-gray-400 line-through">₦{(product.originalPrice ?? 0).toFixed(2)}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.stock > 10 ? "bg-green-100 text-green-700" : product.stock > 0 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditing(product)}
                          className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-green-400 hover:text-green-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        >
                          {deleting === product.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
