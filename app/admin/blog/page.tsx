"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getAllPostsAction,
  createPostAction,
  updatePostAction,
  deletePostAction,
  setPostPublishedAction,
  setPostsPublishedAction,
} from "@/app/actions/blog-actions";
import { BlogPost } from "@/app/types/blog";

type FormState = Omit<BlogPost, "id" | "createdAt" | "updatedAt">;

const empty: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "",
  author: "",
  published: false,
};

const CATEGORIES = [
  "Recipes",
  "Nutrition",
  "Health Tips",
  "Farm Stories",
  "Seasonal",
  "General",
];

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<FormState>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [bulkPublishing, setBulkPublishing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const loadedPosts = await getAllPostsAction();
      setPosts(loadedPosts);
      setError("");
      setSelectedIds((prev) => prev.filter((id) => loadedPosts.some((p) => p.id === id)));
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to load posts.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = { ...form, slug: form.slug.trim() || slugify(form.title) };
      if (editing) {
        await updatePostAction(editing, payload);
        setSuccess("Post updated successfully.");
      } else {
        await createPostAction(payload);
        setSuccess("Post published successfully.");
      }
      setForm(empty);
      setEditing(null);
      setShowForm(false);
      await load();
    } catch {
      setError("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditing(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      category: post.category,
      author: post.author,
      published: post.published,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditing(null);
    setForm(empty);
    setShowForm(false);
    setError("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await deletePostAction(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Failed to delete post.");
    } finally {
      setDeleting(null);
    }
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) {
        setError("You can select up to 3 posts at once.");
        return prev;
      }
      setError("");
      return [...prev, id];
    });
  };

  const handleSinglePublishToggle = async (post: BlogPost) => {
    setPublishing(post.id);
    setError("");
    setSuccess("");
    try {
      const nextPublished = !post.published;
      await setPostPublishedAction(post.id, nextPublished);
      setPosts((prev) =>
        prev.map((item) =>
          item.id === post.id
            ? { ...item, published: nextPublished }
            : item
        )
      );
      setSuccess(nextPublished ? "Post published." : "Post unpublished.");
    } catch {
      setError("Failed to update post status.");
    } finally {
      setPublishing(null);
    }
  };

  const handleBulkPublish = async (published: boolean) => {
    if (selectedIds.length === 0) {
      setError("Select at least one post first.");
      return;
    }
    if (selectedIds.length > 3) {
      setError("You can only update up to 3 posts at once.");
      return;
    }

    setBulkPublishing(true);
    setError("");
    setSuccess("");
    try {
      await setPostsPublishedAction(selectedIds, published);
      setPosts((prev) =>
        prev.map((item) =>
          selectedIds.includes(item.id)
            ? { ...item, published }
            : item
        )
      );
      setSelectedIds([]);
      setSuccess(
        published
          ? "Selected posts published successfully."
          : "Selected posts unpublished successfully."
      );
    } catch {
      setError("Failed to update selected posts.");
    } finally {
      setBulkPublishing(false);
    }
  };

  if (showForm || editing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-5 flex items-center gap-3">
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {editing ? "Edit Post" : "New Blog Post"}
          </h1>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Title *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!editing) set("slug", slugify(e.target.value));
                }}
                placeholder="e.g. 5 Benefits of Eating Fresh Vegetables"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                Slug (URL)
              </label>
              <input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="auto-generated from title"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 font-mono"
              />
              {form.slug && (
                <p className="mt-1 text-xs text-gray-400">/blog/{form.slug || slugify(form.title)}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Author */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Author</label>
                <input
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Cover Image URL</label>
              <input
                value={form.coverImage}
                onChange={(e) => set("coverImage", e.target.value)}
                placeholder="https://... or /images/cover.jpg"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {form.coverImage && (
                <div className="mt-3 relative h-32 w-full rounded-xl overflow-hidden border border-gray-100">
                  <Image src={form.coverImage} alt="Cover preview" fill className="object-cover" />
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Excerpt</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="Short summary shown on the blog listing page..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Content</label>
              <textarea
                rows={12}
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder="Write the full post content here..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-y"
              />
            </div>

            {/* Published toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                onClick={() => set("published", !form.published)}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.published ? "bg-green-500" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.published ? "translate-x-5" : ""}`}
                />
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {form.published ? "Published" : "Draft"}
              </span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : editing ? "Update Post" : "Save Post"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-gray-400 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Blog</h1>
            <p className="text-xs text-gray-400">{posts.length} posts</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(""); setSuccess(""); }}
          className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}
        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No posts yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-gray-500">
                {selectedIds.length} selected (max 3)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkPublish(true)}
                  disabled={bulkPublishing || selectedIds.length === 0}
                  className="text-xs px-3 py-1.5 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {bulkPublishing ? "Updating…" : "Publish Selected"}
                </button>
                <button
                  onClick={() => handleBulkPublish(false)}
                  disabled={bulkPublishing || selectedIds.length === 0}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors disabled:opacity-50"
                >
                  {bulkPublishing ? "Updating…" : "Unpublish Selected"}
                </button>
              </div>
            </div>

            <div className="bg-white overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="text-center px-3 py-4 font-semibold w-12">Sel</th>
                  <th className="text-left px-6 py-4 font-semibold">Post</th>
                  <th className="text-left px-4 py-4 font-semibold hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-4 font-semibold hidden md:table-cell">Author</th>
                  <th className="text-center px-4 py-4 font-semibold">Status</th>
                  <th className="text-right px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(post.id)}
                        onChange={() => toggleSelected(post.id)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {post.coverImage ? (
                            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                          <p className="text-xs text-gray-400 font-mono">/blog/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      {post.category && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">{post.category}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-500 hidden md:table-cell">{post.author || "—"}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSinglePublishToggle(post)}
                          disabled={publishing === post.id}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40 ${
                            post.published
                              ? "border-orange-200 text-orange-600 hover:border-orange-300"
                              : "border-green-200 text-green-600 hover:border-green-300"
                          }`}
                        >
                          {publishing === post.id
                            ? "…"
                            : post.published
                              ? "Unpublish"
                              : "Publish"}
                        </button>
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-green-400 hover:text-green-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleting === post.id}
                          className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        >
                          {deleting === post.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
