// Blogger API Configuration
// আপনার ব্লগার সাইটের Blog ID এবং Google API Key এখানে সেট করুন
export const BLOGGER_CONFIG = {
  // আপনার Blogger Blog ID
  // Blogger Dashboard → Settings → Blog ID থেকে পাবেন
  blogId: "311636221121167283",

  // Google API Key (Blogger API v3)
  apiKey: "AIzaSyAV4SO5rq8io1FdRA8GENWELB5h2XOO30U",

  // ব্লগের বেস URL
  blogUrl: "https://www.galachipaprotidin.com",

  // প্রতি সেকশনে কতটি পোস্ট দেখাবে
  postsPerSection: 6,

  // হিরো সেকশনে কতটি পোস্ট
  heroPostsCount: 5,

  // ব্রেকিং নিউজে কতটি পোস্ট
  breakingNewsCount: 10,
};

// API সক্রিয় কিনা চেক করা
export const isBloggerConfigured = () => {
  return BLOGGER_CONFIG.blogId !== "" && BLOGGER_CONFIG.apiKey !== "";
};
