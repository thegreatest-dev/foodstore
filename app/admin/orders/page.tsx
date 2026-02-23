"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getAllOrdersAction,
  updateOrderStatusAction,
  SerializedOrder,
} from "@/app/actions/admin-order-actions";
import { OrderStatus } from "@/app/types/order";

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_META: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending:    { label: "Pending",    bg: "bg-yellow-50",  text: "text-yellow-700", dot: "bg-yellow-400" },
  processing: { label: "Processing", bg: "bg-blue-50",    text: "text-blue-700",   dot: "bg-blue-400"   },
  shipped:    { label: "Shipped",    bg: "bg-purple-50",  text: "text-purple-700", dot: "bg-purple-400" },
  delivered:  { label: "Delivered",  bg: "bg-green-50",   text: "text-green-700",  dot: "bg-green-400"  },
  cancelled:  { label: "Cancelled",  bg: "bg-red-50",     text: "text-red-700",    dot: "bg-red-400"    },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const m = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${m.bg} ${m.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

function StatusSelect({
  orderId,
  current,
  onUpdate,
}: {
  orderId: string;
  current: OrderStatus;
  onUpdate: (id: string, status: OrderStatus) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState<OrderStatus>(current);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as OrderStatus;
    setValue(next);
    startTransition(async () => {
      await updateOrderStatusAction(orderId, next);
      onUpdate(orderId, next);
    });
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={handleChange}
        disabled={isPending}
        className="appearance-none border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-60 cursor-pointer"
      >
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_META[s].label}
          </option>
        ))}
      </select>
      {isPending ? (
        <svg
          className="w-3.5 h-3.5 animate-spin text-green-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg
          className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </div>
  );
}

const FILTER_TABS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all",        label: "All" },
  { value: "pending",    label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped",    label: "Shipped" },
  { value: "delivered",  label: "Delivered" },
  { value: "cancelled",  label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<SerializedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getAllOrdersAction()
      .then(setOrders)
      .catch(() => setError("Unable to load orders. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  function handleStatusUpdate(id: string, status: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  }

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.customerName.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.shippingAddress.city.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Per-status counts for tabs
  const counts = orders.reduce<Record<string, number>>(
    (acc, o) => { acc[o.status] = (acc[o.status] ?? 0) + 1; return acc; },
    {}
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-5 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          <p className="text-xs text-gray-400">
            {loading ? "Loading…" : `${orders.length} total order${orders.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Status tab filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_TABS.map((tab) => {
            const count = tab.value === "all" ? orders.length : (counts[tab.value] ?? 0);
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === tab.value
                    ? "bg-green-500 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600"
                }`}
              >
                {tab.label}
                <span
                  className={`text-xs rounded-full px-1.5 py-0.5 ${
                    statusFilter === tab.value ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, order ID, or city…"
            className="w-full border border-gray-200 rounded-full pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400 text-sm gap-2">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading orders…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm gap-3">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const isOpen = expanded === order.id;
              const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              });
              const time = new Date(order.createdAt).toLocaleTimeString("en-GB", {
                hour: "2-digit", minute: "2-digit",
              });

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* Collapsed row */}
                  <div className="px-5 py-4 flex flex-wrap items-center gap-4">
                    {/* Order ID + date */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">{date} · {time}</p>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-2.5 min-w-[160px]">
                      <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {order.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{order.customerName}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                      </div>
                    </div>

                    {/* Items summary */}
                    <div className="flex -space-x-2 shrink-0">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div
                          key={i}
                          className="relative h-8 w-8 rounded-full border-2 border-white overflow-hidden bg-gray-100"
                        >
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          ) : (
                            <span className="text-[10px] text-gray-400 flex items-center justify-center h-full">?</span>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-semibold">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <p className="text-sm font-bold text-gray-900 shrink-0 min-w-[70px] text-right">
                      ₦{order.total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </p>

                    {/* Status badge */}
                    <StatusBadge status={order.status} />

                    {/* Status updater */}
                    <StatusSelect
                      orderId={order.id}
                      current={order.status}
                      onUpdate={handleStatusUpdate}
                    />

                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                    >
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Expanded detail panel */}
                  {isOpen && (
                    <div className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order items */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Items ({order.items.length})
                        </h4>
                        <div className="space-y-2.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                {item.image ? (
                                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                                ) : (
                                  <span className="text-[10px] text-gray-400 flex items-center justify-center h-full">?</span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 shrink-0">
                                ₦{(item.price * item.quantity).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Price breakdown */}
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 text-sm">
                          <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span>₦{order.subtotal.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>Tax</span>
                            <span>₦{order.tax.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between font-bold text-gray-900">
                            <span>Total</span>
                            <span>₦{order.total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping + metadata */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Shipping Address
                          </h4>
                          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-1">
                            <p className="font-semibold">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                            Order Details
                          </h4>
                          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Order ID</span>
                              <span className="font-mono text-xs text-gray-700 bg-gray-200 rounded px-1.5 py-0.5">{order.id}</span>
                            </div>
                            {order.userId && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">User ID</span>
                                <span className="font-mono text-xs text-gray-700 bg-gray-200 rounded px-1.5 py-0.5 truncate max-w-[160px]">{order.userId}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-500">Placed</span>
                              <span className="text-gray-700">{date} at {time}</span>
                            </div>
                            {order.updatedAt && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Last updated</span>
                                <span className="text-gray-700">
                                  {new Date(order.updatedAt).toLocaleDateString("en-GB", {
                                    day: "numeric", month: "short", year: "numeric",
                                  })}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">Status</span>
                              <StatusBadge status={order.status} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
