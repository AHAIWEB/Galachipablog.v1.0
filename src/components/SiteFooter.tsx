import { Link } from "react-router-dom";
import { labels } from "@/lib/mockData";

const SiteFooter = () => (
  <footer className="bg-foreground mt-8">
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-primary-foreground">
            গলাচিপা<span className="text-primary">প্রতিদিন</span>
          </h3>
          <p className="text-sm text-primary-foreground/60 mt-2">
            গলাচিপার সবচেয়ে বিশ্বস্ত অনলাইন সংবাদ মাধ্যম। স্থানীয় ও জাতীয় সব খবর পান সবার আগে।
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-primary-foreground mb-3">বিভাগসমূহ</h4>
          <ul className="space-y-1.5">
            {labels.map(l => (
              <li key={l.id}>
                <Link to={`/label/${l.id}`} className="text-sm text-primary-foreground/60 hover:text-primary transition-colors">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-primary-foreground mb-3">যোগাযোগ</h4>
          <p className="text-sm text-primary-foreground/60">ঠিকানা: গলাচিপা, পটুয়াখালী</p>
          <p className="text-sm text-primary-foreground/60 mt-1">ইমেইল: info@galachipaprotidin.com</p>
          <p className="text-sm text-primary-foreground/60 mt-1">ফোন: +৮৮০ ১৭XX-XXXXXX</p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-6 pt-4 text-center">
        <p className="text-xs text-primary-foreground/40">© ২০২৬ গলাচিপাপ্রতিদিন। সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
