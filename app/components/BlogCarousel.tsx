"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  createdAt?: string | Date | { toDate?: () => Date };
}

interface BlogCarouselProps {
  posts: Post[];
}

const INTERVAL = 4000;

function formatDate(raw: Post["createdAt"]): string {
  if (!raw) return "";
  const d =
    raw instanceof Date
      ? raw
      : typeof raw === "object" && typeof raw.toDate === "function"
      ? raw.toDate()
      : new Date(raw as string);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogCarousel({ posts }: BlogCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = posts.length;

  const start = () => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, INTERVAL);
  };

  useEffect(() => {
    if (total < 2) return;
    start();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  useEffect(() => {
    if (total < 2) return;
    if (timerRef.current) clearInterval(timerRef.current);
    if (!paused) start();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, total]);

  const goTo = (i: number) => {
    setActive(i);
    if (timerRef.current) clearInterval(timerRef.current);
    if (!paused) start();
  };

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-300">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm">No posts yet — check back soon!</p>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Sliding track */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {posts.map((post) => (
            <div key={post.id} className="w-full shrink-0 px-1">
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                {/* Cover image */}
                <div className="relative h-52 sm:h-64 w-full bg-gray-100">
                  <Image
                    src={post.coverImage || "/images/12_spice.jfif"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  {/* Date pill */}
                  <span className="absolute bottom-4 left-4 bg-green-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6">
                  {post.author && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>{post.author}</span>
                    </div>
                  )}
                  <h3 className="text-product-name font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>
                  )}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm text-green-600 font-semibold inline-flex items-center gap-1.5 hover:gap-2.5 transition-all"
                  >
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {total > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {posts.map((post, i) => (
            <button
              key={post.id}
              onClick={() => goTo(i)}
              aria-label={`Go to post ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === active
                  ? "w-6 h-2.5 bg-green-500"
                  : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
