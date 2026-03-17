import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import SidebarWidget from "@/components/SidebarWidget";
import BreakingTicker from "@/components/BreakingTicker";
import TrendingSection from "@/components/TrendingSection";
import RssFeedSection from "@/components/RssFeedSection";
import { useLabelPosts, useLatestPosts } from "@/hooks/useBloggerPosts";
import { useDbFeaturedPosts } from "@/hooks/useDbPosts";
import { isBloggerConfigured } from "@/lib/bloggerConfig";
import { Info } from "lucide-react";

const Index = () => {
  const { data: latest = [] } = useLatestPosts(10);
  const { data: featured = [] } = useDbFeaturedPosts();
  const { data: national = [] } = useLabelPosts("জাতীয়");
  const { data: politics = [] } = useLabelPosts("রাজনীতি");
  const { data: country = [] } = useLabelPosts("সারাদেশ");
  const { data: world = [] } = useLabelPosts("বিশ্ব");
  const { data: sports = [] } = useLabelPosts("খেলা");
  const { data: entertainment = [] } = useLabelPosts("বিনোদন");
  const { data: tech = [] } = useLabelPosts("প্রযুক্তি");
  const { data: economy = [] } = useLabelPosts("অর্থনীতি");
  const { data: galachipa = [] } = useLabelPosts("গলাচিপা");
  const { data: education = [] } = useLabelPosts("শিক্ষা");

  const configured = isBloggerConfigured();

  // শীর্ষ সংবাদ = featured posts from editor, showing their own labels
  const topNews = featured.length > 0 ? featured : latest.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <BreakingTicker posts={latest.slice(0, 8)} />

      <main className="container">
        {!configured && (
          <div className="flex items-center gap-2 bg-accent border border-border rounded-sm px-4 py-2.5 mt-4 text-sm text-muted-foreground">
            <Info size={14} className="shrink-0 text-primary" />
            <span>
              ব্লগার API কনফিগার করা হয়নি। বর্তমানে ডেমো ডাটা দেখানো হচ্ছে।
            </span>
          </div>
        )}

        {/* Trending */}
        <TrendingSection posts={[
          ...(politics.length > 0 ? [politics[0]] : []),
          ...(sports.length > 0 ? [sports[0]] : []),
          ...(economy.length > 0 ? [economy[0]] : []),
          ...(world.length > 0 ? [world[0]] : []),
        ]} />

        {/* শীর্ষ সংবাদ - Editor featured posts */}
        <HeroSection posts={topNews} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <CategorySection title="জাতীয়" posts={national} layout="featured" />
            <CategorySection title="গলাচিপা" posts={galachipa} layout="featured" />
            <CategorySection title="রাজনীতি" posts={politics} layout="featured" />
            <CategorySection title="সারাদেশ" posts={country} layout="grid" />

            {/* RSS Feed Aggregator */}
            <RssFeedSection />

            <CategorySection title="বিশ্ব" posts={world} layout="grid" />
            <CategorySection title="খেলা" posts={sports} layout="grid" />
            <CategorySection title="বিনোদন" posts={entertainment} layout="featured" />
            <CategorySection title="শিক্ষা" posts={education} layout="grid" />
            <CategorySection title="অর্থনীতি" posts={economy} layout="grid" />
            <CategorySection title="প্রযুক্তি" posts={tech} layout="grid" />
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-4">
              <SidebarWidget />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Index;
