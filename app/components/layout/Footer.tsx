import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#050709] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#091f16] via-[#050709] to-[#12060f]" />
        <div className="absolute -top-20 -right-10 h-72 w-72 rounded-full bg-green-500/30 blur-[120px]" />
        <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-orange-500/20 blur-[120px]" />
      </div>

      <div className="relative z-10 border-b border-white/10">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-green-300">Need groceries asap?</p>
            <h3 className="text-2xl font-semibold">Same-day delivery across Sokoto</h3>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
            >
              Start Shopping
            </Link>
            <a
              href="mailto:datafoodmart@inquiry.com"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:text-white"
            >
              datafoodmart@inquiry.com
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-5">
            <Link href="/" className="text-2xl font-bold tracking-wide">
              <span className="text-orange-400">DATA</span>
              <span className="text-green-400">FOODMART</span>
            </Link>
            <p className="max-w-xs text-sm text-white/70">
              Premium groceries, pantry staples, and fresh produce delivered in insulated packaging so everything arrives market-fresh.
            </p>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-start gap-3">
                <svg className="mt-1 h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>
                  Nasfat Street
                  <br />
                  Sokoto, 93
                </span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>(234) 810-654-3695</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="https://facebook.com"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white hover:text-white"
              >
                <img src="/images/face.png" alt="Facebook" className="h-6 w-6" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white hover:text-white"
              >
                <img src="/images/twit.png" alt="Twitter" className="h-6 w-6" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white hover:text-white"
              >
                <img src="/images/insta.png" alt="Instagram" className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Store Hours</h3>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span>Monday - Friday</span>
                <span className="text-white">6:00am - 10:00pm</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span>Weekend</span>
                <span className="text-white">7:00am - 9:00pm</span>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-green-300">Curbside pickup available</p>
            </div>
            <p className="text-sm text-white/70">Need a custom order? Call before 4pm for same-day sourcing from local farms.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/about" className="transition hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="transition hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/delivery" className="transition hover:text-white">Delivery Information</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Care</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/signin" className="transition hover:text-white">My Account</Link></li>
              <li><Link href="/orders" className="transition hover:text-white">Order Tracking</Link></li>
              <li><Link href="/cart" className="transition hover:text-white">Cart & Checkout</Link></li>
              <li><Link href="/wishlist" className="transition hover:text-white">Wishlist</Link></li>
              <li><Link href="/help" className="transition hover:text-white">Help Center</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get the App</h3>
            <div className="space-y-3">
              <Link
                href="https://play.google.com"
                target="_blank"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 2.5v19l14.5-9.5L3 2.5z" />
                </svg>
                Google Play
              </Link>
              <Link
                href="https://apps.apple.com"
                target="_blank"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.7 19.5c-.8 1.3-1.7 2.5-3 2.5-1.2 0-1.5-.8-3-.8s-1.9.8-3 .8c-1.3 0-2.2-1.2-3-2.5C3.9 16.7 3 12.2 5 9c.9-1.5 2.4-2.4 4-2.4 1.3 0 2.4.9 3 .9.7 0 1.9-1.1 3.4-1 .6 0 2.2.2 3.3 1.9-1.3.7-2.1 2-2.1 3.5 0 2.4 2 3.2 2.1 3.2-.1.3-.7 2.4-2 4.4zM14 2c0 1.2-.7 2.4-1.6 3.3-.7.8-1.9 1.4-2.9 1.3 0-1.3.7-2.6 1.5-3.4C11.7 2.4 13 1.9 14 2z" />
                </svg>
                App Store
              </Link>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Secure Payments</p>
            <div className="flex flex-wrap gap-3">
              {["VISA", "MC", "AMEX", "PAYSTACK"].map((badge) => (
                <div key={badge} className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-6 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p>© 2026 DataFoodMart · Crafted by Daniel & Tammy</p>
          <div className="flex items-center justify-between md:gap-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/40">
              <span>Fresh</span>
              <span>Fast</span>
              <span>Reliable</span>
            </div>
            {/* Admin shortcut — only shown on mobile since the top bar hides on small screens */}
            <Link
              href="/admin"
              className="md:hidden text-white/50 hover:text-white text-xs border border-white/20 hover:border-white/50 px-3 py-1 rounded-full transition-all"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
