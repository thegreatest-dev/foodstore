"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PRICE_RANGES } from "@/app/lib/price-ranges";

export default function PriceRangeFilter({
  selectedRanges,
}: {
  selectedRanges: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function toggle(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    // Remove all existing price params then rebuild
    params.delete("price");
    const next = selectedRanges.includes(key)
      ? selectedRanges.filter((r) => r !== key)
      : [...selectedRanges, key];
    next.forEach((r) => params.append("price", r));
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="space-y-3">
      {PRICE_RANGES.map(({ key, label }) => (
        <label
          key={key}
          className="flex items-center gap-2 text-body text-gray-700 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selectedRanges.includes(key)}
            onChange={() => toggle(key)}
            className="rounded border-gray-300 text-green-500 focus:ring-green-500"
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}
