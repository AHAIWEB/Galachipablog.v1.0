import { useQuery } from "@tanstack/react-query";
import { isBloggerConfigured } from "@/lib/bloggerConfig";
import { fetchPostsByLabel, fetchLatestPosts } from "@/lib/bloggerApi";
import { getPostsByLabel, getLatestPosts, type NewsPost } from "@/lib/mockData";
import { useDbPublishedPosts } from "@/hooks/useDbPosts";

// Merge DB posts with Blogger/mock posts, DB posts first, deduplicate by title
const mergePosts = (dbPosts: NewsPost[], otherPosts: NewsPost[]): NewsPost[] => {
  const seen = new Set<string>();
  const result: NewsPost[] = [];
  for (const p of [...dbPosts, ...otherPosts]) {
    if (!seen.has(p.title)) {
      seen.add(p.title);
      result.push(p);
    }
  }
  return result;
};

// Hook: get posts by label (DB + Blogger/mock)
export const useLabelPosts = (label: string, maxResults = 6) => {
  const configured = isBloggerConfigured();
  const { data: dbPosts = [] } = useDbPublishedPosts(label);

  return useQuery<NewsPost[]>({
    queryKey: ["posts", "label", label, maxResults, dbPosts.length],
    queryFn: async () => {
      const bloggerPosts = configured
        ? await fetchPostsByLabel(label, maxResults)
        : getPostsByLabel(label);
      return mergePosts(dbPosts, bloggerPosts);
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// Hook: get latest posts (DB + Blogger/mock)
export const useLatestPosts = (count = 10) => {
  const configured = isBloggerConfigured();
  const { data: dbPosts = [] } = useDbPublishedPosts();

  return useQuery<NewsPost[]>({
    queryKey: ["posts", "latest", count, dbPosts.length],
    queryFn: async () => {
      const bloggerPosts = configured
        ? await fetchLatestPosts(count)
        : getLatestPosts(count);
      return mergePosts(dbPosts, bloggerPosts);
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
