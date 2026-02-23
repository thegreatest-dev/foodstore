"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  {
    bg: "from-blue-50 to-blue-100",
    badge: "Sale\n30%\nOFF",
    sub: "Fresh & Healthy",
    title: "VEGETABLES",
    titleColor: "text-green-600",
    hoverColor: "group-hover:text-green-700",
    borderColor: "hover:text-green-600 hover:border-green-600",
    href: "/products?category=vegetables",
    img: "/images/mixed_vegetables.png",
    imgAlt: "Fresh Vegetables",
  },
  {
    bg: "from-orange-50 to-orange-100",
    badge: "Sale\n30%\nOFF",
    sub: "Aromatic spices for every kitchen",
    title: "SPICES",
    titleColor: "text-orange-600",
    hoverColor: "group-hover:text-orange-700",
    borderColor: "hover:text-orange-600 hover:border-orange-600",
    href: "/products?category=condiments-spices",
    img: "/images/spices.png",
    imgAlt: "Fresh Spices",
  },
  {
    bg: "from-green-50 to-green-100",
    badge: "Sale\n30%\nOFF",
    sub: "Versatile root vegetable",
    title: "POTATO",
    titleColor: "text-green-700",
    hoverColor: "group-hover:text-green-800",
    borderColor: "hover:text-green-700 hover:border-green-700",
    href: "/products?category=rice-grains",
    img: "/images/potato.png",
    imgAlt: "Fresh Potatoes",
  },
];

const INTERVAL = 3500;

export default function PromoCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL);
  };

  useEffect(() => {
    start();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!paused) start();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  const goTo = (i: number) => {
    setActive(i);
    // restart timer after manual pick
    if (timerRef.current) clearInterval(timerRef.current);
    if (!paused) start();
  };

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Track */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div key={slide.title} className="w-full shrink-0 px-1">
            <div
              className={`group relative bg-gradient-to-br ${slide.bg} rounded-3xl p-6 sm:p-8 overflow-hidden transition-all duration-300 cursor-pointer`}
            >
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <div className="bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg text-center whitespace-pre-line leading-tight">
                  {slide.badge}
                </div>
              </div>

              {/* Content row */}
              <div className="flex items-center justify-between gap-4">
                {/* Text */}
                <div className="space-y-3">
                  <h3 className="text-sm text-gray-600">{slide.sub}</h3>
                  <h2
                    className={`text-section-title font-bold ${slide.titleColor} ${slide.hoverColor} transition-colors`}
                  >
                    {slide.title}
                  </h2>
                  <Link
                    href={slide.href}
                    className={`inline-block text-sm font-bold text-gray-900 border-b-2 border-gray-900 pb-0.5 ${slide.borderColor} transition-colors tracking-wide`}
                  >
                    Shop Now
                  </Link>
                </div>

                {/* Image */}
                <div className="shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={slide.img}
                    alt={slide.imgAlt}
                    width={160}
                    height={120}
                    className="object-contain drop-shadow-lg"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.title}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 h-2.5 bg-green-500"
                : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
