import { BLOGGER_CONFIG, isBloggerConfigured } from "./bloggerConfig";
import type { NewsPost } from "./mockData";

// ── Blogger JSON Feed approach (no API key needed, works via public feeds) ──

interface FeedEntry {
  title: { $t: string };
  content?: { $t: string };
  summary?: { $t: string };
  published: { $t: string };
  link: { rel: string; href: string }[];
  author: { name: { $t: string } }[];
  category?: { term: string }[];
  media$thumbnail?: { url: string };
}

interface FeedResponse {
  feed: {
    entry?: FeedEntry[];
  };
}

// Extract first image from HTML content
const extractImage = (html: string): string => {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1] || "https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=600&h=400&fit=crop";
};

// Strip HTML and get excerpt
const extractExcerpt = (html: string, maxLength = 150): string => {
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// Format date to Bangla
const formatBanglaDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const banglaMonths = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const toBangla = (n: number) => String(n).split("").map(d => banglaDigits[parseInt(d)]).join("");
  return `${toBangla(date.getDate())} ${banglaMonths[date.getMonth()]}, ${toBangla(date.getFullYear())}`;
};

const getPostUrl = (entry: FeedEntry): string => {
  const altLink = entry.link.find(l => l.rel === "alternate");
  return altLink?.href || "#";
};

const getImage = (entry: FeedEntry): string => {
  if (entry.media$thumbnail) {
    // Blogger thumbnails are small (s72-c), upscale to s600-c
    return entry.media$thumbnail.url.replace(/s72-c/, "s600-c");
  }
  const content = entry.content?.$t || entry.summary?.$t || "";
  return extractImage(content);
};

const transformFeedEntry = (entry: FeedEntry): NewsPost => {
  const content = entry.content?.$t || entry.summary?.$t || "";
  const labels = entry.category?.map(c => c.term) || [];
  // Skip "শীর্ষ সংবাদ" label, use first real label
  const visibleLabel = labels.find(l => l !== "শীর্ষ সংবাদ") || labels[0] || "সাধারণ";

  return {
    id: getPostUrl(entry), // use URL as unique ID
    title: entry.title.$t,
    excerpt: extractExcerpt(content),
    image: getImage(entry),
    label: visibleLabel,
    date: formatBanglaDate(entry.published.$t),
    readTime: `${Math.max(2, Math.ceil(content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200))} মিনিট`,
    author: entry.author?.[0]?.name?.$t || "গলাচিপা প্রতিদিন",
  };
};

// Fetch via Blogger JSON feed (public, no API key needed)
const fetchFeed = async (url: string): Promise<FeedEntry[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Feed error: ${res.status}`);
  const data: FeedResponse = await res.json();
  return data.feed?.entry || [];
};

const BLOG_BASE = BLOGGER_CONFIG.blogUrl.replace(/\/$/, "");

// Label aliases for fallback (try multiple label names)
const LABEL_ALIASES: Record<string, string[]> = {
  "সারাদেশ": ["সারাদেশ", "জাতীয়", "দেশ"],
  "জাতীয়": ["জাতীয়", "সারাদেশ", "দেশ"],
  "বিশ্ব": ["বিশ্ব", "আন্তর্জাতিক"],
  "আন্তর্জাতিক": ["আন্তর্জাতিক", "বিশ্ব"],
  "আলোচিত": ["আলোচিত", "ট্রেন্ডিং"],
};

// Fetch posts by label (with alias fallback)
export const fetchPostsByLabel = async (label: string, maxResults = 6): Promise<NewsPost[]> => {
  if (!isBloggerConfigured()) return [];

  const candidates = LABEL_ALIASES[label] || [label];

  for (const candidate of candidates) {
    try {
      const url = `${BLOG_BASE}/feeds/posts/default/-/${encodeURIComponent(candidate)}?alt=json&max-results=${maxResults}`;
      const entries = await fetchFeed(url);
      if (entries.length > 0) {
        return entries.map(transformFeedEntry);
      }
    } catch (err) {
      console.warn(`Feed fetch failed for label "${candidate}":`, err);
    }
  }

  console.warn(`No posts found for label "${label}" (tried: ${candidates.join(", ")})`);
  return [];
};

// Fetch latest posts
export const fetchLatestPosts = async (maxResults = 10): Promise<NewsPost[]> => {
  if (!isBloggerConfigured()) return [];

  try {
    const url = `${BLOG_BASE}/feeds/posts/default?alt=json&max-results=${maxResults}`;
    const entries = await fetchFeed(url);
    return entries.map(transformFeedEntry);
  } catch (err) {
    console.error("Error fetching latest posts:", err);
    return [];
  }
};

// Search posts
export const searchPosts = async (query: string, maxResults = 10): Promise<NewsPost[]> => {
  if (!isBloggerConfigured()) return [];

  try {
    const url = `${BLOG_BASE}/feeds/posts/default?alt=json&q=${encodeURIComponent(query)}&max-results=${maxResults}`;
    const entries = await fetchFeed(url);
    return entries.map(transformFeedEntry);
  } catch (err) {
    console.error("Error searching posts:", err);
    return [];
  }
};
