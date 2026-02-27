"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const VENDOR_WHATSAPP = "2348168951201";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
        {/* Checkmark */}
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 text-sm mb-6">
          Thank you for shopping with DATAFoodMart. Your order has been saved and our vendor will be in touch shortly.
        </p>

        {orderId && (
          <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6 text-sm">
            <p className="text-gray-500 mb-1">Order ID</p>
            <p className="font-mono font-semibold text-gray-800 break-all">{orderId}</p>
          </div>
        )}

        <a
          href={`https://wa.me/${VENDOR_WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mb-3 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-2xl transition-colors text-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.858L.057 23.571a.75.75 0 00.921.921l5.713-1.478A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.524-5.188-1.437l-.372-.22-3.392.877.897-3.293-.239-.381A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Chat with Vendor on WhatsApp
        </a>

        <Link
          href="/products"
          className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition-colors text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  );
}
