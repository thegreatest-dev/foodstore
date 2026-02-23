import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { BlogPost } from "@/app/types/blog";

const COL = "blogs";
const ref = collection(db, COL);

function toPost(id: string, data: DocumentData): BlogPost {
  const toStr = (ts: unknown) =>
    ts instanceof Timestamp ? ts.toDate().toISOString() : String(ts ?? "");
  return {
    id,
    title: String(data.title ?? ""),
    slug: String(data.slug ?? ""),
    excerpt: String(data.excerpt ?? ""),
    content: String(data.content ?? ""),
    coverImage: String(data.coverImage ?? ""),
    category: String(data.category ?? ""),
    author: String(data.author ?? ""),
    published: Boolean(data.published ?? false),
    createdAt: toStr(data.createdAt),
    updatedAt: toStr(data.updatedAt),
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const snap = await getDocs(query(ref, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => toPost(d.id, d.data()));
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const snap = await getDocs(
    query(ref, where("published", "==", true), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => toPost(d.id, d.data()));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const snap = await getDocs(query(ref, where("slug", "==", slug)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return toPost(d.id, d.data());
}

export async function createPost(
  data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
) {
  await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updatePost(id: string, data: Partial<BlogPost>) {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deletePost(id: string) {
  await deleteDoc(doc(db, COL, id));
}
