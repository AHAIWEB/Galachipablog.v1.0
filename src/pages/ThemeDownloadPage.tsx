import { Link } from "react-router-dom";
import { Download, FileCode, CheckCircle, ArrowLeft } from "lucide-react";

const ThemeDownloadPage = () => {
  const getDownloadUrl = () => {
    const basePath = "/galachipa-protidin-theme.xml";
    const params = new URLSearchParams(window.location.search);
    const previewToken = params.get("__lovable_token");

    if (!previewToken) return basePath;

    return `${basePath}?__lovable_token=${encodeURIComponent(previewToken)}`;
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = getDownloadUrl();
    link.download = "galachipa-protidin-theme.xml";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-card border border-border rounded-lg p-8 shadow-card">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={14} /> হোমপেজে ফিরুন
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileCode size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">ব্লগার থিম</h1>
            <p className="text-sm text-muted-foreground">গলাচিপাপ্রতিদিন XML Theme</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {[
            "রেসপন্সিভ নিউজ পোর্টাল ডিজাইন",
            "Hind Siliguri বাংলা ফন্ট",
            "ব্রেকিং নিউজ টিকার",
            "ক্যাটাগরি/লেবেল ভিত্তিক লেআউট",
            "সোশ্যাল শেয়ার বাটন (FB, Twitter, WhatsApp)",
            "মোবাইল ফ্রেন্ডলি মেনু",
            "জনপ্রিয় পোস্ট সাইডবার উইজেট",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm">
              <CheckCircle size={14} className="text-primary shrink-0" />
              <span className="text-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-4 rounded-md font-bold hover:opacity-90 transition-opacity"
        >
          <Download size={18} />
          থিম ডাউনলোড করুন
        </button>

        <div className="mt-6 p-4 bg-accent rounded-md">
          <h3 className="text-sm font-bold text-foreground mb-2">ইনস্টল পদ্ধতি:</h3>
          <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
            <li>Blogger.com এ লগইন করুন</li>
            <li>Theme → Customize → Edit HTML যান</li>
            <li>পুরো কোড ডিলিট করে এই XML পেস্ট করুন</li>
            <li>Save বাটনে ক্লিক করুন</li>
            <li>Layout এ গিয়ে Navigation widget এ লেবেল লিংক যোগ করুন</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ThemeDownloadPage;
