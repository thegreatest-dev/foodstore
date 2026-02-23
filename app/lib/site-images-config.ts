export const SITE_IMAGE_DEFAULTS = {
  heroBackground: "/images/Top_background.jfif",
  heroSideImage: "/images/fresh.jfif",
  featuredBannerOil: "/images/oil.png",
  featuredBannerFresh: "/images/fresh.jfif",
  discountBanner: "/images/spice_background.jfif",
  promoVegetables: "/images/mixed_vegetables.png",
  promoSpices: "/images/spices.png",
  promoPotato: "/images/potato.png",
} as const;

export type SiteImageKey = keyof typeof SITE_IMAGE_DEFAULTS;

export type SiteImages = Record<SiteImageKey, string>;

function isValidUrl(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeSiteImages(data: unknown): SiteImages {
  const source = (data && typeof data === "object" ? data : {}) as Partial<SiteImages>;

  return {
    heroBackground: isValidUrl(source.heroBackground)
      ? source.heroBackground
      : SITE_IMAGE_DEFAULTS.heroBackground,
    heroSideImage: isValidUrl(source.heroSideImage)
      ? source.heroSideImage
      : SITE_IMAGE_DEFAULTS.heroSideImage,
    featuredBannerOil: isValidUrl(source.featuredBannerOil)
      ? source.featuredBannerOil
      : SITE_IMAGE_DEFAULTS.featuredBannerOil,
    featuredBannerFresh: isValidUrl(source.featuredBannerFresh)
      ? source.featuredBannerFresh
      : SITE_IMAGE_DEFAULTS.featuredBannerFresh,
    discountBanner: isValidUrl(source.discountBanner)
      ? source.discountBanner
      : SITE_IMAGE_DEFAULTS.discountBanner,
    promoVegetables: isValidUrl(source.promoVegetables)
      ? source.promoVegetables
      : SITE_IMAGE_DEFAULTS.promoVegetables,
    promoSpices: isValidUrl(source.promoSpices)
      ? source.promoSpices
      : SITE_IMAGE_DEFAULTS.promoSpices,
    promoPotato: isValidUrl(source.promoPotato)
      ? source.promoPotato
      : SITE_IMAGE_DEFAULTS.promoPotato,
  };
}
