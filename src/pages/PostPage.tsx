import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Share2, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LabelBadge from "@/components/LabelBadge";
import NewsCard from "@/components/NewsCard";
import { mockPosts } from "@/lib/mockData";
import { supabase } from "@/integrations/supabase/client";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();

  // Check if it's a DB post
  const isDbPost = id?.startsWith("db-");
  const dbId = isDbPost ? id?.replace("db-", "") : null;

  const { data: dbPost } = useQuery({
    queryKey: ["post", dbId],
    queryFn: async () => {
      if (!dbId) return null;
      const { data, error } = await supabase.from("posts").select("*").eq("id", dbId).single();
      if (error) return null;
      return data;
    },
    enabled: !!dbId,
  });

  // Fallback to mock
  const mockPost = !isDbPost ? mockPosts.find(p => p.id === id) : null;

  const post = dbPost || mockPost;
  const related = mockPosts.filter(p => p.label === (dbPost?.label || mockPost?.label) && p.id !== id).slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">খবরটি পাওয়া যায়নি।</p>
          <Link to="/" className="text-primary text-sm mt-4 inline-block">← প্রচ্ছদে ফিরুন</Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const title = dbPost?.title || mockPost?.title || "";
  const label = dbPost?.label || mockPost?.label || "";
  const imageUrl = dbPost?.image_url || mockPost?.image || "";
  const content = dbPost?.content || "";
  const excerpt = dbPost?.excerpt || mockPost?.excerpt || "";
  const author = dbPost?.source_name || mockPost?.author || "গলাচিপা প্রতিদিন";
  const date = mockPost?.date || new Date(dbPost?.created_at || "").toLocaleDateString("bn-BD");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container py-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft size={14} /> প্রচ্ছদ
        </Link>

        <article className="max-w-3xl">
          <LabelBadge label={label} />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-2 leading-tight">{title}</h1>
          <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
            <span>{author}</span>
            <span>·</span>
            <span>{date}</span>
            <button className="ml-auto p-1.5 rounded-sm hover:bg-muted transition-colors" aria-label="Share">
              <Share2 size={16} />
            </button>
          </div>

          {imageUrl && (
            <div className="mt-5 rounded-sm overflow-hidden">
              <img src={imageUrl} alt={title} className="w-full aspect-[16/9] object-cover" />
            </div>
          )}

          {content ? (
            <div
              className="mt-6 text-foreground leading-[1.8] space-y-4 prose prose-sm max-w-none [&_img]:rounded-sm [&_img]:max-w-full"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="mt-6 text-foreground leading-[1.8] space-y-4">
              <p>{excerpt}</p>
            </div>
          )}
        </article>

        {related.length > 0 && (
          <section className="mt-10 border-t border-border pt-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-sm" />
              সম্পর্কিত খবর
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <NewsCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};

export default PostPage;
