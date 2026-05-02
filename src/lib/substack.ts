import { SubstackPost } from "@/types";

const FEED_URL =
  process.env.SUBSTACK_FEED_URL ?? "https://example.substack.com/feed";

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return (match?.[1] ?? match?.[2] ?? "").trim();
}

function extractItems(xml: string): string[] {
  const items: string[] = [];
  const pattern = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = pattern.exec(xml)) !== null) {
    items.push(match[1]);
  }
  return items;
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    return extractItems(xml).map((item) => {
      const pubDate = extractTag(item, "pubDate");
      return {
        title: extractTag(item, "title"),
        url: extractTag(item, "link"),
        date: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        category: extractTag(item, "category") || undefined,
        excerpt: extractTag(item, "description").replace(/<[^>]+>/g, "").slice(0, 160) || undefined,
      };
    });
  } catch {
    return [];
  }
}
