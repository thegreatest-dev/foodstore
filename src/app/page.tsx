import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">
                  GET SAVE 30% OFF
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Farm Fresh Organic{" "}
                <span className="text-green-500">Vegetables.</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                aliqua. Quis ipsum suspendisse ultrices gravida.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition-colors"
              >
                Shop Collection
                <svg
                  className="w-5 h-5"
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
              </Link>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full transform translate-x-12 scale-110 opacity-90"></div>
              <div className="relative z-10">
                {/* Placeholder for vegetables image */}
                <div className="w-full h-96 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/images/mixed_vegetables.png"
                    alt="Fresh Vegetables"
                    width={500}
                    height={400}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Cards Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-full">
                Sale<br />30%<br />OFF
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm text-gray-600">Fresh & Healthy</h3>
              <h2 className="text-3xl font-bold text-green-600">VEGETABLES</h2>
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                Shop Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <Image
                src="/images/mixed_vegetables.png"
                alt="Fresh Vegetables"
                width={200}
                height={150}
                className="object-contain"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-full">
                Sale<br />30%<br />OFF
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm text-gray-600">Fresh & Healthy</h3>
              <h2 className="text-3xl font-bold text-orange-600">VEGETABLES</h2>
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                Shop Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <Image
                src="/images/spices.png"
                alt="Fresh Spices"
                width={200}
                height={150}
                className="object-contain"
              />
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-full">
                Sale<br />30%<br />OFF
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm text-gray-600">Fresh & Healthy</h3>
              <h2 className="text-3xl font-bold text-green-700">VEGETABLES</h2>
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
                Shop Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <Image
                src="/images/potato.png"
                alt="Fresh Potatoes"
                width={200}
                height={150}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative">
          <div className="absolute top-0 left-0 text-9xl font-bold text-gray-100 select-none pointer-events-none">
            EXPLORE
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-green-600 font-semibold mb-2">Category</p>
                <h2 className="text-4xl font-bold">Top Categories</h2>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange-500 hover:bg-orange-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
