"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/app/store/cartStore";
import { useWishlistStore } from "@/app/store/wishlistStore";

const categoryGroups = [
  {
    label: "Grocery Items",
    href: "/products?category=beverages",
    sub: [
      { label: "Beverages", href: "/products?category=beverages" },
      { label: "Condiments & Spices", href: "/products?category=condiments-spices" },
      { label: "Oils & Pantry", href: "/products?category=oils-pantry" },
    ],
  },
  {
    label: "Meats",
    href: "/products?category=proteins",
    sub: [
      { label: "Proteins", href: "/products?category=proteins" },
    ],
  },
  {
    label: "Dry Foods",
    href: "/products?category=rice-grains",
    sub: [
      { label: "Rice & Grains", href: "/products?category=rice-grains" },
      { label: "Pasta & Packaged Goods", href: "/products?category=pasta-packaged" },
    ],
  },
];

function DropdownNavItem({ group }: { group: typeof categoryGroups[number] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={group.href}
        className="flex items-center gap-1 hover:text-green-500 font-medium transition-colors"
      >
        {group.label}
        <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
      {open && (
        <ul className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg py-1.5 min-w-[200px] z-50">
          {group.sub.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function MobileNavGroup({
  group,
  onClose,
}: {
  group: typeof categoryGroups[number];
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-800 hover:text-green-400 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{group.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-gray-700 pl-3">
          {group.sub.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="block py-2 px-2 text-sm text-gray-300 rounded hover:bg-gray-800 hover:text-green-400 transition-colors"
                onClick={onClose}
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Navbar() {
  const { getItemCount, openCart } = useCartStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = mounted ? getItemCount() : 0;

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Bar – hidden on small screens */}
      <div className="bg-green-500 text-white py-2 hidden sm:block">
        <div className="container mx-auto px-4 flex items-center justify-between text-xs md:text-sm">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="hidden md:flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              (234) 810-654-3695
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              datafoodmart@inquiry.com
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Welcome to DataFoodMart</span>
            <select className="bg-transparent border-none text-white text-xs cursor-pointer">
              <option>NGN</option>
            </select>
            <Link
              href="/admin"
              className="text-white/60 hover:text-white text-xs border border-white/20 hover:border-white/50 px-2.5 py-1 rounded-full transition-all"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-black text-white py-3 md:py-4">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-bold shrink-0">
            <span className="text-orange-500">Data</span>
            <span className="text-green-500">FoodMart</span>
          </Link>

          {/* Search Bar – desktop only */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
            <div className="flex w-full">
              <select className="bg-gray-800 px-3 py-2 rounded-l-lg border-none text-sm min-w-[130px]">
                <option>All Categories</option>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Meats</option>
              </select>
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-4 py-2 bg-gray-800 border-none focus:outline-none text-sm"
              />
              <button className="bg-gray-800 px-5 py-2 rounded-r-lg hover:bg-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Mobile search icon */}
            <button className="lg:hidden hover:text-green-500" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link href="/account" className="flex items-center gap-1.5 hover:text-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden lg:inline text-sm">My Account</span>
            </Link>
            <Link href="/wishlist" className="relative hover:text-green-500 hidden sm:block">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{wishlistCount}</span>
              )}
            </Link>
            <button onClick={openCart} className="relative hover:text-green-500 focus:outline-none" aria-label="Open cart">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {mounted && itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{itemCount}</span>
              )}
            </button>
            {/* Hamburger */}
            <button
              className="lg:hidden hover:text-green-500 focus:outline-none"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-800 mt-3">
            <div className="container mx-auto px-4 py-3">
              {/* Mobile search */}
              <div className="flex mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 bg-gray-800 rounded-l-lg border-none focus:outline-none text-sm"
                />
                <button className="bg-green-500 px-4 py-2 rounded-r-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              <ul className="space-y-1 text-sm">
                {categoryGroups.map((g) => (
                  <MobileNavGroup key={g.href} group={g} onClose={() => setMobileOpen(false)} />
                ))}
                {[
                  ["Best Deals", "/#best-deals"],
                  ["All Products", "/products"],
                  ["Blog", "/blog"],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="block py-2.5 px-3 rounded-lg hover:bg-gray-800 hover:text-green-400 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>

      {/* Secondary Navigation – desktop only */}
      <nav className="hidden lg:block bg-white border-b border-gray-200 py-3">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 text-sm whitespace-nowrap">
            {categoryGroups.map((g) => (
              <DropdownNavItem key={g.href} group={g} />
            ))}
            <li><Link href="/#best-deals" className="hover:text-green-500 transition-colors">Best Deals</Link></li>
            <li><Link href="/products" className="hover:text-green-500 transition-colors">All Products</Link></li>
            <li><Link href="/blog" className="hover:text-green-500 transition-colors">Blog</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
