import { db } from "@/app/lib/firebase";
import { Product } from "@/app/types/product";
import {
  collection,
  deleteField,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { getProductsByIds } from "@/app/lib/products";

const productsRef = collection(db, "products");

function sortDealEntries(items: { id: string; order: number }[]): string[] {
  return items
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.id);
}

export async function getDealProductIds(): Promise<string[]> {
  const snapshot = await getDocs(query(productsRef, where("isDealOfWeek", "==", true)));
  const entries = snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    const order = typeof data.dealOrder === "number" ? data.dealOrder : Number.MAX_SAFE_INTEGER;
    return { id: docSnap.id, order };
  });

  if (entries.length === 0) {
    return [];
  }

  return sortDealEntries(entries);
}

export async function saveDealProductIds(productIds: string[]): Promise<void> {
  const batch = writeBatch(db);
  const currentSnapshot = await getDocs(query(productsRef, where("isDealOfWeek", "==", true)));
  const keep = new Set(productIds);

  currentSnapshot.docs.forEach((docSnap) => {
    if (keep.has(docSnap.id)) {
      return;
    }

    batch.set(
      doc(db, "products", docSnap.id),
      {
        isDealOfWeek: deleteField(),
        dealOrder: deleteField(),
      },
      { merge: true }
    );
  });

  productIds.forEach((productId, index) => {
    batch.set(
      doc(db, "products", productId),
      {
        isDealOfWeek: true,
        dealOrder: index,
      },
      { merge: true }
    );
  });

  await batch.commit();
}

export async function getDealProducts(): Promise<Product[]> {
  const ids = await getDealProductIds();
  if (ids.length === 0) {
    return [];
  }

  const products = await getProductsByIds(ids);
  const lookup = new Map(products.map((product) => [product.id, product]));
  return ids
    .map((id) => lookup.get(id))
    .filter((product): product is Product => Boolean(product));
}
