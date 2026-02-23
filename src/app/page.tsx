import Link from "next/link";
import Divider from "@/components/ui/Divider";
import { blogPosts } from "@/data/blog-posts";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <>
      <section>
        <h1 className="text-3xl font-semibold">hey, i&apos;m jay</h1>
        <p className="text-text-secondary mt-3 leading-relaxed max-w-xl">
          a software engineer from Houston, Texas interested in building
          software that applies AI agents to real-world problems.
        </p>
      </section>

      <Divider />

      <section>
        <h2 className="text-lg font-medium text-text-primary mb-4">about me</h2>
        <p className="text-text-secondary leading-relaxed">
          I&apos;m currently a Software Engineer at a stealth startup, where we&apos;re
          creating RL environments to improve frontier models. Previously an AI Intern
          at Nuntius (YC S25). I&apos;m an incoming Electrical Engineering student at
          Georgia Tech. Outside of work, I enjoy creative writing, playing guitar,
          and running.
        </p>
      </section>

      <Divider />

      <section>
        <h2 className="text-lg font-medium text-text-primary mb-6">latest posts</h2>
        {latestPosts.length > 0 ? (
          <div className="space-y-4">
            {latestPosts.map((post) => (
              <div key={post.slug} className="group">
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center justify-between py-2 transition-colors"
                >
                  <span className="text-text-primary group-hover:text-accent transition-colors">
                    {post.title}{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </span>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span>{formatDate(post.date)}</span>
                    <span className="px-2 py-0.5 bg-surface border border-border rounded text-text-muted">
                      {post.category}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-sm">posts coming soon...</p>
        )}
      </section>
    </>
  );
}
