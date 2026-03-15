import NewsCard from "./NewsCard";
import type { NewsPost } from "@/lib/mockData";

interface HeroSectionProps {
  posts: NewsPost[];
}

const HeroSection = ({ posts }: HeroSectionProps) => {
  if (posts.length === 0) return null;
  const main = posts[0];
  const side = posts.slice(1, 5);

  return (
    <section className="py-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Main hero */}
        <div className="md:col-span-7">
          <NewsCard post={main} variant="hero" index={0} />
        </div>

        {/* Side stories */}
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          {side.map((post, i) => (
            <div key={post.id}>
              <NewsCard post={post} variant="default" index={i + 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
