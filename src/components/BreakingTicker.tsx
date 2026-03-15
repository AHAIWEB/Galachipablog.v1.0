import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import type { NewsPost } from "@/lib/mockData";

interface BreakingTickerProps {
  posts: NewsPost[];
}

const BreakingTicker = ({ posts }: BreakingTickerProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isPaused) return;

    let animId: number;
    let pos = 0;

    const scroll = () => {
      pos += 0.5;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      animId = requestAnimationFrame(scroll);
    };

    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  if (posts.length === 0) return null;

  return (
    <div className="bg-foreground overflow-hidden">
      <div className="container flex items-center">
        {/* Label */}
        <div className="shrink-0 bg-primary flex items-center gap-1.5 px-3 py-2 z-10">
          <Zap size={12} className="text-primary-foreground" />
          <span className="text-xs font-bold text-primary-foreground whitespace-nowrap">ব্রেকিং</span>
        </div>

        {/* Scrolling content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="flex whitespace-nowrap py-2">
            {[...posts, ...posts].map((post, i) => (
              <Link
                key={`${post.id}-${i}`}
                to={`/post/${post.id}`}
                className="inline-flex items-center text-xs text-primary-foreground/80 hover:text-primary transition-colors mx-4 shrink-0"
              >
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 shrink-0" />
                {post.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingTicker;
