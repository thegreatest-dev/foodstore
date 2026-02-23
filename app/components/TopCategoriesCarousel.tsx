"use client";

import { useState, useEffect, useRef } from "react";
import CategoryCard from "@/app/components/CategoryCard";
import { CATEGORIES } from "@/app/lib/categories";

interface TopCategoriesCarouselProps {
  /** Live product counts per category, keyed by Firestore category name */
  categoryCounts?: Record<string, number>;
}

export default function TopCategoriesCarousel({ categoryCounts = {} }: TopCategoriesCarouselProps) {
  // Merge static config with live counts
  const categories = CATEGORIES.map((cat) => ({
    ...cat,
    itemCount: categoryCounts[cat.name] ?? 0,
  }));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(6);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Handle responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(2); // Mobile: 2 cards
      } else if (window.innerWidth < 1024) {
        setCardsPerView(3); // Tablet: 3 cards
      } else {
        setCardsPerView(6); // Desktop: 6 cards
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset carousel when cardsPerView changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [cardsPerView]);

  const maxIndex = Math.max(0, categories.length - cardsPerView);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    touchEndX.current = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipe = 40;

    if (swipeDistance > minSwipe) {
      handleNext();
    } else if (swipeDistance < -minSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-green-600 font-semibold mb-2">Category</p>
          <h2 className="text-4xl font-bold">Top Categories</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:bg-orange-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-300 disabled:hover:text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        className="overflow-hidden mt-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out gap-4"
          style={{
            transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`
          }}
        >
          {categories.map((category) => (
            <div 
              key={category.id}
              className="flex-shrink-0"
              style={{ 
                width: `calc(${100 / cardsPerView}% - ${((cardsPerView - 1) * 16) / cardsPerView}px)`,
                minWidth: '150px'
              }}
            >
              <CategoryCard
                id={category.id}
                name={category.name}
                itemCount={category.itemCount}
                image={category.image}
                isHighlighted={category.isHighlighted}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
