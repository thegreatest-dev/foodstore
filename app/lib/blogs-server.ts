import { adminDb } from "@/app/lib/firebase-admin";
import { BlogPost } from "@/app/types/blog";

const COL = "blogs";

function toMillis(value: unknown): number {
  const iso = toIso(value);
  if (!iso) return 0;
  const ms = new Date(iso).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

function toIso(value: unknown): string {
  if (!value) return "";

  if (typeof value === "object" && value !== null && "toDate" in value) {
    const dated = (value as { toDate: () => Date }).toDate();
    return dated.toISOString();
  }

  if (value instanceof Date) return value.toISOString();

  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
}

function toPost(id: string, data: FirebaseFirestore.DocumentData): BlogPost {
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
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

export async function getAllPostsServer(): Promise<BlogPost[]> {
  const snap = await adminDb.collection(COL).get();
  const posts = snap.docs.map((d) => toPost(d.id, d.data()));
  return posts.sort(
    (a, b) => toMillis(b.createdAt) - toMillis(a.createdAt)
  );
}

export async function getPublishedPostsServer(): Promise<BlogPost[]> {
  const snap = await adminDb.collection(COL).where("published", "==", true).get();
  const posts = snap.docs.map((d) => toPost(d.id, d.data()));
  return posts.sort(
    (a, b) => toMillis(b.createdAt) - toMillis(a.createdAt)
  );
}

export async function getPostBySlugServer(slug: string): Promise<BlogPost | null> {
  const snap = await adminDb
    .collection(COL)
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (snap.empty) return null;
  const d = snap.docs[0];
  return toPost(d.id, d.data());
}