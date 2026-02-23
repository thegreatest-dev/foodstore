export const PRICE_RANGES = [
  { key: "under-100", label: "Under ₦100" },
  { key: "100-200", label: "₦100 – ₦200" },
  { key: "200-350", label: "₦200 – ₦350" },
  { key: "over-350", label: "Over ₦350" },
] as const;

export type PriceRangeKey = (typeof PRICE_RANGES)[number]["key"];

export function matchesPriceRange(price: number, key: PriceRangeKey): boolean {
  switch (key) {
    case "under-100":
      return price < 100;
    case "100-200":
      return price >= 100 && price < 200;
    case "200-350":
      return price >= 200 && price <= 350;
    case "over-350":
      return price > 350;
  }
}
