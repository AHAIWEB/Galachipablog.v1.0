import { useParams } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import NewsCard from "@/components/NewsCard";
import { useLabelPosts } from "@/hooks/useBloggerPosts";
import { Skeleton } from "@/components/ui/skeleton";

const LabelPage = () => {
  const { label } = useParams<{ label: string }>();
  const { data: posts = [], isLoading } = useLabelPosts(label || "", 12);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-3 h-3 bg-primary rounded-sm" />
          <h1 className="text-2xl font-bold text-foreground">{label}</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full aspect-[16/10] rounded-sm" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground">এই বিভাগে কোনো খবর পাওয়া যায়নি।</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <NewsCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default LabelPage;
