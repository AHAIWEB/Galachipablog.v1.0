import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { labels } from "@/lib/mockData";

const SiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border">
      {/* Top bar */}
      <div className="bg-foreground">
        <div className="container flex items-center justify-between py-1.5">
          <span className="text-xs text-primary-foreground/70">১৫ মার্চ, ২০২৬ | রবিবার</span>
          <Link to="/admin" className="text-xs text-primary-foreground/70 hover:text-primary-foreground transition-colors">
            এডমিন প্যানেল
          </Link>
        </div>
      </div>

      {/* Logo */}
      <div className="container py-4 text-center border-b border-border">
        <Link to="/" className="inline-block">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            গলাচিপা<span className="text-primary">প্রতিদিন</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">গলাচিপার সবচেয়ে বিশ্বস্ত সংবাদ মাধ্যম</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="container">
        <div className="flex items-center justify-between py-2 md:py-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <ul className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row absolute md:static left-0 right-0 top-full bg-card md:bg-transparent z-50 border-b md:border-0 border-border`}>
            <li>
              <Link to="/" className="block px-4 py-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                প্রচ্ছদ
              </Link>
            </li>
            {labels.map((label) => (
              <li key={label.id}>
                <Link
                  to={`/label/${label.id}`}
                  className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {label.name}
                </Link>
              </li>
            ))}
          </ul>

          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Search">
            <Search size={18} />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default SiteHeader;
