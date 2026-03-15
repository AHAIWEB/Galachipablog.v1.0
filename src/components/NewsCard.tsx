import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LabelBadge from "./LabelBadge";
import type { NewsPost } from "@/lib/mockData";

interface NewsCardProps {
  post: NewsPost;
  variant?: "default" | "hero" | "compact" | "horizontal";
  index?: number;
}

const NewsCard = ({ post, variant = "default", index = 0 }: NewsCardProps) => {
  if (variant === "hero") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="group relative"
      >
        <Link to={`/post/${post.id}`} className="block">
          <div className="overflow-hidden rounded-sm">
            <img
              src={post.image}
              alt={post.title}
              className="w-full aspect-[16/10] object-cover transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
          <div className="mt-3">
            <LabelBadge label={post.label} />
            <h2 className="text-xl md:text-2xl font-bold mt-2 text-foreground group-hover:text-primary transition-colors leading-tight">
              {post.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span>{post.author}</span>
              <span>·</span>
              <span>{post.date}</span>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === "compact") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="group flex gap-3 pb-3 border-b border-border last:border-0"
      >
        <Link to={`/post/${post.id}`} className="flex gap-3 w-full">
          <div className="shrink-0 w-20 h-16 overflow-hidden rounded-sm">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>
            <span className="text-xs text-muted-foreground mt-1 block">{post.date}</span>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === "horizontal") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="group flex gap-4 pb-4 border-b border-border last:border-0"
      >
        <Link to={`/post/${post.id}`} className="flex gap-4 w-full">
          <div className="shrink-0 w-36 md:w-48 aspect-[3/2] overflow-hidden rounded-sm">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" />
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <LabelBadge label={post.label} />
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mt-1 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 hidden md:block">{post.excerpt}</p>
            <span className="text-xs text-muted-foreground mt-1.5">{post.author} · {post.date}</span>
          </div>
        </Link>
      </motion.article>
    );
  }

  // default card
  return (
    <motion.article
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="group pb-4 border-b border-border"
    >
      <Link to={`/post/${post.id}`} className="block">
        <div className="overflow-hidden rounded-sm">
          <img
            src={post.image}
            alt={post.title}
            className="w-full aspect-[16/10] object-cover transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="mt-2.5">
          <LabelBadge label={post.label} />
          <h3 className="text-base font-bold mt-1.5 text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default NewsCard;
