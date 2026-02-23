"use client";
import CountdownTimer from "../components/CountdownTimer";
import Link from "next/link";
import React from "react";

interface DiscountBannerProps {
  discountBanner: string;
}

const DiscountBanner: React.FC<DiscountBannerProps> = ({ discountBanner }) => (
  <section className="container mx-auto px-4 py-6 sm:py-10">
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{
        backgroundImage: `url(${discountBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 sm:p-10 lg:p-16">
        {/* Left Content */}
        <div className="text-white">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            UP To 40% Discount<br />On Selected Items
          </h2>
          <p className="text-gray-200 text-lg mb-8 max-w-md">
            Stock up on everyday essentials for less.
          </p>
          {/* Countdown Timer */}
          <CountdownTimer initialDays={28} initialHours={15} initialMinutes={55} initialSeconds={60} />
          <Link
            href="/products"
            className="bg-white text-gray-900 px-8 py-3.5 rounded-full text-sm font-bold hover:bg-gray-100 active:scale-95 transition-all"
          >
            Shop Now
          </Link>
        </div>
        {/* Right side - image is part of background */}
        <div></div>
      </div>
    </div>
  </section>
);

export default DiscountBanner;
