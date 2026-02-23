"use client";

import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  id: string;
  name: string;
  itemCount: number;
  image: string;
  isHighlighted?: boolean;
}

export default function CategoryCard({
  id,
  name,
  itemCount,
  image,
  isHighlighted = false,
}: CategoryCardProps) {
  return (
    <Link href={`/products?category=${id}`}>
      <div
        className={`group relative rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
          isHighlighted
            ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-2xl hover:scale-105"
            : "bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-xl hover:scale-105 hover:from-green-50 hover:to-green-100"
        }`}
      >
        {/* Decorative background elements */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
            isHighlighted ? "bg-white" : "bg-green-500"
          }`}
        />

        {/* Image Container */}
        <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Image
            src={image}
            alt={name}
            width={64}
            height={64}
            className="object-contain drop-shadow-lg"
            loading="lazy"
          />
        </div>

        {/* Category Name */}
        <h3
          className={`font-semibold text-body mb-1 transition-colors ${
            isHighlighted ? "text-white" : "text-gray-900 group-hover:text-green-600"
          }`}
        >
          {name}
        </h3>

        {/* Item Count */}
        <p
          className={`text-sm transition-colors ${
            isHighlighted ? "text-white/90" : "text-gray-500 group-hover:text-green-500"
          }`}
        >
          {itemCount} Items
        </p>

        {/* Arrow Icon - Shows on hover */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <svg
            className={`w-5 h-5 ${isHighlighted ? "text-white" : "text-green-500"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
