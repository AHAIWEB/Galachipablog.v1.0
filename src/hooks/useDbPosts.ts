import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { NewsPost } from "@/lib/mockData";

const toBanglaDigit = (n: number) => {
  const digits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(n).split("").map(d => digits[parseInt(d)]).join("");
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const months = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
  return `${toBanglaDigit(d.getDate())} ${months[d.getMonth()]}, ${toBanglaDigit(d.getFullYear())}`;
};

const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || "";

const transformDbPost = (post: any): NewsPost => ({
  id: `db-${post.id}`,
  title: post.title,
  excerpt: post.excerpt || stripHtml(post.content || "").slice(0, 150),
  image: post.image_url || "https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=600&h=400&fit=crop",
  label: post.label,
  date: formatDate(post.created_at),
  readTime: "৩ মিনিট",
  author: post.source_name || "গলাচিপা প্রতিদিন",
});

export const useDbPublishedPosts = (label?: string) => {
  return useQuery<NewsPost[]>({
    queryKey: ["db-posts", "published", label],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(10);
      if (label) {
        query = query.eq("label", label);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(transformDbPost);
    },
    staleTime: 2 * 60 * 1000,
  });
};
