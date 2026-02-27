"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { addProduct, updateProduct } from "@/app/lib/products";

import { ProductSpecification } from "@/app/types/product";

export interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  specifications: ProductSpecification[];
}

const CATEGORIES = [
  "Rice & Grains",
  "Condiments & Spices",
  "Oils & Pantry Staples",
  "Beverages",
  "Pasta & Packaged Goods",
  "Proteins",
];

interface ProductFormProps {
  initial?: ProductFormData;
  onSuccess?: () => void;
}

const empty: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  originalPrice: 0,
  category: CATEGORIES[0],
  image: "",
  stock: 0,
  rating: 4.5,
  specifications: [],
};

export default function ProductForm({ initial, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(initial ?? empty);
  // For adding/editing specifications
  const [specLabel, setSpecLabel] = useState("");
  const [specPrice, setSpecPrice] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error ?? "Upload failed.");
        return;
      }

      set("image", data.url);
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset so the same file can be re-selected if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const set = (field: keyof ProductFormData, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addSpecification = () => {
    if (!specLabel.trim() || specPrice <= 0) return;
    setForm((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), { label: specLabel, price: specPrice }],
    }));
    setSpecLabel("");
    setSpecPrice(0);
  };

  const removeSpecification = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Product name is required.");
    if (form.price <= 0) return setError("Price must be greater than 0.");

    setSaving(true);
    try {
      const { id, ...fields } = form;
      if (id) {
        await updateProduct(id, fields);
      } else {
        await addProduct(fields);
      }
      onSuccess ? onSuccess() : router.push("/admin/products");
    } catch (err) {
      setError("Failed to save product. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Fresh Tomatoes"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Short product description..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          />
        </div>


        {/* Specifications (Weight/Volume/Size + Price) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Specifications (e.g. 1kg, 500ml, Large) + Price</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={specLabel}
              onChange={e => setSpecLabel(e.target.value)}
              placeholder="e.g. 1kg"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="number"
              min={0}
              step={0.01}
              value={specPrice}
              onChange={e => setSpecPrice(parseFloat(e.target.value) || 0)}
              placeholder="Price"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button type="button" onClick={addSpecification} className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600">Add</button>
          </div>
          {form.specifications.length > 0 && (
            <ul className="mb-2">
              {form.specifications.map((spec, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <span>{spec.label} - ₦{spec.price.toLocaleString()}</span>
                  <button type="button" onClick={() => removeSpecification(idx)} className="text-xs text-red-500 ml-2">Remove</button>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-gray-400">Leave empty for single price product.</p>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Default Price (₦) *</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.price}
            onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        {/* Original Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Original Price (₦)</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.originalPrice}
            onChange={(e) => set("originalPrice", parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Stock</label>
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => set("stock", parseInt(e.target.value) || 0)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Rating (0–5)</label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={form.rating}
            onChange={(e) => set("rating", parseFloat(e.target.value) || 0)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>

          {/* File picker */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Image
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {form.image && (
              <span className="text-xs text-green-600 font-medium">Image uploaded ✓</span>
            )}
          </div>

          {uploadError && (
            <p className="mt-2 text-xs text-red-500">{uploadError}</p>
          )}

          {/* Fallback: manual URL */}
          <div className="mt-3">
            <label className="block text-xs text-gray-400 mb-1">Or paste an image URL manually</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder="https://res.cloudinary.com/... or /images/product.png"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Preview */}
          {form.image && (
            <div className="mt-3 relative w-28 h-28 rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
              <Image
                src={form.image}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => set("image", "")}
                className="absolute top-1 right-1 rounded-full bg-white/80 p-1 text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Remove image"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-6 py-3 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : form.id ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
}
