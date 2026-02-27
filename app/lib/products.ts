import { db } from "@/app/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  query,
  where,
  documentId,
  DocumentData,
} from "firebase/firestore";
import { Product, ProductFilter } from "@/app/types/product";

const productsRef = collection(db, "products");

function removeUndefinedFields<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
}

function toProduct(id: string, data: DocumentData): Product {
  return {
    id,
    name: data.name ?? "",
    description: data.description ?? "",
    price: data.price ?? 0,
    originalPrice: data.originalPrice,
    image: data.image ?? "",
    category: data.category ?? "",
    stock: data.stock ?? 0,
    rating: data.rating,
    specifications: Array.isArray(data.specifications) ? data.specifications : [],
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    isDealOfWeek: Boolean(data.isDealOfWeek),
    dealOrder: typeof data.dealOrder === "number" ? data.dealOrder : undefined,
  };
}

export async function getProducts(filter?: ProductFilter): Promise<Product[]> {
  let q = query(productsRef, orderBy("createdAt", "desc"));

  if (filter?.category) {
    q = query(productsRef, where("category", "==", filter.category), orderBy("createdAt", "desc"));
  }

  const snapshot = await getDocs(q);
  let products = snapshot.docs.map((d) => toProduct(d.id, d.data()));

  if (filter?.minPrice !== undefined) {
    products = products.filter((p) => p.price >= filter.minPrice!);
  }
  if (filter?.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= filter.maxPrice!);
  }
  if (filter?.searchQuery) {
    const q = filter.searchQuery.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return products;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];

  const chunkSize = 10;
  const batches: Product[] = [];

  for (let i = 0; i < ids.length; i += chunkSize) {
    const slice = ids.slice(i, i + chunkSize);
    const snapshot = await getDocs(query(productsRef, where(documentId(), "in", slice)));
    snapshot.docs.forEach((d) => {
      batches.push(toProduct(d.id, d.data()));
    });
  }

  const byId = new Map(batches.map((product) => [product.id, product]));
  return ids.map((id) => byId.get(id)).filter((product): product is Product => Boolean(product));
}

export async function getProductById(productId: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", productId));
  if (!snap.exists()) return null;
  return toProduct(snap.id, snap.data());
}

export async function addProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
) {
  const payload = removeUndefinedFields(product as unknown as Record<string, unknown>);
  return await addDoc(productsRef, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProduct(productId: string, data: Partial<Product>) {
  const docRef = doc(db, "products", productId);
  const payload = removeUndefinedFields(data as Record<string, unknown>);
  return await updateDoc(docRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(productId: string) {
  return await deleteDoc(doc(db, "products", productId));
}
