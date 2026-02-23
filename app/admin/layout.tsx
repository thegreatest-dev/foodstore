"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (!user && !isLoginPage) {
      router.replace("/admin/login");
    }
    if (user && isLoginPage) {
      router.replace("/admin");
    }
  }, [user, loading, isLoginPage, router]);

  // While Firebase resolves the session, show a neutral spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin w-8 h-8 text-green-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  // Unauthenticated and heading to login — render the login page directly
  if (!user && isLoginPage) {
    return <>{children}</>;
  }

  // Unauthenticated on any other admin page — render nothing (redirect fires above)
  if (!user) {
    return null;
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      active: pathname === "/admin",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-10h8V3h-8v8z" />
        </svg>
      ),
    },
    {
      label: "Products",
      href: "/admin/products",
      active: pathname.startsWith("/admin/products"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
        </svg>
      ),
    },
    {
      label: "Deals",
      href: "/admin/deals",
      active: pathname.startsWith("/admin/deals"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.382 2.458a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.382-2.457a1 1 0 00-1.175 0l-3.382 2.457c-.785.57-1.84-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.047 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
      ),
    },
    {
      label: "Announcements",
      href: "/admin/announcements",
      active: pathname.startsWith("/admin/announcements"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
    },
    {
      label: "Blog",
      href: "/admin/blog",
      active: pathname.startsWith("/admin/blog"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "Site Images",
      href: "/admin/site-images",
      active: pathname.startsWith("/admin/site-images"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm4-10h.01" />
        </svg>
      ),
    },
    {
      label: "Orders",
      href: "/admin/orders",
      active: pathname.startsWith("/admin/orders"),
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
  ];

  // Authenticated — render admin shell with side nav
  return (
    <div className="min-h-screen bg-[#e8f0ed] p-2 sm:p-3 lg:p-5">
      <div className="mx-auto max-w-[1500px] min-h-[calc(100vh-1rem)] rounded-[24px] lg:rounded-[30px] bg-[#f5faf8] border border-white/70 shadow-[0_18px_40px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col lg:flex-row">

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:w-72 bg-[#0ea868] text-white p-6 flex-col">
          <div className="rounded-3xl bg-white/10 p-4 mb-6">
            <Link href="/admin" className="text-xl font-extrabold tracking-wide inline-flex items-center gap-2">
              <span className="inline-flex h-8 w-8 rounded-xl bg-white/20 items-center justify-center">D</span>
              DataFoodMart
            </Link>
            <p className="text-xs text-white/80 mt-1">Admin Panel</p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-white text-[#0ea868] shadow"
                    : "text-white/90 hover:bg-white/15"
                }`}
              >
                <span className={item.active ? "text-[#0ea868]" : "text-white/90"}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/20">
            <p className="text-xs text-white/80 truncate mb-3">{user.email}</p>
            <button
              onClick={async () => { await signOut(auth); router.replace("/admin/login"); }}
              className="w-full rounded-2xl bg-white/15 hover:bg-white/25 transition-colors px-4 py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </aside>

        {/* Mobile: slide-in drawer backdrop */}
        {menuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Mobile: slide-in drawer */}
        <div
          className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 bg-[#0ea868] text-white flex flex-col p-5 transition-transform duration-300 ease-in-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="text-lg font-extrabold tracking-wide inline-flex items-center gap-2"
            >
              <span className="inline-flex h-8 w-8 rounded-xl bg-white/20 items-center justify-center">D</span>
              DataFoodMart
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="h-8 w-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-white text-[#0ea868] shadow"
                    : "text-white/90 hover:bg-white/15"
                }`}
              >
                <span className={item.active ? "text-[#0ea868]" : "text-white/90"}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-5 border-t border-white/20">
            <p className="text-xs text-white/80 truncate mb-3">{user.email}</p>
            <button
              onClick={async () => { setMenuOpen(false); await signOut(auth); router.replace("/admin/login"); }}
              className="w-full rounded-2xl bg-white/15 hover:bg-white/25 transition-colors px-4 py-2.5 text-sm font-semibold inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile top bar with hamburger */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30">
            <button
              onClick={() => setMenuOpen(true)}
              className="h-9 w-9 rounded-xl bg-[#0ea868] text-white flex items-center justify-center shrink-0"
              aria-label="Open menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/admin" className="font-extrabold tracking-wide text-sm">
              <span className="text-orange-500">DATA</span><span className="text-green-600">FOODMART</span>
            </Link>
            <span className="ml-auto text-xs text-gray-400 truncate max-w-[120px]">{user.email}</span>
          </div>

          <div className="p-3 sm:p-5 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
