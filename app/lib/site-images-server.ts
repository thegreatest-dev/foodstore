import { adminDb } from "@/app/lib/firebase-admin";
import { normalizeSiteImages, SITE_IMAGE_DEFAULTS, SiteImages } from "@/app/lib/site-images-config";

export async function getSiteImagesServer(): Promise<SiteImages> {
  try {
    const primary = await adminDb.collection("siteContent").doc("images").get();
    if (primary.exists) {
      return normalizeSiteImages(primary.data());
    }

    const legacy = await adminDb.collection("site_images").doc("homepage").get();
    if (legacy.exists) {
      return normalizeSiteImages(legacy.data());
    }

    return SITE_IMAGE_DEFAULTS;
  } catch {
    return SITE_IMAGE_DEFAULTS;
  }
}
