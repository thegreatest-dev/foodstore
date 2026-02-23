import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-green-500 text-white py-2">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              (219) 555-0114
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              homedokan@gmail.com
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Welcome to HOMEDOKAN</span>
            <select className="bg-transparent border-none text-white text-sm cursor-pointer">
              <option>USD</option>
              <option>EUR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-black text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <span className="text-orange-500">HOME</span>
            <span className="text-green-500">DOKAN</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="flex w-full">
              <select className="bg-gray-800 px-4 py-2 rounded-l-lg border-none text-sm min-w-[140px]">
                <option>All Categories</option>
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Meats</option>
              </select>
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-4 py-2 bg-gray-800 border-none focus:outline-none"
              />
              <button className="bg-gray-800 px-6 py-2 rounded-r-lg hover:bg-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link href="/account" className="flex items-center gap-2 hover:text-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden lg:inline text-sm">My Account</span>
            </Link>
            <Link href="/wishlist" className="relative hover:text-green-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </Link>
            <Link href="/cart" className="relative hover:text-green-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <nav className="bg-white border-b border-gray-200 py-3">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 text-sm">
            <li>
              <Link href="/grocery" className="hover:text-green-500 font-medium">
                Grocery Items
              </Link>
            </li>
            <li>
              <Link href="/meats" className="hover:text-green-500">
                Meats
              </Link>
            </li>
            <li>
              <Link href="/dry-foods" className="text-green-500 border-b-2 border-green-500 pb-3 -mb-3">
                Dry Foods
              </Link>
            </li>
            <li>
              <Link href="/best-deals" className="hover:text-green-500">
                Best deals
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-green-500">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/pages" className="hover:text-green-500">
                Pages
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-green-500">
                Blog
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
