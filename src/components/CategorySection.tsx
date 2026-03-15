import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import NewsCard from "./NewsCard";
import type { NewsPost } from "@/lib/mockData";

interface CategorySectionProps {
  title: string;
  posts: NewsPost[];
  layout?: "grid" | "featured";
}

const CategorySection = ({ title, posts, layout = "grid" }: CategorySectionProps) => {
  if (posts.length === 0) return null;

  return (
    <section className="py-6 border-b border-border last:border-0">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-sm" />
          <h2 className="text-lg font-bold text-primary">{title}</h2>
        </div>
        <Link
          to={`/label/${title}`}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          আরও <ChevronRight size={14} />
        </Link>
      </div>

      {layout === "featured" && posts.length >= 3 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-1">
            <NewsCard post={posts[0]} variant="hero" index={0} />
          </div>
          <div className="md:col-span-2 flex flex-col gap-3">
            {posts.slice(1, 5).map((post, i) => (
              <NewsCard key={post.id} post={post} variant="compact" index={i + 1} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 6).map((post, i) => (
            <NewsCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;
