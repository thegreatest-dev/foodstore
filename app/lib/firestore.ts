import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { Product } from "@/app/types/product";
import { Order } from "@/app/types/order";

// Products
export const getProducts = async (): Promise<Product[]> => {
  const productsCol = collection(db, "products");
  const productsSnapshot = await getDocs(productsCol);
  return productsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};

export const getProduct = async (id: string): Promise<Product | null> => {
  const productDoc = doc(db, "products", id);
  const productSnapshot = await getDoc(productDoc);
  if (productSnapshot.exists()) {
    return { id: productSnapshot.id, ...productSnapshot.data() } as Product;
  }
  return null;
};

// Orders
export const createOrder = async (order: Omit<Order, "id">): Promise<string> => {
  const ordersCol = collection(db, "orders");
  const docRef = await addDoc(ordersCol, order);
  return docRef.id;
};

export const getOrder = async (id: string): Promise<Order | null> => {
  const orderDoc = doc(db, "orders", id);
  const orderSnapshot = await getDoc(orderDoc);
  if (orderSnapshot.exists()) {
    return { id: orderSnapshot.id, ...orderSnapshot.data() } as Order;
  }
  return null;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const ordersCol = collection(db, "orders");
  const q = query(
    ordersCol,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const ordersSnapshot = await getDocs(q);
  return ordersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
};
