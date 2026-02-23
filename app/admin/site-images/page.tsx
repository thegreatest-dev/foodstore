"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  SITE_IMAGE_DEFAULTS,
  SiteImageKey,
  SiteImages,
} from "@/app/lib/site-images-config";
import { getSiteImages, saveSiteImages } from "@/app/lib/site-images";

const IMAGE_FIELDS: { key: SiteImageKey; label: string; help: string }[] = [
  {
    key: "heroBackground",
    label: "Hero Header Background",
    help: "Top homepage hero section background image",
  },
  {
    key: "heroSideImage",
    label: "Hero Right Image",
    help: "Image card shown on the right side of the hero",
  },
  {
    key: "featuredBannerOil",
    label: "Featured Banner: Oils & Pantry",
    help: "Background image for the first major promo banner",
  },
  {
    key: "featuredBannerFresh",
    label: "Featured Banner: Fresh Products",
    help: "Background image for the second major promo banner",
  },
  {
    key: "discountBanner",
    label: "Discount Banner Background",
    help: "Background image for the 40% discount section",
  },
  {
    key: "promoVegetables",
    label: "Promo Card Image: Vegetables",
    help: "Image used in the first promo card carousel slide",
  },
  {
    key: "promoSpices",
    label: "Promo Card Image: Spices",
    help: "Image used in the second promo card carousel slide",
  },
  {
    key: "promoPotato",
    label: "Promo Card Image: Potato",
    help: "Image used in the third promo card carousel slide",
  },
];

export default function AdminSiteImagesPage() {
  const [images, setImages] = useState<SiteImages>(SITE_IMAGE_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<SiteImageKey | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadImages() {
      setLoading(true);
      try {
        const data = await getSiteImages();
        setImages(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load site images.");
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, []);

  const setImage = (key: SiteImageKey, value: string) => {
    setImages((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = async (key: SiteImageKey, file: File) => {
    setError("");
    setSuccess("");
    setUploadingKey(key);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const response = await fetch("/api/upload?folder=site-images", {
        method: "POST",
        body: fd,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Upload failed");
      }

      setImage(key, payload.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveSiteImages(images);
      setSuccess("Site images saved successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save site images.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading site images…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-5 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Site Images</h1>
          <p className="text-xs text-gray-400">Update homepage backgrounds and major card images</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {IMAGE_FIELDS.map((field) => (
            <div key={field.key} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="mb-3">
                <p className="font-semibold text-gray-900">{field.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{field.help}</p>
              </div>

              <div className="relative h-40 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                <Image
                  src={images[field.key]}
                  alt={field.label}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="mt-3 space-y-2">
                <input
                  value={images[field.key]}
                  onChange={(e) => setImage(field.key, e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center justify-center rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600 transition-colors cursor-pointer">
                    {uploadingKey === field.key ? "Uploading…" : "Upload Image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingKey !== null}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(field.key, file);
                        e.target.value = "";
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setImage(field.key, SITE_IMAGE_DEFAULTS[field.key])}
                    className="inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Reset Default
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || uploadingKey !== null}
            className="inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
