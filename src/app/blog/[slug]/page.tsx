import { blogPosts } from "@/data/blog-posts";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const post = blogPosts.find((p) => p.slug === slug);
    return { title: post?.title ?? "Post Not Found" };
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <div className="flex items-center gap-3 mt-2 text-sm text-text-muted">
          <span>{formatDate(post.date)}</span>
          <span className="px-2 py-0.5 bg-surface border border-border rounded text-xs">
            {post.category}
          </span>
        </div>
      </header>
      <div
        className="text-text-secondary leading-relaxed space-y-4 [&_p]:mb-4 [&_a]:text-accent [&_a]:underline [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-text-primary [&_h2]:mt-8 [&_h2]:mb-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
