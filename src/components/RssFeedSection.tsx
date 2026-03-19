import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Rss, ExternalLink } from "lucide-react";

interface RssItem {
  title: string;
  link: string;
  description: string;
  image: string;
  pubDate: string;
  source: string;
}

const RssFeedSection = () => {
  // Fetch feed URLs from DB
  const { data: feeds = [] } = useQuery({
    queryKey: ["rss-feeds-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rss_feeds")
        .select("*")
        .eq("enabled", true);
      if (error) throw error;
      return (data || []).map((f: any) => ({ url: f.url, name: f.name }));
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: items = [], isLoading } = useQuery<RssItem[]>({
    queryKey: ["rss-feed", feeds],
    queryFn: async () => {
      if (feeds.length === 0) return [];
      const { data, error } = await supabase.functions.invoke("rss-feed", {
        body: { feeds },
      });
      if (error) throw error;
      return data?.items || [];
    },
    enabled: feeds.length > 0,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // Auto-refresh every 1 minute
    retry: 1,
  });

  if (isLoading) {
    return (
      <section className="py-6 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Rss size={16} className="text-primary" />
          <h2 className="text-lg font-bold text-primary">সংবাদ সংকলন</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-sm" />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="py-6 border-b border-border">
      <div className="flex items-center gap-2 mb-4">
        <Rss size={16} className="text-primary" />
        <h2 className="text-lg font-bold text-primary">সংবাদ সংকলন</h2>
        <span className="text-xs text-muted-foreground ml-auto">🔄 ১ মিনিটে আপডেট</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.slice(0, 12).map((item, i) => (
          <a
            key={i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-3 p-2.5 rounded-sm border border-border hover:border-primary/30 hover:bg-muted/30 transition-all"
          >
            {item.image && (
              <img
                src={item.image}
                alt=""
                className="w-20 h-14 object-cover rounded-sm shrink-0"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-primary/70 font-medium">{item.source}</span>
                <ExternalLink size={10} className="text-muted-foreground" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default RssFeedSection;
