import { Facebook, Youtube, Instagram } from "lucide-react";

const SidebarWidget = () => (
  <aside className="space-y-6">
    {/* Social Links */}
    <div className="bg-card rounded-sm border border-border p-4">
      <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <div className="w-2.5 h-2.5 bg-primary rounded-sm" />
        সোশ্যাল মিডিয়া
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <a href="#" className="flex items-center gap-2 bg-[hsl(221,44%,41%)] text-[hsl(0,0%,100%)] px-3 py-2 rounded-sm text-xs font-medium hover:opacity-90 transition-opacity">
          <Facebook size={14} /> ফেসবুক
        </a>
        <a href="#" className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-sm text-xs font-medium hover:opacity-90 transition-opacity">
          <Youtube size={14} /> ইউটিউব
        </a>
        <a href="#" className="flex items-center gap-2 bg-[hsl(330,60%,50%)] text-[hsl(0,0%,100%)] px-3 py-2 rounded-sm text-xs font-medium hover:opacity-90 transition-opacity col-span-2">
          <Instagram size={14} /> ইনস্টাগ্রাম
        </a>
      </div>
    </div>

    {/* Editorial */}
    <div className="bg-card rounded-sm border border-border p-4">
      <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
        <div className="w-2.5 h-2.5 bg-primary rounded-sm" />
        সম্পাদকীয়
      </h3>
      <div className="space-y-3">
        <div className="pb-3 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground leading-snug">ঈদের পরে নতুনভাবে শুরু হোক উন্নয়নের যাত্রা</h4>
          <p className="text-xs text-muted-foreground mt-1">জনপ্রিয় কলামিস্ট মোস্তফা কামাল</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground leading-snug">ফেরার মৌসুমে জেগে উঠুন ঢাকা</h4>
          <p className="text-xs text-muted-foreground mt-1">সম্পাদকীয় ডেস্ক</p>
        </div>
      </div>
    </div>
  </aside>
);

export default SidebarWidget;
