// Blogger Configuration
// JSON Feed approach - API Key is NOT required for public feeds
export const BLOGGER_CONFIG = {
  // আপনার Blogger Blog ID (used for reference only, feeds use blogUrl)
  blogId: "311636221121167283",

  // Google API Key (no longer needed for JSON feed approach)
  apiKey: "AIzaSyAV4SO5rq8io1FdRA8GENWELB5h2XOO30U",

  // ব্লগের বেস URL (REQUIRED for JSON feed)
  blogUrl: "https://www.galachipaprotidin.com",

  // প্রতি সেকশনে কতটি পোস্ট দেখাবে
  postsPerSection: 6,

  // হিরো সেকশনে কতটি পোস্ট
  heroPostsCount: 5,

  // ব্রেকিং নিউজে কতটি পোস্ট
  breakingNewsCount: 10,
};

// Check if blog URL is configured (API key no longer required)
export const isBloggerConfigured = () => {
  return BLOGGER_CONFIG.blogUrl !== "" && BLOGGER_CONFIG.blogUrl !== "https://yourblog.blogspot.com";
};
