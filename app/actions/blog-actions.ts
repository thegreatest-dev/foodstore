"use server";

import { adminDb } from "@/app/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { BlogPost } from "@/app/types/blog";
import { getAllPostsServer } from "@/app/lib/blogs-server";

const COL = "blogs";

export async function getAllPostsAction(): Promise<BlogPost[]> {
  return getAllPostsServer();
}

export async function createPostAction(
  data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  await adminDb.collection(COL).add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function updatePostAction(
  id: string,
  data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  await adminDb.collection(COL).doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function deletePostAction(id: string): Promise<void> {
  await adminDb.collection(COL).doc(id).delete();
}

export async function setPostPublishedAction(
  id: string,
  published: boolean
): Promise<void> {
  await adminDb.collection(COL).doc(id).update({
    published,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function setPostsPublishedAction(
  ids: string[],
  published: boolean
): Promise<void> {
  const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
  if (uniqueIds.length === 0) return;
  if (uniqueIds.length > 3) {
    throw new Error("You can only update up to 3 posts at once.");
  }

  const batch = adminDb.batch();
  uniqueIds.forEach((id) => {
    const postRef = adminDb.collection(COL).doc(id);
    batch.update(postRef, {
      published,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  await batch.commit();
}
