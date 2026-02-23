"use server";

import { adminDb } from "@/app/lib/firebase-admin";
import { OrderStatus } from "@/app/types/order";
import { FieldValue } from "firebase-admin/firestore";

export interface SerializedOrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface SerializedOrder {
  id: string;
  userId: string | null;
  customerName: string;
  customerEmail: string | null;
  items: SerializedOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: OrderStatus;
  createdAt: string;
  updatedAt: string | null;
}

export async function getAllOrdersAction(): Promise<SerializedOrder[]> {
  const snap = await adminDb
    .collection("orders")
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map((doc) => {
    const d = doc.data();

    const items: SerializedOrderItem[] = (d.items ?? []).map(
      (item: {
        product?: { id?: string; name?: string; image?: string };
        productId?: string;
        name?: string;
        image?: string;
        quantity: number;
        price: number;
      }) => ({
        productId: item.product?.id ?? item.productId ?? "",
        name: item.product?.name ?? item.name ?? "Unknown product",
        image: item.product?.image ?? item.image ?? "",
        quantity: item.quantity,
        price: item.price,
      })
    );

    return {
      id: doc.id,
      userId: d.userId ?? null,
      customerName: d.shippingAddress?.name ?? "Unknown",
      customerEmail: d.customerEmail ?? null,
      items,
      subtotal: d.subtotal ?? 0,
      tax: d.tax ?? 0,
      total: d.total ?? 0,
      shippingAddress: d.shippingAddress ?? {
        name: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      status: d.status ?? "pending",
      createdAt: d.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
      updatedAt: d.updatedAt?.toDate?.()?.toISOString?.() ?? null,
    } satisfies SerializedOrder;
  });
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  await adminDb.collection("orders").doc(orderId).update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function getOrderCountAction(): Promise<number> {
  const snap = await adminDb.collection("orders").count().get();
  return snap.data().count;
}
