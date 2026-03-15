import { BLOGGER_CONFIG, isBloggerConfigured } from "./bloggerConfig";
import type { NewsPost } from "./mockData";

interface BloggerPost {
  id: string;
  title: string;
  content: string;
  published: string;
  url: string;
  author: { displayName: string };
  labels?: string[];
  images?: { url: string }[];
}

interface BloggerResponse {
  items?: BloggerPost[];
  nextPageToken?: string;
}

const BASE_URL = "https://www.googleapis.com/blogger/v3";

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

const transformPost = (post: BloggerPost): NewsPost => ({
  id: post.id,
  title: post.title,
  excerpt: extractExcerpt(post.content),
  image: post.images?.[0]?.url || extractImage(post.content),
  label: post.labels?.[0] || "সাধারণ",
  date: formatBanglaDate(post.published),
  readTime: `${Math.max(2, Math.ceil(post.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200))} মিনিট`,
  author: post.author.displayName,
});

// Fetch posts by label
export const fetchPostsByLabel = async (label: string, maxResults = 6): Promise<NewsPost[]> => {
  if (!isBloggerConfigured()) return [];

  try {
    const url = `${BASE_URL}/blogs/${BLOGGER_CONFIG.blogId}/posts?key=${BLOGGER_CONFIG.apiKey}&labels=${encodeURIComponent(label)}&maxResults=${maxResults}&fetchImages=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Blogger API error: ${res.status}`);
    const data: BloggerResponse = await res.json();
    return (data.items || []).map(transformPost);
  } catch (err) {
    console.error(`Error fetching posts for label "${label}":`, err);
    return [];
  }
};

// Fetch latest posts
export const fetchLatestPosts = async (maxResults = 10): Promise<NewsPost[]> => {
  if (!isBloggerConfigured()) return [];

  try {
    const url = `${BASE_URL}/blogs/${BLOGGER_CONFIG.blogId}/posts?key=${BLOGGER_CONFIG.apiKey}&maxResults=${maxResults}&fetchImages=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Blogger API error: ${res.status}`);
    const data: BloggerResponse = await res.json();
    return (data.items || []).map(transformPost);
  } catch (err) {
    console.error("Error fetching latest posts:", err);
    return [];
  }
};

// Search posts
export const searchPosts = async (query: string, maxResults = 10): Promise<NewsPost[]> => {
  if (!isBloggerConfigured()) return [];

  try {
    const url = `${BASE_URL}/blogs/${BLOGGER_CONFIG.blogId}/posts/search?key=${BLOGGER_CONFIG.apiKey}&q=${encodeURIComponent(query)}&maxResults=${maxResults}&fetchImages=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Blogger API error: ${res.status}`);
    const data: BloggerResponse = await res.json();
    return (data.items || []).map(transformPost);
  } catch (err) {
    console.error("Error searching posts:", err);
    return [];
  }
};
