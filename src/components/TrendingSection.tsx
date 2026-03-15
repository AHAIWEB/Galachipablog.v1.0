import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import type { NewsPost } from "@/lib/mockData";

interface TrendingSectionProps {
  posts: NewsPost[];
}

const TrendingSection = ({ posts }: TrendingSectionProps) => {
  if (posts.length === 0) return null;

  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const toBangla = (n: number) => String(n).split("").map(d => banglaDigits[parseInt(d)]).join("");

  return (
    <section className="py-4 border-b border-border">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-primary" />
        <h2 className="text-sm font-bold text-primary">ট্রেন্ডিং এখন</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {posts.slice(0, 4).map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
          >
            <Link to={`/post/${post.id}`} className="group flex gap-3">
              <span className="text-2xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors leading-none shrink-0">
                {toBangla(i + 1)}
              </span>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-3">
                {post.title}
              </h3>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
