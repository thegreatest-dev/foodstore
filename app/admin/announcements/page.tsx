"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

interface Announcement {
  id: string;
  title: string;
  message: string;
  active: boolean;
  createdAt?: { seconds: number };
}

const emptyForm = { title: "", message: "", active: true };

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, "announcements"), orderBy("createdAt", "desc"))
      );
      setAnnouncements(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Announcement, "id">) }))
      );
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const startEdit = (a: Announcement) => {
    setEditing(a);
    setForm({ title: a.title, message: a.message, active: a.active });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.message.trim()) return setError("Message is required.");
    setSaving(true);
    try {
      if (editing) {
        await updateDoc(doc(db, "announcements", editing.id), {
          ...form,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "announcements"), {
          ...form,
          createdAt: serverTimestamp(),
        });
      }
      cancelEdit();
      fetchAll();
    } catch {
      setError("Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    setDeleting(id);
    await deleteDoc(doc(db, "announcements", id));
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setDeleting(null);
  };

  const toggleActive = async (a: Announcement) => {
    await updateDoc(doc(db, "announcements", a.id), { active: !a.active });
    setAnnouncements((prev) =>
      prev.map((x) => (x.id === a.id ? { ...x, active: !x.active } : x))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-5 flex items-center gap-3">
        <Link href="/admin" className="text-gray-400 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Announcements</h1>
          <p className="text-xs text-gray-400">{announcements.length} total</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              {editing ? "Edit Announcement" : "New Announcement"}
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Weekend Sale!"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Message *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Enter announcement content..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                  className={`relative w-10 h-6 rounded-full transition-colors ${form.active ? "bg-green-500" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.active ? "left-5" : "left-1"}`} />
                </button>
                <span className="text-sm text-gray-600">Active</span>
              </div>

              <div className="flex gap-2 pt-1">
                {editing && (
                  <button type="button" onClick={cancelEdit} className="flex-1 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-3 space-y-3">
          {loading ? (
            <div className="text-center text-sm text-gray-400 py-12">Loading...</div>
          ) : announcements.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-12">No announcements yet.</div>
          ) : (
            announcements.map((a) => (
              <div
                key={a.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm transition-colors ${a.active ? "border-orange-200" : "border-gray-100 opacity-60"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{a.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${a.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {a.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{a.message}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end flex-shrink-0 sm:flex-nowrap">
                    <button
                      onClick={() => toggleActive(a)}
                      className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 bg-white hover:border-green-400 hover:text-green-600 transition-colors"
                    >
                      {a.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => startEdit(a)}
                      className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 bg-white hover:border-orange-400 hover:text-orange-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={deleting === a.id}
                      className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-600 bg-white hover:border-red-400 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                      {deleting === a.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
