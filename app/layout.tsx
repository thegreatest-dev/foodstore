import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import CartSidebar from "@/app/components/cart/CartSidebar";
import { AuthProvider } from "@/app/context/AuthContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HomeDokan - Farm Fresh Organic Products | Premium Grocery Store",
  description: "Shop fresh organic vegetables, premium proteins, and quality groceries. Fast delivery, best prices, and 30% off on first purchase.",
  keywords: "organic food, fresh vegetables, grocery store, online shopping, food delivery",
  openGraph: {
    title: "HomeDokan - Farm Fresh Organic Products",
    description: "Your one-stop shop for fresh groceries and organic food",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
          <CartSidebar />
        </AuthProvider>
      </body>
    </html>
  );
}
