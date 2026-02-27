"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ComingSoonPopup() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000); // 2 seconds before redirect
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="animate-bounce-out bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center">
        <span className="text-3xl font-bold text-green-600 mb-2">Coming Soon!</span>
        <span className="text-gray-600 text-lg">Redirecting to homepage...</span>
      </div>
      <style jsx global>{`
        @keyframes bounce-out {
          0% { transform: scale(1); }
          70% { transform: scale(1.1); }
          100% { transform: scale(0.7) translateY(-100px); opacity: 0; }
        }
        .animate-bounce-out {
          animation: bounce-out 1.2s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
      `}</style>
    </div>
  );
}
