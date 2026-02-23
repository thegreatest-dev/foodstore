import { normalizeSiteImages, SITE_IMAGE_DEFAULTS, SiteImages } from "@/app/lib/site-images-config";

export async function getSiteImages(): Promise<SiteImages> {
  const res = await fetch("/api/site-images", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    return SITE_IMAGE_DEFAULTS;
  }

  const data = await res.json();
  return normalizeSiteImages(data);
}

export async function saveSiteImages(images: SiteImages): Promise<void> {
  const res = await fetch("/api/site-images", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(images),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ error: "Failed to save site images" }));
    throw new Error(payload.error ?? "Failed to save site images");
  }
}
