"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ProductCard from "@/app/components/ProductCard";
import { getProducts } from "@/app/lib/products";
import { Product } from "@/app/types/product";

type TabType = "featured" | "bestsellers" | "popular";

const AUTO_SCROLL_INTERVAL = 2800; // ms between each auto-advance
const RESUME_AFTER_INTERACT = 5000; // ms to wait before resuming after user interaction

export default function FeaturedProductsCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("featured");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [userInteracted, setUserInteracted] = useState(false);

  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCardsPerView(1);
      else if (window.innerWidth < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Derive tab lists from the same Firestore data
  const featuredProducts = products;
  const bestSellerProducts = [...products].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  const popularProducts   = [...products].sort((a, b) => b.stock - a.stock);

  const tabProducts =
    activeTab === "featured"    ? featuredProducts :
    activeTab === "bestsellers" ? bestSellerProducts :
    popularProducts;

  const maxIndex = Math.max(0, tabProducts.length - cardsPerView);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTO_SCROLL_INTERVAL);
  }, [maxIndex]);

  const stopAuto = useCallback(() => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
  }, []);

  // Start / restart auto-scroll whenever tab or maxIndex changes (and user isn't interacting)
  useEffect(() => {
    if (!userInteracted) startAuto();
    return stopAuto;
  }, [activeTab, maxIndex, userInteracted, startAuto, stopAuto]);

  // Called on any user interaction
  const handleInteract = useCallback(() => {
    stopAuto();
    setUserInteracted(true);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => {
      setUserInteracted(false);
    }, RESUME_AFTER_INTERACT);
  }, [stopAuto]);

  const handleTabChange = (tab: TabType) => {
    handleInteract();
    setActiveTab(tab);
    setCurrentIndex(0);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    handleInteract();
    touchStartX.current = e.changedTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX;

    if (touchStartX.current === null || touchEndX.current === null) {
      return;
    }

    const swipeDistance = touchStartX.current - touchEndX.current;
    const swipeThreshold = 40;

    if (swipeDistance > swipeThreshold) {
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    } else if (swipeDistance < -swipeThreshold) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  // Skeleton loader
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: cardsPerView }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-2xl h-56 sm:h-72 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div
      onMouseEnter={handleInteract}
      onMouseLeave={() => {
        // Clear any existing resume timer and start fresh so hovering out resumes after delay
        if (resumeRef.current) clearTimeout(resumeRef.current);
        resumeRef.current = setTimeout(() => setUserInteracted(false), RESUME_AFTER_INTERACT);
      }}
      onTouchStart={handleInteract}
    >
      {/* Tabs + desktop nav arrows */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex gap-4 sm:gap-6">
          {(["featured", "bestsellers", "popular"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`font-semibold pb-2 capitalize transition-colors text-sm sm:text-base ${
                activeTab === tab
                  ? "text-green-500 border-b-2 border-green-500"
                  : "text-gray-500 hover:text-green-500"
              }`}
            >
              {tab === "bestsellers" ? "Best Sellers" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Prev / Next — desktop only */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => { handleInteract(); setCurrentIndex((prev) => Math.max(0, prev - 1)); }}
            disabled={currentIndex === 0}
            aria-label="Previous"
            className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-green-500 hover:text-green-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => { handleInteract(); setCurrentIndex((prev) => Math.min(maxIndex, prev + 1)); }}
            disabled={currentIndex >= maxIndex}
            aria-label="Next"
            className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-green-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        className="overflow-hidden"
        key={activeTab}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out gap-6"
          style={{
            // Center the card on mobile, normal scroll on desktop
            transform:
              cardsPerView === 1
                ? `translateX(-${currentIndex * 100}%)`
                : `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
          }}
        >
          {tabProducts.map((product) => (
            <div
              key={`${activeTab}-${product.id}`}
              className="flex-shrink-0"
              style={{
                width: cardsPerView === 1 ? "100%" : `calc(${100 / cardsPerView}% - ${(cardsPerView - 1) * 24 / cardsPerView}px)`
              }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                rating={product.rating ?? 4.5}
                image={product.image}
                category={product.category}
                buttonColor="green"
                specifications={product.specifications}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot position indicators — centered below the cards */}
      {maxIndex > 0 && (
        <div className="flex justify-center items-center gap-1.5 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { handleInteract(); setCurrentIndex(i); }}
              aria-label={`Go to position ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-5 h-2 bg-green-500"
                  : "w-2 h-2 bg-gray-200 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}



