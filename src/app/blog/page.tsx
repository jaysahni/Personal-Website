import type { Metadata } from "next";
import { getSubstackPosts } from "@/lib/substack";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const posts = await getSubstackPosts();
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <>
      <h1 className="text-2xl font-semibold mb-8">blog</h1>

      {sortedPosts.length > 0 ? (
        <div className="space-y-1">
          {sortedPosts.map((post) => (
            <div key={post.url} className="group border-b border-border">
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-4 transition-colors"
              >
                <span className="text-text-primary group-hover:text-accent transition-colors">
                  {post.title}{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </span>
                <div className="flex items-center gap-3 text-xs text-text-muted shrink-0 ml-4">
                  <span>{formatDate(post.date)}</span>
                  {post.category && (
                    <span className="px-2 py-0.5 bg-surface border border-border rounded">
                      {post.category}
                    </span>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-text-muted">no posts yet.</p>
      )}
    </>
  );
}
