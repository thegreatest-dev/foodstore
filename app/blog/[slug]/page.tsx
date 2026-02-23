import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlugServer, getPublishedPostsServer } from "@/app/lib/blogs-server";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedPostsServer().catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlugServer(slug).catch(() => null);
  if (!post || !post.published) notFound();

  return (
    <main className="min-h-screen bg-white">
      {/* Back link */}
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Meta */}
        {post.category && (
          <span className="inline-block rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-3">
            {post.category}
          </span>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug mb-3">
          {post.title}
        </h1>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          {post.author && (
            <>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-gray-500">{post.author}</span>
              <span>·</span>
            </>
          )}
          {post.createdAt && (
            <span>
              {new Date(post.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative h-56 sm:h-72 w-full rounded-2xl overflow-hidden mb-8 bg-gray-100">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Excerpt callout */}
        {post.excerpt && (
          <blockquote className="border-l-4 border-green-400 pl-4 mb-8 text-gray-600 text-sm italic leading-relaxed">
            {post.excerpt}
          </blockquote>
        )}

        {/* Content */}
        <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
          {post.content}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-green-600 font-semibold hover:gap-3 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Posts
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-green-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-green-600 transition-colors"
          >
            Shop Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </article>
    </main>
  );
}
