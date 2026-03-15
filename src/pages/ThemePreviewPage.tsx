import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, ChevronLeft, ChevronRight, Quote, Calendar, MessageCircle } from "lucide-react";

const authorAvatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
];

const mockPosts = [
  { title: "গলাচিপায় নতুন সেতু নির্মাণ কাজ শুরু হচ্ছে আগামী মাসে", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop", label: "সারাদেশ", excerpt: "গলাচিপা উপজেলায় দীর্ঘ প্রতীক্ষিত সেতু নির্মাণ কাজ শুরু হতে যাচ্ছে।", author: "প্রতিবেদক", date: "১৫ মার্চ, ২০২৬" },
  { title: "জাতীয় নির্বাচনের তফসিল ঘোষণা আজ", image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=600&h=400&fit=crop", label: "রাজনীতি", excerpt: "নির্বাচন কমিশন আজ জাতীয় নির্বাচনের তফসিল ঘোষণা করবে।", author: "সংবাদদাতা", date: "১৫ মার্চ, ২০২৬" },
  { title: "বাংলাদেশ ক্রিকেট দলের নতুন কোচ নিয়োগ", image: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600&h=400&fit=crop", label: "খেলা", excerpt: "বাংলাদেশ ক্রিকেট বোর্ড নতুন প্রধান কোচ নিয়োগ দিয়েছে।", author: "ক্রীড়া প্রতিবেদক", date: "১৪ মার্চ, ২০২৬" },
  { title: "ডলারের দাম আবারো বাড়লো, অস্থির বাজার", image: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=600&h=400&fit=crop", label: "অর্থনীতি", excerpt: "আন্তর্জাতিক বাজারে ডলারের দাম বাড়ায় দেশীয় বাজারেও প্রভাব পড়েছে।", author: "অর্থনৈতিক প্রতিবেদক", date: "১৪ মার্চ, ২০২৬" },
  { title: "প্রযুক্তি খাতে নতুন বিনিয়োগ আসছে", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop", label: "প্রযুক্তি", excerpt: "তথ্যপ্রযুক্তি খাতে বড় বিনিয়োগের ঘোষণা দিলো সরকার।", author: "প্রতিবেদক", date: "১৩ মার্চ, ২০২৬" },
  { title: "গলাচিপায় শিক্ষা প্রতিষ্ঠানের উন্নয়নে বরাদ্দ বাড়লো", image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&h=400&fit=crop", label: "সারাদেশ", excerpt: "স্থানীয় শিক্ষা প্রতিষ্ঠানগুলোর জন্য নতুন বরাদ্দ ঘোষণা।", author: "সংবাদদাতা", date: "১৩ মার্চ, ২০২৬" },
  { title: "সাহিত্যে নতুন প্রজন্মের উত্থান", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop", label: "সাহিত্য", excerpt: "তরুণ লেখকদের হাত ধরে বাংলা সাহিত্যে নতুন ধারা তৈরি হচ্ছে।", author: "সাহিত্য প্রতিবেদক", date: "১২ মার্চ, ২০২৬" },
  { title: "স্বাস্থ্যসেবায় ডিজিটাল রূপান্তর", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop", label: "স্বাস্থ্য", excerpt: "টেলিমেডিসিন ও ডিজিটাল স্বাস্থ্যসেবায় বড় পরিবর্তন আসছে।", author: "স্বাস্থ্য প্রতিবেদক", date: "১২ মার্চ, ২০২৬" },
  { title: "রাশিয়া-ইউক্রেন যুদ্ধে নতুন মোড়", image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop", label: "আন্তর্জাতিক", excerpt: "আন্তর্জাতিক সম্প্রদায় শান্তি আলোচনায় নতুন উদ্যোগ নিচ্ছে।", author: "আন্তর্জাতিক ডেস্ক", date: "১১ মার্চ, ২০২৬" },
  { title: "শিক্ষা ব্যবস্থার সংস্কার জরুরি", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop", label: "মতামত", excerpt: "বর্তমান শিক্ষা ব্যবস্থায় আমূল পরিবর্তন আনা দরকার বলে মনে করেন বিশেষজ্ঞরা।", author: "ড. আবদুল করিম", date: "১১ মার্চ, ২০২৬" },
  { title: "রকমারি জীবনযাপন: গ্রামীণ বাংলাদেশ", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", label: "রকমারি", excerpt: "গ্রামীণ বাংলাদেশের বৈচিত্র্যময় জীবনধারার গল্প।", author: "ফিচার ডেস্ক", date: "১০ মার্চ, ২০২৬" },
  { title: "সাইবার লাভ স্টোরি-এও রয়েছে বিভ্রান্তি!", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop", label: "বিনোদন", excerpt: "সোশ্যাল মিডিয়ায় প্রেমের গল্পে নতুন মাত্রা যোগ হচ্ছে।", author: "বিনোদন ডেস্ক", date: "১০ মার্চ, ২০২৬" },
];

const opinionPosts = [
  { title: "গণতন্ত্রের পথে আমাদের যাত্রা কতটুকু সফল?", author: "ড. আবদুল করিম", avatar: authorAvatars[0] },
  { title: "শিক্ষা ব্যবস্থার সংস্কার ছাড়া উন্নয়ন অসম্ভব", author: "প্রফেসর নাজমুল হক", avatar: authorAvatars[1] },
  { title: "জলবায়ু পরিবর্তন ও আমাদের করণীয়", author: "ফারহানা ইসলাম", avatar: authorAvatars[2] },
  { title: "গ্রামীণ অর্থনীতির চালিকাশক্তি হতে পারে প্রযুক্তি", author: "মোস্তাফিজুর রহমান", avatar: authorAvatars[3] },
];

/* ── Reusable sub-components ── */

const SectionHeader = ({ title, accent = "#e11d48", showMore = true }: { title: string; accent?: string; showMore?: boolean }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 8, borderBottom: `2px solid ${accent}`, marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 12, height: 12, background: accent, borderRadius: 2 }} />
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{title}</h2>
    </div>
    {showMore && <span style={{ fontSize: 13, color: accent, cursor: "pointer", fontWeight: 600 }}>আরো ❯</span>}
  </div>
);

const SmallCard = ({ post, hideLabel }: { post: typeof mockPosts[0]; hideLabel?: boolean }) => (
  <div>
    <div style={{ overflow: "hidden", borderRadius: 6 }}>
      <img src={post.image} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }} />
    </div>
    {!hideLabel && (
      <span style={{ display: "inline-block", background: "#fce7f3", color: "#e11d48", padding: "2px 8px", borderRadius: 2, fontSize: 11, fontWeight: 700, marginTop: 8 }}>{post.label}</span>
    )}
    <h3 style={{ fontSize: 14, fontWeight: 700, marginTop: 4, lineHeight: 1.35 }}>{post.title}</h3>
    <div style={{ fontSize: 12, color: "#71717a", marginTop: 4 }}>{post.author} · {post.date}</div>
  </div>
);

/* ── শীর্ষ সংবাদ - Top News (Hero Layout with main + side) ── */
const TopNewsSection = ({ posts }: { posts: typeof mockPosts }) => (
  <section style={{ padding: "20px 0" }}>
    <SectionHeader title="শীর্ষ সংবাদ" accent="#e11d48" showMore={false} />
    <div style={{ display: "grid", gridTemplateColumns: "7fr 5fr", gap: 20 }}>
      {/* Main hero */}
      <div>
        <div style={{ overflow: "hidden", borderRadius: 8, position: "relative" }}>
          <img src={posts[0].image} alt="" style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover" }} />
          <span style={{ position: "absolute", top: 12, left: 12, background: "#e11d48", color: "#fff", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{posts[0].label}</span>
        </div>
        <div style={{ marginTop: 12 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>{posts[0].title}</h2>
          <p style={{ fontSize: 14, color: "#71717a", marginTop: 8 }}>{posts[0].excerpt}</p>
          <div style={{ fontSize: 12, color: "#71717a", marginTop: 6 }}>{posts[0].author} · {posts[0].date}</div>
        </div>
      </div>
      {/* Side stories - 2x2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {posts.slice(1, 5).map((post, i) => (
          <div key={i}>
            <div style={{ overflow: "hidden", borderRadius: 6, position: "relative" }}>
              <img src={post.image} alt="" style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover" }} />
              <span style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(0,0,0,0.7)", color: "#fff", padding: "2px 8px", borderRadius: 3, fontSize: 10, fontWeight: 600 }}>{post.label}</span>
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginTop: 6, lineHeight: 1.35 }}>{post.title}</h3>
            <div style={{ fontSize: 12, color: "#71717a", marginTop: 4 }}>{post.date}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── রাজনীতি - Parliament/Debate style ── */
const PoliticsSection = ({ posts }: { posts: typeof mockPosts }) => (
  <section style={{ marginBottom: 32 }}>
    <SectionHeader title="রাজনীতি" accent="#991b1b" />
    <div style={{ background: "linear-gradient(135deg, #fef2f2, #fee2e2)", borderRadius: 12, padding: 20, border: "1px solid #fecaca" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Main debate card */}
        <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: "#fff", boxShadow: "0 4px 16px rgba(153,27,27,0.1)" }}>
          <div style={{ position: "relative" }}>
            <img src={posts[0].image} alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "linear-gradient(to bottom, rgba(153,27,27,0.8), transparent)", padding: "10px 14px" }}>
              <span style={{ background: "#fff", color: "#991b1b", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>🏛️ রাজনীতি</span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, color: "#1c1917" }}>{posts[0].title}</h3>
            <p style={{ fontSize: 13, color: "#71717a", marginTop: 8, lineHeight: 1.5 }}>{posts[0].excerpt}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#991b1b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>প</div>
              <span style={{ fontSize: 12, color: "#991b1b", fontWeight: 600 }}>{posts[0].author}</span>
              <span style={{ fontSize: 11, color: "#a1a1aa" }}>· {posts[0].date}</span>
            </div>
          </div>
        </div>
        {/* Side list with numbered items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {posts.slice(1, 5).map((post, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "14px 12px", borderBottom: "1px solid #fecaca", background: i % 2 === 0 ? "rgba(255,255,255,0.6)" : "transparent", borderRadius: 6 }}>
              <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: "#991b1b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>{i + 1}</span>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35, color: "#1c1917" }}>{post.title}</h4>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: "#991b1b", fontWeight: 600 }}>{post.author}</span>
                  <span style={{ fontSize: 11, color: "#a1a1aa" }}>{post.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ── আলোচিত - Trending/Viral style with fire badges ── */
const TrendingSectionPreview = ({ posts }: { posts: typeof mockPosts }) => (
  <section style={{ marginBottom: 32 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 8, borderBottom: "2px solid #ea580c", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>🔥</span>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>আলোচিত</h2>
        <span style={{ background: "#ea580c", color: "#fff", padding: "2px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>TRENDING</span>
      </div>
      <span style={{ fontSize: 13, color: "#ea580c", cursor: "pointer", fontWeight: 600 }}>আরো ❯</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
      {/* Big featured trending */}
      <div style={{ position: "relative", borderRadius: 12, overflow: "hidden" }}>
        <img src={posts[0].image} alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, transparent)" }} />
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 8 }}>
          <span style={{ background: "#ea580c", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>🔥 আলোচিত</span>
          <span style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", color: "#fff", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>👁 ১২.৫K</span>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 20px" }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.25, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{posts[0].title}</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 8 }}>{posts[0].excerpt}</p>
        </div>
      </div>
      {/* Side trending list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {posts.slice(1, 5).map((post, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 10, overflow: "hidden", border: "1px solid #fed7aa", boxShadow: "0 2px 8px rgba(234,88,12,0.08)" }}>
            <div style={{ display: "flex", gap: 10, padding: 10 }}>
              <div style={{ position: "relative", flexShrink: 0, width: 70, height: 56, borderRadius: 8, overflow: "hidden" }}>
                <img src={post.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: 2, left: 2, background: "#ea580c", color: "#fff", width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{post.title}</h4>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: "#ea580c" }}>🔥</span>
                  <span style={{ fontSize: 10, color: "#a1a1aa" }}>{post.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── জাতীয় - Timeline style ── */
const NationalTimelineSection = ({ title, posts }: { title: string; posts: typeof mockPosts }) => (
  <section style={{ marginBottom: 32 }}>
    <SectionHeader title={title} accent="#1d4ed8" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
      {/* Featured card */}
      <div style={{ gridColumn: "1 / 3", borderRadius: 10, overflow: "hidden", position: "relative", background: "#fff" }}>
        <img src={posts[0].image} alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <span style={{ background: "#1d4ed8", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{posts[0].label}</span>
            <span style={{ fontSize: 11, color: "#71717a" }}>{posts[0].date}</span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>{posts[0].title}</h3>
          <p style={{ fontSize: 13, color: "#71717a", marginTop: 6 }}>{posts[0].excerpt}</p>
        </div>
      </div>
      {/* Timeline side list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {posts.slice(1, 5).map((post, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "12px 0", borderBottom: "1px solid #e4e4e7", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 16 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1d4ed8", border: "2px solid #dbeafe", marginTop: 4 }} />
              {i < 3 && <div style={{ width: 2, flex: 1, background: "#dbeafe", marginTop: 4 }} />}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{post.title}</h4>
              <span style={{ fontSize: 11, color: "#71717a", display: "block", marginTop: 4 }}>{post.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── বিনোদন - Cinema reel style with stacked cards ── */
const EntertainmentSection = ({ title, posts }: { title: string; posts: typeof mockPosts }) => (
  <section style={{ marginBottom: 32 }}>
    <SectionHeader title={title} accent="#9333ea" />
    <div style={{ background: "linear-gradient(135deg, #faf5ff, #f3e8ff)", borderRadius: 12, padding: 20, border: "1px solid #e9d5ff" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Big featured */}
        <div style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}>
          <img src={posts[0].image} alt="" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.9))", padding: "60px 16px 16px" }}>
            <span style={{ background: "#9333ea", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>🎬 {posts[0].label}</span>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 8, lineHeight: 1.3 }}>{posts[0].title}</h3>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>{posts[0].excerpt}</p>
          </div>
        </div>
        {/* Stacked cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.slice(1, 4).map((post, i) => (
            <div key={i} style={{ display: "flex", gap: 12, background: "#fff", borderRadius: 10, padding: 10, boxShadow: "0 2px 8px rgba(147,51,234,0.08)", border: "1px solid #e9d5ff" }}>
              <div style={{ flexShrink: 0, width: 80, height: 80, borderRadius: 8, overflow: "hidden" }}>
                <img src={post.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontSize: 10, color: "#9333ea", fontWeight: 700, textTransform: "uppercase" }}>🎭 {post.label}</span>
                <h4 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, marginTop: 4 }}>{post.title}</h4>
                <span style={{ fontSize: 11, color: "#71717a", marginTop: 4 }}>{post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ── Horizontal card section (খেলা) ── */
const HorizontalCardSection = ({ title, posts }: { title: string; posts: typeof mockPosts }) => (
  <section style={{ marginBottom: 32 }}>
    <SectionHeader title={title} accent="#059669" />
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {posts.slice(0, 4).map((post, i) => (
        <div key={i} style={{ display: "flex", gap: 16, padding: 12, background: i === 0 ? "#ecfdf5" : "#fff", border: "1px solid #e4e4e7", borderRadius: 8, borderLeft: i === 0 ? "4px solid #059669" : undefined }}>
          <div style={{ flexShrink: 0, width: 120, height: 80, overflow: "hidden", borderRadius: 6 }}>
            <img src={post.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{post.title}</h4>
            <p style={{ fontSize: 13, color: "#71717a", marginTop: 4 }}>{post.excerpt.slice(0, 50)}...</p>
            <div style={{ fontSize: 11, color: "#71717a", marginTop: 6 }}>{post.author} · {post.date}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ── Masonry-like (প্রযুক্তি) ── */
const TechGridSection = ({ title, posts }: { title: string; posts: typeof mockPosts }) => (
  <section style={{ marginBottom: 32 }}>
    <SectionHeader title={title} accent="#0891b2" />
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
      <div style={{ overflow: "hidden", borderRadius: 8, position: "relative" }}>
        <img src={posts[0].image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 220 }} />
        <div style={{ position: "absolute", top: 12, left: 12, background: "#0891b2", color: "#fff", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>🔬 {posts[0].label}</div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.9))", padding: "48px 16px 16px" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{posts[0].title}</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>{posts[0].excerpt}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {posts.slice(1, 4).map((post, i) => (
          <div key={i} style={{ background: "#f0fdfa", border: "1px solid #ccfbf1", borderRadius: 8, padding: 12 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "start" }}>
              <div style={{ flexShrink: 0, width: 56, height: 56, overflow: "hidden", borderRadius: 6 }}>
                <img src={post.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{post.title}</h4>
                <span style={{ fontSize: 11, color: "#71717a", marginTop: 4, display: "block" }}>{post.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Magazine layout (সাহিত্য) ── */
const MagazineSection = ({ title, posts }: { title: string; posts: typeof mockPosts }) => (
  <section style={{ marginBottom: 32 }}>
    <SectionHeader title={title} accent="#b45309" />
    <div style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)", borderRadius: 10, padding: 20, border: "1px solid #fde68a" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {posts.slice(0, 3).map((post, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <img src={post.image} alt="" style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover" }} />
            <div style={{ padding: 12 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35 }}>{post.title}</h4>
              <div style={{ fontSize: 11, color: "#92400e", marginTop: 6, fontStyle: "italic" }}>✍ {post.author}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Zigzag layout (রকমারি) ── */
const ZigzagSection = ({ title, posts }: { title: string; posts: typeof mockPosts }) => (
  <section style={{ marginBottom: 32 }}>
    <SectionHeader title={title} accent="#dc2626" />
    {posts.slice(0, 3).map((post, i) => (
      <div key={i} style={{ display: "flex", flexDirection: i % 2 === 0 ? "row" : "row-reverse", gap: 16, padding: "12px 0", borderBottom: "1px solid #e4e4e7" }}>
        <div style={{ flexShrink: 0, width: 160, height: 100, overflow: "hidden", borderRadius: 8 }}>
          <img src={post.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ display: "inline-block", background: "#fef2f2", color: "#dc2626", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>{post.label}</span>
          <h4 style={{ fontSize: 15, fontWeight: 700, marginTop: 6, lineHeight: 1.3 }}>{post.title}</h4>
          <p style={{ fontSize: 13, color: "#71717a", marginTop: 4 }}>{post.excerpt}</p>
        </div>
      </div>
    ))}
  </section>
);

/* ── Health cards (স্বাস্থ্য) ── */
const HealthSection = ({ title, posts }: { title: string; posts: typeof mockPosts }) => (
  <section style={{ marginBottom: 32 }}>
    <SectionHeader title={title} accent="#16a34a" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      {posts.slice(0, 3).map((post, i) => (
        <div key={i} style={{ borderRadius: 10, overflow: "hidden", background: "#fff", border: "1px solid #dcfce7", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ position: "relative" }}>
            <img src={post.image} alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 8, right: 8, background: "#16a34a", color: "#fff", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>+</div>
          </div>
          <div style={{ padding: 12 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35 }}>{post.title}</h4>
            <p style={{ fontSize: 12, color: "#71717a", marginTop: 4 }}>{post.excerpt.slice(0, 50)}...</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ── International banner (আন্তর্জাতিক) ── */
const InternationalSection = ({ title, posts }: { title: string; posts: typeof mockPosts }) => (
  <section style={{ marginBottom: 32 }}>
    <SectionHeader title={title} accent="#7c3aed" />
    <div style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)", borderRadius: 10, padding: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {posts.slice(0, 2).map((post, i) => (
        <div key={i} style={{ display: "flex", gap: 14, alignItems: "start" }}>
          <div style={{ flexShrink: 0, width: 100, height: 80, overflow: "hidden", borderRadius: 8, border: "2px solid rgba(255,255,255,0.15)" }}>
            <img src={post.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{post.title}</h4>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{post.excerpt.slice(0, 50)}...</p>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>🌍 {post.date}</div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ── মতামত (Opinion) ── */
const OpinionSection = () => (
  <section style={{ marginBottom: 32 }}>
    <SectionHeader title="মতামত" accent="#d97706" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {opinionPosts.map((post, i) => (
        <div key={i} style={{ background: i === 0 ? "linear-gradient(135deg, #fffbeb, #fef3c7)" : "#fff", border: "1px solid #fde68a", borderRadius: 10, padding: 20, position: "relative" }}>
          <Quote size={28} style={{ position: "absolute", top: 12, right: 14, color: "#d97706", opacity: 0.2 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <img src={post.avatar} alt="" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid #d97706" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>{post.author}</div>
              <div style={{ fontSize: 11, color: "#b45309" }}>কলামিস্ট</div>
            </div>
          </div>
          <blockquote style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.45, color: "#1c1917", fontStyle: "italic", borderLeft: "3px solid #d97706", paddingLeft: 12 }}>
            "{post.title}"
          </blockquote>
        </div>
      ))}
    </div>
  </section>
);

/* ── Editor's Pick Carousel ── */
const EditorPickCarousel = ({ posts }: { posts: typeof mockPosts }) => {
  const [idx, setIdx] = useState(0);
  const visible = 4;
  const maxIdx = Math.max(0, posts.length - visible);
  return (
    <section style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 8, borderBottom: "2px solid #e11d48", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 12, height: 12, background: "#e11d48", borderRadius: 2 }} />
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>⭐ এডিটর পিক</h2>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setIdx(Math.max(0, idx - 1))} style={{ width: 28, height: 28, borderRadius: 4, border: "1px solid #e4e4e7", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setIdx(Math.min(maxIdx, idx + 1))} style={{ width: 28, height: 28, borderRadius: 4, border: "1px solid #e4e4e7", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 16, transition: "transform 0.3s ease", transform: `translateX(-${idx * (100 / visible + 1.5)}%)` }}>
          {posts.map((post, i) => (
            <div key={i} style={{ flex: `0 0 calc(${100 / visible}% - 12px)` }}>
              <SmallCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Sidebar 3-Tab Widget ── */
const SidebarTabWidget = ({ posts }: { posts: typeof mockPosts }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: "জনপ্রিয়", icon: "🔥" },
    { label: "খেলা", icon: "⚽" },
    { label: "সর্বশেষ", icon: "🕐" },
  ];

  const tabPosts = [
    posts.slice(0, 5),
    [posts[2], posts[0], posts[4], posts[1], posts[5]],
    posts.slice(5, 12),
  ];

  return (
    <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", borderBottom: "2px solid #e4e4e7" }}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              flex: 1, padding: "10px 8px", fontSize: 13,
              fontWeight: activeTab === i ? 700 : 500,
              background: activeTab === i ? "#e11d48" : "#fafafa",
              color: activeTab === i ? "#fff" : "#71717a",
              border: "none", cursor: "pointer", transition: "all 0.2s",
              borderBottom: activeTab === i ? "2px solid #e11d48" : "2px solid transparent",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      <div style={{ padding: 14, maxHeight: activeTab === 2 ? 400 : undefined, overflowY: activeTab === 2 ? "auto" : undefined }}>
        {tabPosts[activeTab].map((post, i) => (
          <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < tabPosts[activeTab].length - 1 ? "1px solid #f4f4f5" : "none" }}>
            {activeTab !== 2 && (
              <div style={{ flexShrink: 0, width: 68, height: 52, overflow: "hidden", borderRadius: 6 }}>
                <img src={post.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            {activeTab === 2 && (
              <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: "#fce7f3", color: "#e11d48", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, marginTop: 2 }}>{i + 1}</span>
            )}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{post.title}</h4>
              <span style={{ fontSize: 11, color: "#71717a", marginTop: 3, display: "block" }}>{post.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── ইতিহাসের এই দিনে - Wikipedia Widget ── */
const OnThisDayWidget = () => {
  const [activeTab, setActiveTab] = useState<"events" | "quotes">("events");
  const [events, setEvents] = useState<{ text: string; year: string }[]>([]);
  const [quotes, setQuotes] = useState<{ text: string; author: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    // Fetch from Wikipedia On This Day API
    fetch(`https://api.wikimedia.org/feed/v1/wikipedia/bn/onthisday/all/${month}/${day}`, {
      headers: { "Accept": "application/json" },
    })
      .then(res => res.json())
      .then(data => {
        const evts = (data.events || data.selected || []).slice(0, 15).map((e: any) => ({
          text: e.text || e.pages?.[0]?.extract || "ঘটনা",
          year: e.year ? `${e.year}` : "",
        }));
        setEvents(evts.length > 0 ? evts : fallbackEvents);

        // births can serve as quotes source
        const births = (data.births || []).slice(0, 10).map((b: any) => ({
          text: b.text || b.pages?.[0]?.extract || "",
          author: b.pages?.[0]?.normalizedtitle || "অজানা",
        }));
        setQuotes(births.length > 0 ? births : fallbackQuotes);
        setLoading(false);
      })
      .catch(() => {
        setEvents(fallbackEvents);
        setQuotes(fallbackQuotes);
        setLoading(false);
      });
  }, []);

  const fallbackEvents = [
    { text: "ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠিত হয়", year: "১৯২১" },
    { text: "বাংলাদেশের স্বাধীনতা ঘোষণা", year: "১৯৭১" },
    { text: "প্রথম আন্তর্জাতিক মাতৃভাষা দিবস পালিত হয়", year: "২০০০" },
    { text: "বাংলাদেশে ডিজিটাল বিপ্লবের সূচনা", year: "২০০৯" },
    { text: "পদ্মা সেতু উদ্বোধন", year: "২০২২" },
  ];

  const fallbackQuotes = [
    { text: "শিক্ষাই জাতির মেরুদণ্ড", author: "ঈশ্বরচন্দ্র বিদ্যাসাগর" },
    { text: "যে দেশে গুণীজন নাহি সম্মান, সে দেশে কদাচ হয় না কল্যাণ", author: "কাজী নজরুল ইসলাম" },
    { text: "আমার সোনার বাংলা আমি তোমায় ভালোবাসি", author: "রবীন্দ্রনাথ ঠাকুর" },
  ];

  const tabs = [
    { key: "events" as const, label: "ঘটনাবলি", icon: <Calendar size={14} /> },
    { key: "quotes" as const, label: "উক্তি", icon: <MessageCircle size={14} /> },
  ];

  return (
    <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginTop: 20 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 20 }}>📜</span>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>ইতিহাসের এই দিনে</h3>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
            {new Date().toLocaleDateString("bn-BD", { day: "numeric", month: "long" })}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "2px solid #e4e4e7" }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: "10px 8px", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontWeight: activeTab === tab.key ? 700 : 500,
              background: activeTab === tab.key ? "#2563eb" : "#f8fafc",
              color: activeTab === tab.key ? "#fff" : "#71717a",
              border: "none", cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content - scrollable */}
      <div style={{ maxHeight: 320, overflowY: "auto", padding: 14 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 20, color: "#71717a", fontSize: 13 }}>লোড হচ্ছে...</div>
        ) : activeTab === "events" ? (
          events.map((evt, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < events.length - 1 ? "1px solid #f4f4f5" : "none" }}>
              <span style={{
                flexShrink: 0, minWidth: 48, height: 24, borderRadius: 12,
                background: "linear-gradient(135deg, #dbeafe, #bfdbfe)", color: "#1d4ed8",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, padding: "0 8px",
              }}>
                {evt.year}
              </span>
              <p style={{ fontSize: 13, lineHeight: 1.4, color: "#1c1917", margin: 0 }}>{evt.text}</p>
            </div>
          ))
        ) : (
          quotes.map((q, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < quotes.length - 1 ? "1px solid #f4f4f5" : "none" }}>
              <blockquote style={{ fontSize: 13, lineHeight: 1.45, fontStyle: "italic", color: "#1c1917", borderLeft: "3px solid #2563eb", paddingLeft: 10, margin: 0 }}>
                "{q.text}"
              </blockquote>
              <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 600, marginTop: 6, paddingLeft: 14 }}>— {q.author}</div>
            </div>
          ))
        )}
      </div>

      {/* Source */}
      <div style={{ borderTop: "1px solid #f4f4f5", padding: "6px 14px", textAlign: "right" }}>
        <span style={{ fontSize: 10, color: "#a1a1aa" }}>উৎস: উইকিপিডিয়া</span>
      </div>
    </div>
  );
};

const ThemePreviewPage = () => {
  return (
    <div style={{ fontFamily: "'Hind Siliguri', sans-serif", background: "#fafafa", minHeight: "100vh" }}>
      {/* Back to site */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e4e4e7", padding: "8px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#71717a", textDecoration: "none" }}>
            <ArrowLeft size={14} /> মূল সাইটে ফিরুন
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#71717a", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 10px", borderRadius: 4, fontWeight: 600 }}>থিম প্রিভিউ</span>
            <Link to="/theme-download" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#fff", background: "#e11d48", padding: "5px 14px", borderRadius: 6, textDecoration: "none", fontWeight: 600 }}>
              <Download size={14} /> ডাউনলোড
            </Link>
          </div>
        </div>
      </div>

      {/* Top Bar */}
      <div style={{ background: "#0a0a0b", padding: "6px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>১৫ মার্চ, ২০২৬ | রবিবার</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>এডমিন প্যানেল</span>
        </div>
      </div>

      {/* Logo */}
      <div style={{ background: "#fff", padding: "16px 0", textAlign: "center", borderBottom: "1px solid #e4e4e7" }}>
        <div style={{ fontSize: "2rem", fontWeight: 700, color: "#0a0a0b" }}>গলাচিপা<span style={{ color: "#e11d48" }}>প্রতিদিন</span></div>
        <div style={{ fontSize: 12, color: "#71717a", marginTop: 2 }}>গলাচিপার সবচেয়ে বিশ্বস্ত সংবাদ মাধ্যম</div>
      </div>

      {/* Navigation */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e4e4e7" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem", display: "flex", alignItems: "center", gap: 0, overflowX: "auto" }}>
          {["প্রচ্ছদ", "জাতীয়", "রাজনীতি", "আলোচিত", "সারাদেশ", "আন্তর্জাতিক", "খেলা", "বিনোদন", "প্রযুক্তি", "অর্থনীতি", "সাহিত্য", "রকমারি", "স্বাস্থ্য", "মতামত"].map((item, i) => (
            <span key={item} style={{ padding: "10px 14px", fontSize: 14, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? "#0a0a0b" : "rgba(10,10,11,0.8)", whiteSpace: "nowrap", cursor: "pointer" }}>{item}</span>
          ))}
        </div>
      </nav>

      {/* Breaking Ticker */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e4e4e7", padding: "8px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ background: "#e11d48", color: "#fff", padding: "4px 12px", fontSize: 12, fontWeight: 700, borderRadius: 6, whiteSpace: "nowrap" }}>সর্বশেষ</span>
          <div style={{ overflow: "hidden", whiteSpace: "nowrap", flex: 1, fontSize: 13, fontWeight: 500, color: "#0a0a0b" }}>
            {mockPosts.map(p => p.title).join("  ●  ")}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem" }}>

        {/* শীর্ষ সংবাদ */}
        <TopNewsSection posts={mockPosts} />

        {/* রাজনীতি - Parliament style */}
        <PoliticsSection posts={mockPosts} />

        {/* আলোচিত - Trending/Viral style */}
        <TrendingSectionPreview posts={[mockPosts[1], mockPosts[4], mockPosts[8], mockPosts[3], mockPosts[11]]} />

        {/* জাতীয় - Timeline style */}
        <NationalTimelineSection title="জাতীয়" posts={mockPosts} />

        {/* এডিটর পিক - Carousel */}
        <EditorPickCarousel posts={mockPosts} />

        {/* Content + Sidebar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
          <div>
            {/* বিনোদন - Cinema reel style */}
            <EntertainmentSection title="বিনোদন" posts={[mockPosts[11], mockPosts[1], mockPosts[2], mockPosts[3]]} />

            {/* খেলা */}
            <HorizontalCardSection title="খেলা" posts={[mockPosts[2], mockPosts[0], mockPosts[5], mockPosts[1]]} />

            {/* প্রযুক্তি */}
            <TechGridSection title="প্রযুক্তি" posts={[mockPosts[4], mockPosts[1], mockPosts[3], mockPosts[7]]} />

            {/* সাহিত্য */}
            <MagazineSection title="সাহিত্য" posts={[mockPosts[6], mockPosts[0], mockPosts[9]]} />

            {/* রকমারি */}
            <ZigzagSection title="রকমারি" posts={[mockPosts[10], mockPosts[7], mockPosts[11]]} />

            {/* স্বাস্থ্য */}
            <HealthSection title="স্বাস্থ্য" posts={[mockPosts[7], mockPosts[5], mockPosts[9]]} />

            {/* আন্তর্জাতিক */}
            <InternationalSection title="আন্তর্জাতিক" posts={[mockPosts[8], mockPosts[3]]} />

            {/* মতামত */}
            <OpinionSection />
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ position: "sticky", top: 16 }}>
              <SidebarTabWidget posts={mockPosts} />
              <OnThisDayWidget />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#0a0a0b", marginTop: 32, padding: "32px 0 16px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", color: "#fff", marginBottom: 8 }}>গলাচিপা<span style={{ color: "#e11d48" }}>প্রতিদিন</span></h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>গলাচিপার সবচেয়ে বিশ্বস্ত অনলাইন সংবাদ মাধ্যম।</p>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 12 }}>বিভাগসমূহ</h4>
              <ul style={{ listStyle: "none", padding: 0, columns: 2 }}>
                {["জাতীয়", "রাজনীতি", "আলোচিত", "সারাদেশ", "আন্তর্জাতিক", "খেলা", "বিনোদন", "প্রযুক্তি", "অর্থনীতি", "সাহিত্য", "রকমারি", "স্বাস্থ্য", "মতামত"].map(l => (
                  <li key={l} style={{ padding: "3px 0", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{l}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 12 }}>যোগাযোগ</h4>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>ঠিকানা: গলাচিপা, পটুয়াখালী</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>ইমেইল: info@galachipaprotidin.com</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 24, paddingTop: 16, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>© ২০২৬ গলাচিপাপ্রতিদিন। সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ThemePreviewPage;
