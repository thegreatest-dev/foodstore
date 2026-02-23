import Link from "next/link";
import Image from "next/image";
import FeaturedProductsCarousel from "@/app/components/FeaturedProductsCarousel";
import TopCategoriesCarousel from "@/app/components/TopCategoriesCarousel";
import DealOfTheWeek from "@/app/components/DealOfTheWeek";
import PromoCarousel from "@/app/components/PromoCarousel";
import BlogCarousel from "@/app/components/BlogCarousel";
import CountdownTimer from "@/app/components/CountdownTimer";
import { getDealProducts } from "@/app/lib/deals";
import { getProducts } from "@/app/lib/products";
import { getPublishedPostsServer } from "@/app/lib/blogs-server";
import { getSiteImagesServer } from "@/app/lib/site-images-server";
import { CATEGORIES } from "@/app/lib/categories";

export const revalidate = 60;

export default async function Home() {
  // Fetch products once; split into deal vs. all for category counts.
  const [dealProducts, allProducts, recentPosts, siteImages] = await Promise.all([
    getDealProducts().catch(() => []),
    getProducts().catch(() => []),
    getPublishedPostsServer().catch(() => []),
    getSiteImagesServer(),
  ]);

  const latestPosts = recentPosts.slice(0, 3);

  const formatPostDate = (value: string | undefined) => {
    if (!value) return "Latest";
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return "Latest";
    return dt.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Build live category counts to pass to the carousel.
  const categoryCounts: Record<string, number> = {};
  allProducts.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] ?? 0) + 1;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={siteImages.heroBackground}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/50 to-black/35"></div>
        </div>

        <div className="container mx-auto px-4 py-8 lg:py-14 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="space-y-6 bg-white/10 backdrop-blur-sm border border-white/25 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
              <div className="inline-block">
                <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider bg-white px-3 py-1 rounded-full">
                  GET SAVE 30% OFF
                </span>
              </div>
              <h1 className="text-hero font-bold leading-tight text-white drop-shadow-lg max-w-xl">
                Farm Fresh Organic{" "}
                <span className="text-green-400">Vegetables.</span>
              </h1>
              <p className="text-white text-body max-w-xl drop-shadow-md">
                Fuel your body with the goodness of nature. Discover our selection of farm-fresh organic vegetables, 
                grown with care for you and your family..
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className="bg-green-500 text-white px-8 py-3.5 rounded-full text-button font-semibold hover:bg-green-600 active:scale-95 transition-all shadow-md"
                >
                  Browse Fresh Foods
                </Link>
                <Link
                  href="/deals"
                  className="border border-white/60 text-white px-7 py-3.5 rounded-full text-button font-semibold hover:bg-white/15 active:scale-95 transition-all"
                >
                  View Deals
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-center">
                  <p className="text-xl font-bold text-white">1k+</p>
                  <p className="text-xs sm:text-sm text-white/80">Products</p>
                </div>
                <div className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-center">
                  <p className="text-xl font-bold text-white">24h</p>
                  <p className="text-xs sm:text-sm text-white/80">Delivery</p>
                </div>
                <div className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-center">
                  <p className="text-xl font-bold text-white">99%</p>
                  <p className="text-xs sm:text-sm text-white/80">Freshness</p>
                </div>
              </div>
            </div>

            {/* Right Image – hidden on mobile */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-white/10 rounded-[2rem] transform translate-x-6 translate-y-6 backdrop-blur-sm" />
              <div className="relative z-10 h-[420px] w-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src={siteImages.heroSideImage}
                  alt="Fresh groceries"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4">
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">This Week Highlight</p>
                  <p className="text-product-name font-bold text-gray-900 mt-1">Fresh picks curated daily for your kitchen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Cards Section */}
      <section className="container mx-auto px-4 py-6 sm:py-10">
        <PromoCarousel
          images={{
            vegetables: siteImages.promoVegetables,
            spices: siteImages.promoSpices,
            potato: siteImages.promoPotato,
          }}
        />
      </section>

      {/* Top Categories Section */}
      <section className="container mx-auto px-4 py-6 sm:py-10">
        <div className="mb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Shop by Category</p>
            <h2 className="text-section-title font-bold mt-2">Find essentials by what you need most</h2>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700">
            Browse all products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        <div className="relative rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
          <div className="absolute top-0 left-0 text-5xl sm:text-7xl lg:text-9xl font-bold text-gray-100 select-none pointer-events-none leading-none">
            EXPLORE
          </div>
          <div className="relative z-10">
            <TopCategoriesCarousel categoryCounts={categoryCounts} />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 rounded-3xl border border-gray-100 bg-gradient-to-br from-white to-green-50/40 p-6 sm:p-8">
          {/* Sidebar — hidden on mobile to avoid eating vertical space */}
          <div className="hidden lg:block lg:col-span-1">
            <p className="text-orange-500 text-sm mb-1.5">Categories</p>
            <h3 className="text-xl font-bold mb-4">Featured Products</h3>
            <ul className="space-y-1.5 mb-6">
              {CATEGORIES.map((cat, i) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.id}`}
                    className={`text-sm hover:text-green-500 ${
                      i === 0
                        ? "text-green-500 border-b-2 border-green-500 pb-0.5 inline-block"
                        : "text-gray-700"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/products"
              className="bg-green-500 text-white px-6 py-3 rounded-full text-button font-semibold hover:bg-green-600 active:scale-95 transition-all"
            >
              Shop Now
            </Link>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <FeaturedProductsCarousel />
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fresh Vegetable Banner */}
          <div className="relative rounded-3xl p-8 overflow-hidden h-64">
            {/* Background Image */}
            <Image 
              src={siteImages.featuredBannerOil}
              alt="Oils & Pantry Background" 
              fill
              className="object-cover"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-0"></div>
            
            <div className="relative z-10">
              <p className="text-white text-body mb-2">Get up to 25%</p>
              <h3 className="text-section-title font-bold text-white mb-4">Oils & Pantry</h3>
              <Link href="/products?category=oils-pantry" className="bg-white text-gray-900 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 active:scale-95 transition-all">
                Shop Now
              </Link>
            </div>
          </div>

          {/* Organic Products Banner */}
          <div className="relative rounded-3xl p-8 overflow-hidden h-64">
            {/* Background Image */}
            <Image 
              src={siteImages.featuredBannerFresh}
              alt="Fresh Products Background" 
              fill
              className="object-cover"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-0"></div>
            
            <div className="relative z-10">
              <p className="text-white text-body mb-2">Get up to 10% off Products</p>
              <h3 className="text-section-title font-bold text-white mb-4">All Tasted Organic &<br />Fresh Products</h3>
              <Link href="/products" className="bg-white text-gray-900 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 active:scale-95 transition-all">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Deal of the Week Section */}
      <section id="best-deals" className="container mx-auto px-4 py-6 sm:py-10">
        <div className="flex flex-col items-center mb-6 gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-500">
            🔥 Best Deal
          </span>
          <h2 className="text-section-title font-extrabold text-gray-900 text-center">
            Deal{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-green-500">of the Week</span>
              <span className="absolute bottom-0 left-0 h-2.5 w-full rounded-full bg-green-100 -z-10"></span>
            </span>
          </h2>
          <p className="text-sm text-gray-400 max-w-xs text-center leading-relaxed">
            Handpicked deals refreshed weekly — grab them before they&apos;re gone.
          </p>
        </div>

        <DealOfTheWeek products={dealProducts} />

        {/* Navigation Arrows */}
        <div className="flex justify-center gap-2 mt-8">
          <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* 40% Discount Banner with Countdown */}
      <section className="container mx-auto px-4 py-6 sm:py-10">
        <div className="relative rounded-3xl overflow-hidden" style={{
          backgroundImage: `url(${siteImages.discountBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
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

              <Link href="/products" className="bg-white text-gray-900 px-8 py-3.5 rounded-full text-sm font-bold hover:bg-gray-100 active:scale-95 transition-all">
                Shop Now
              </Link>
            </div>

            {/* Right side - image is part of background */}
            <div></div>
          </div>
        </div>
      </section>

      {/* Our Recent Post Section */}
      <section className="container mx-auto px-4 py-6 sm:py-10">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-2xl text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              Blog
            </span>
            <h2 className="mt-4 text-section-title font-bold text-gray-900 leading-tight">
              Our Recent
              <span className="relative inline-block ml-2">
                <span className="relative z-10 text-green-500">Posts</span>
                <span className="absolute bottom-0 left-0 h-2.5 w-full rounded-full bg-green-100 -z-10" />
              </span>
            </h2>
            <p className="mt-3 text-body text-gray-500">
              Fresh updates, food tips, and practical insights from our kitchen.
            </p>
          </div>
          <Link
            href="/blog"
            aria-label="View all blog posts"
            className="self-center sm:self-auto inline-flex items-center justify-center h-11 w-11 rounded-full border border-gray-200 text-green-600 hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="md:hidden">
          <BlogCarousel posts={latestPosts} />
        </div>

        <div className="hidden md:grid grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={post.coverImage || "/images/12_spice.jfif"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-green-500/95 px-3 py-1 text-[11px] font-semibold text-white">
                  {formatPostDate(post.createdAt)}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[3.25rem]">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">
                  {post.excerpt || "Fresh updates and practical kitchen tips from our team."}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700"
                >
                  Read More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl border border-white/70 bg-white/70 backdrop-blur-sm p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-section-title font-bold text-gray-900">SUBSCRIBE OUR NEWSLETTER</h3>
                <p className="text-body text-gray-600">To See 30% Off On Your First Purchase</p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 min-w-0 md:w-72 lg:w-80 px-4 sm:px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-green-500 text-sm"
              />
              <button className="bg-green-500 text-white px-8 py-3 rounded-full text-button hover:bg-green-600 transition-colors whitespace-nowrap">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
