import { useQuery } from "@tanstack/react-query";
import { isBloggerConfigured } from "@/lib/bloggerConfig";
import { fetchPostsByLabel, fetchLatestPosts } from "@/lib/bloggerApi";
import { getPostsByLabel, getLatestPosts, type NewsPost } from "@/lib/mockData";

// Hook: get posts by label (Blogger API if configured, else mock data)
export const useLabelPosts = (label: string, maxResults = 6) => {
  const configured = isBloggerConfigured();

  return useQuery<NewsPost[]>({
    queryKey: ["posts", "label", label, maxResults],
    queryFn: () => (configured ? fetchPostsByLabel(label, maxResults) : Promise.resolve(getPostsByLabel(label))),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

// Hook: get latest posts
export const useLatestPosts = (count = 10) => {
  const configured = isBloggerConfigured();

  return useQuery<NewsPost[]>({
    queryKey: ["posts", "latest", count],
    queryFn: () => (configured ? fetchLatestPosts(count) : Promise.resolve(getLatestPosts(count))),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
