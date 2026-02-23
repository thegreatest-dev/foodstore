import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import {
  normalizeSiteImages,
  SITE_IMAGE_DEFAULTS,
  SiteImages,
} from "@/app/lib/site-images-config";

const PRIMARY_COLLECTION = "siteContent";
const PRIMARY_DOC_ID = "images";
const LEGACY_COLLECTION = "site_images";
const LEGACY_DOC_ID = "homepage";

async function readSiteImages(): Promise<SiteImages> {
  const primary = await adminDb.collection(PRIMARY_COLLECTION).doc(PRIMARY_DOC_ID).get();
  if (primary.exists) {
    return normalizeSiteImages(primary.data());
  }

  const legacy = await adminDb.collection(LEGACY_COLLECTION).doc(LEGACY_DOC_ID).get();
  if (legacy.exists) {
    return normalizeSiteImages(legacy.data());
  }

  return SITE_IMAGE_DEFAULTS;
}

export async function GET() {
  try {
    const images = await readSiteImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error("site-images GET failed", error);
    return NextResponse.json({ error: "Failed to load site images" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = (await req.json()) as Partial<SiteImages>;
    const normalized = normalizeSiteImages(payload);

    const writePayload = {
      ...normalized,
      updatedAt: new Date(),
    };

    await Promise.all([
      adminDb.collection(PRIMARY_COLLECTION).doc(PRIMARY_DOC_ID).set(writePayload, { merge: true }),
      adminDb.collection(LEGACY_COLLECTION).doc(LEGACY_DOC_ID).set(writePayload, { merge: true }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("site-images PUT failed", error);
    return NextResponse.json({ error: "Failed to save site images" }, { status: 500 });
  }
}
