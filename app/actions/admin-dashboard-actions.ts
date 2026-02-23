"use server";

import { adminDb } from "@/app/lib/firebase-admin";

export type AdminDashboardCounts = {
  products: number;
  announcements: number;
  blogs: number;
  deals: number;
};

export async function getAdminDashboardCountsAction(): Promise<AdminDashboardCounts> {
  const [productsSnap, announcementsSnap, blogsSnap, dealsSnap] = await Promise.all([
    adminDb.collection("products").get(),
    adminDb.collection("announcements").get(),
    adminDb.collection("blogs").get(),
    adminDb.collection("products").where("isDealOfWeek", "==", true).get(),
  ]);

  return {
    products: productsSnap.size,
    announcements: announcementsSnap.size,
    blogs: blogsSnap.size,
    deals: dealsSnap.size,
  };
}
