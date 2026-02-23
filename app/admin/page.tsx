"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminDashboardCountsAction } from "@/app/actions/admin-dashboard-actions";
import { getOrderCountAction } from "@/app/actions/admin-order-actions";

export default function AdminDashboard() {
  const adminIcons = ["/images/ad.png", "/images/admi.png", "/images/admin1.png"];
  const [productCount, setProductCount] = useState<number | null>(null);
  const [announcementCount, setAnnouncementCount] = useState<number | null>(null);
  const [dealCount, setDealCount] = useState<number | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [adminIconIndex, setAdminIconIndex] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [counts, orders] = await Promise.all([
          getAdminDashboardCountsAction(),
          getOrderCountAction(),
        ]);
        setProductCount(counts.products);
        setAnnouncementCount(counts.announcements);
        setBlogCount(counts.blogs);
        setDealCount(counts.deals);
        setOrderCount(orders);
      } catch {
        setProductCount(0);
        setAnnouncementCount(0);
        setBlogCount(0);
        setDealCount(0);
        setOrderCount(0);
      }
    }
    fetchCounts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdminIconIndex((prev) => (prev + 1) % adminIcons.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [adminIcons.length]);

  const cards = [
    {
      label: "Products",
      count: productCount,
      href: "/admin/products",
      icon: (
        <Image
          src="/images/product.png"
          alt="Products"
          width={28}
          height={28}
          className="object-contain"
        />
      ),
      color: "bg-green-50 text-green-600",
      border: "border-green-200",
    },
    {
      label: "Deal of the Week",
      count: dealCount,
      href: "/admin/deals",
      icon: (
        <Image
          src="/images/deal.png"
          alt="Deals"
          width={28}
          height={28}
          className="object-contain"
        />
      ),
      color: "bg-yellow-50 text-yellow-600",
      border: "border-yellow-200",
    },
    {
      label: "Announcements",
      count: announcementCount,
      href: "/admin/announcements",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      color: "bg-orange-50 text-orange-600",
      border: "border-orange-200",
    },
    {
      label: "Blog Posts",
      count: blogCount,
      href: "/admin/blog",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-200",
    },
    {
      label: "Orders",
      count: orderCount,
      href: "/admin/orders",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: "bg-indigo-50 text-indigo-600",
      border: "border-indigo-200",
    },
  ];

  const surveyBars = [
    { month: "Jan", a: 52, b: 42 },
    { month: "Feb", a: 26, b: 30 },
    { month: "Mar", a: 70, b: 58 },
    { month: "Apr", a: 34, b: 40 },
    { month: "May", a: 44, b: 50 },
    { month: "Jun", a: 28, b: 36 },
    { month: "Jul", a: 80, b: 92 },
    { month: "Aug", a: 30, b: 28 },
    { month: "Sep", a: 67, b: 71 },
    { month: "Oct", a: 48, b: 52 },
    { month: "Nov", a: 58, b: 61 },
    { month: "Dec", a: 24, b: 26 },
  ];

  const today = new Date();
  const monthName = today.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const activeDay = today.getDate();
  const totalPosts = blogCount ?? 0;
  const publishedEstimate = Math.min(totalPosts, Math.max(0, Math.floor(totalPosts * 0.6)));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-gray-100 px-3 sm:px-5 py-3 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <input
            readOnly
            value="Search"
            className="w-full rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-500 px-10 py-2.5"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <span className="text-xs text-gray-500 hidden sm:inline">ENG</span>
          <button className="h-9 w-9 rounded-xl bg-gray-50 border border-gray-100 inline-flex items-center justify-center text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="h-12 w-12 rounded-2xl inline-flex items-center justify-center overflow-hidden">
            <Image
              key={adminIcons[adminIconIndex]}
              src={adminIcons[adminIconIndex]}
              alt="Admin avatar"
              width={48}
              height={48}
              className="object-cover rounded-2xl transition-opacity duration-300"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_1fr] gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-white border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">Today Available</p>
            <h2 className="text-xl font-bold text-gray-900">Store Overview</h2>
            <p className="text-xs text-gray-400 mt-1">DataFoodMart Admin Operations</p>
            <div className="mt-5 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">DF</div>
              <div>
                <p className="font-semibold text-gray-900">Admin Team</p>
                <p className="text-xs text-gray-500">Monitoring products and campaigns</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white border border-gray-100 p-4">
              <p className="text-3xl font-bold text-green-600">{cards[0].count ?? "—"}</p>
              <p className="text-sm text-gray-700 font-semibold mt-1">Products</p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 p-4">
              <p className="text-3xl font-bold text-green-600">{cards[1].count ?? "—"}</p>
              <p className="text-sm text-gray-700 font-semibold mt-1">Deals</p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 p-4">
              <p className="text-3xl font-bold text-green-600">{cards[2].count ?? "—"}</p>
              <p className="text-sm text-gray-700 font-semibold mt-1">Announcements</p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 p-4">
              <p className="text-3xl font-bold text-green-600">{cards[3].count ?? "—"}</p>
              <p className="text-sm text-gray-700 font-semibold mt-1">Blog Posts</p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 p-4">
              <p className="text-3xl font-bold text-indigo-600">{cards[4].count ?? "—"}</p>
              <p className="text-sm text-gray-700 font-semibold mt-1">Orders</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className={`bg-white rounded-2xl border ${card.border} p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-[11px] sm:text-xs text-gray-500 leading-tight">{card.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {card.count === null ? "—" : card.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_1fr] gap-5">
        <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Store Survey</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5 text-gray-500">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Products
              </span>
              <span className="inline-flex items-center gap-1.5 text-gray-500">
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" /> Campaigns
              </span>
            </div>
          </div>

          <div className="h-60 flex items-end justify-between gap-2">
            {surveyBars.map((bar) => (
              <div key={bar.month} className="flex-1 min-w-[20px] flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center gap-1 h-44">
                  <div className="w-2.5 rounded-t bg-green-500" style={{ height: `${bar.a}%` }} />
                  <div className="w-2.5 rounded-t bg-yellow-400" style={{ height: `${bar.b}%` }} />
                </div>
                <span className="text-[10px] text-gray-400">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">Calendar</h3>
            <span className="text-xs text-green-600 font-semibold">{monthName}</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-400 mb-3">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-sm mb-6">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className={`h-8 rounded-lg flex items-center justify-center ${
                  day === activeDay
                    ? "bg-green-500 text-white font-semibold"
                    : "text-gray-600"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Published Content</span>
              <span className="font-bold text-gray-900">{publishedEstimate}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Draft / Pending</span>
              <span className="font-bold text-gray-900">{Math.max(totalPosts - publishedEstimate, 0)}</span>
            </div>
            <Link href="/" className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold hover:text-green-700">
              Go to Store
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
