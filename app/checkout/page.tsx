"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";
import { useAuth } from "@/app/context/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

const VENDOR_WHATSAPP = "2348168951201";
const TAX_RATE = 0.075; // 7.5%

interface FormData {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  note: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  phone: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "Nigeria",
  note: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, getTotal, clearCart } = useCartStore();

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const subtotal = getTotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Pre-fill name/email from auth user
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.displayName || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
        <Link href="/products" className="bg-green-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-green-600 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (!form.name.trim())   e.name   = "Full name is required";
    if (!form.phone.trim())  e.phone  = "Phone number is required";
    if (!form.street.trim()) e.street = "Street address is required";
    if (!form.city.trim())   e.city   = "City is required";
    if (!form.state.trim())  e.state  = "State is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildWhatsAppMessage(orderId: string): string {
    const lines = [
      "🛒 *New Order from DataFoodMart*",
      "",
      `*Order ID:* ${orderId}`,
      `*Customer:* ${form.name}`,
      `*Phone:* ${form.phone}`,
      form.email ? `*Email:* ${form.email}` : "",
      "",
      "*Items:*",
      ...items.map(
        (item) =>
          `  • ${item.product.name} × ${item.quantity} — ₦${(item.product.price * item.quantity).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
      ),
      "",
      `*Subtotal:* ₦${subtotal.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
      `*Tax (7.5%):* ₦${tax.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
      `*Total:* ₦${total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`,
      "",
      "*Delivery Address:*",
      `  ${form.street}, ${form.city}, ${form.state}${form.zipCode ? " " + form.zipCode : ""}, ${form.country}`,
      form.note ? `\n*Note:* ${form.note}` : "",
    ]
      .filter((l) => l !== "")
      .join("\n");
    return lines;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Save order to Firestore
      const orderPayload = {
        userId: user?.uid ?? null,
        customerEmail: form.email || null,
        items: items.map((item) => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            image: item.product.image,
            category: item.product.category ?? "",
          },
          quantity: item.quantity,
          price: item.product.price,
        })),
        subtotal,
        tax,
        total,
        shippingAddress: {
          name: form.name,
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderPayload);
      const orderId = docRef.id;

      // 2. Clear cart
      clearCart();

      // 3. Build WhatsApp URL
      const message = buildWhatsAppMessage(orderId);
      const waUrl = `https://wa.me/${VENDOR_WHATSAPP}?text=${encodeURIComponent(message)}`;

      // 4. Open WhatsApp then redirect to success page
      window.open(waUrl, "_blank", "noopener,noreferrer");
      router.push(`/order-success?orderId=${orderId}`);
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function field(key: keyof FormData) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      },
    };
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-green-500">Home</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-green-500">Cart</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* Left — form */}
            <div className="space-y-6">
              {/* Contact */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      {...field("name")}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        errors.name ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      {...field("phone")}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...field("email")}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>
              </section>

              {/* Delivery address */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5">Delivery Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="12 Market Road"
                      {...field("street")}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        errors.street ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                    />
                    {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Lagos"
                      {...field("city")}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        errors.city ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                    />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">State <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Lagos State"
                      {...field("state")}
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        errors.state ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                    />
                    {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP / Postal Code</label>
                    <input
                      type="text"
                      placeholder="100001"
                      {...field("zipCode")}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                    <input
                      type="text"
                      {...field("country")}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>
              </section>

              {/* Order note */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5">Order Note <span className="text-gray-400 font-normal text-sm">(optional)</span></h2>
                <textarea
                  rows={3}
                  placeholder="Any special instructions for your order…"
                  {...field("note")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                />
              </section>
            </div>

            {/* Right — order summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-6">
                <h2 className="text-base font-bold text-gray-900 mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-start gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 shrink-0">
                        ₦{(item.product.price * item.quantity).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Tax (7.5%)</span>
                    <span>₦{tax.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
                    <span>Total</span>
                    <span>₦{total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {submitError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-5 w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-colors inline-flex items-center justify-center gap-2 text-sm"
                >
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Placing Order…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.858L.057 23.571a.75.75 0 00.921.921l5.713-1.478A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.524-5.188-1.437l-.372-.22-3.392.877.897-3.293-.239-.381A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                      Place Order via WhatsApp
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Your order will be saved and you&apos;ll be connected to our vendor on WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
