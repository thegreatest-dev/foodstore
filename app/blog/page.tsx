import Image from "next/image";
import Link from "next/link";
import { getPublishedPostsServer } from "@/app/lib/blogs-server";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedPostsServer().catch(() => []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 to-orange-50 py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-500">
            Our Blog
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Fresh{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-green-500">Tips & Stories</span>
              <span className="absolute bottom-0 left-0 h-2.5 w-full rounded-full bg-green-100 -z-10" />
            </span>
          </h1>
          <p className="mt-3 text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
            Recipes, nutrition tips, and the latest from our kitchen — updated weekly.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">No posts published yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Cover */}
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={post.coverImage || "/placeholder.png"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  {post.category && (
                    <span className="absolute bottom-3 left-3 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-4 gap-2">
                  <h2 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <p className="text-xs text-gray-300">
                      {post.author && <span className="text-gray-500 font-medium">{post.author}</span>}
                      {post.author && post.createdAt && " · "}
                      {post.createdAt && new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <span className="text-green-500 text-xs font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
