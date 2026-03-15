export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  label: string;
  date: string;
  readTime: string;
  author: string;
}

const images = {
  politics: [
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1575320181282-9afab399332c?w=600&h=400&fit=crop",
  ],
  country: [
    "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1567157577867-05ccb1388e13?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop",
  ],
  world: [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=600&h=400&fit=crop",
  ],
  sports: [
    "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=400&fit=crop",
  ],
  entertainment: [
    "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1586899028174-e7098604235b?w=600&h=400&fit=crop",
  ],
  tech: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop",
  ],
  economy: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&h=400&fit=crop",
  ],
};

export const labels = [
  { id: "রাজনীতি", name: "রাজনীতি", color: "primary" },
  { id: "সারাদেশ", name: "সারাদেশ", color: "primary" },
  { id: "বিশ্ব", name: "বিশ্ব", color: "primary" },
  { id: "খেলা", name: "খেলা", color: "primary" },
  { id: "বিনোদন", name: "বিনোদন", color: "primary" },
  { id: "প্রযুক্তি", name: "প্রযুক্তি", color: "primary" },
  { id: "অর্থনীতি", name: "অর্থনীতি", color: "primary" },
  { id: "আলোচিত", name: "আলোচিত", color: "primary" },
];

export const mockPosts: NewsPost[] = [
  // রাজনীতি
  { id: "1", title: "জাতীয় সরকার গঠনের অজুহাত থেকে সরে যাচ্ছে বিএনপি: মজিবুর রহমান মঞ্জু", excerpt: "আওয়ামী লীগের প্রেসিডিয়াম সদস্য ও সাবেক মন্ত্রী মজিবুর রহমান মঞ্জু বলেছেন, বিএনপি জাতীয় সরকার গঠনের দাবি থেকে সরে আসছে।", image: images.politics[0], label: "রাজনীতি", date: "১৫ মার্চ, ২০২৬", readTime: "৫ মিনিট", author: "মোহনা টিভি" },
  { id: "2", title: "১৩ মার্চ সিলেটপুর হাইরেন প্রধানমন্ত্রী", excerpt: "প্রধানমন্ত্রীর সিলেট সফরের বিস্তারিত সময়সূচী প্রকাশ করা হয়েছে।", image: images.politics[1], label: "রাজনীতি", date: "১৫ মার্চ, ২০২৬", readTime: "৩ মিনিট", author: "মোহনা টিভি" },
  { id: "3", title: "ইশ্বরগঞ্জে খাদ্য গুদামের অবিচার প্রধানমন্ত্রীর উপজেলা পরিষদ", excerpt: "খাদ্য গুদামে অনিয়মের অভিযোগ উঠেছে স্থানীয় জনপ্রতিনিধিদের বিরুদ্ধে।", image: images.politics[2], label: "রাজনীতি", date: "১৫ মার্চ, ২০২৬", readTime: "৪ মিনিট", author: "মোহনা টিভি" },
  { id: "4", title: "দেশের রাজনৈতিক পরিস্থিতিতে নতুন মোড়: উত্তপ্ত তর্ক-বিতর্ক ও প্রত্যাশা", excerpt: "রাজনৈতিক অঙ্গনে নতুন পরিবর্তনের আভাস দিচ্ছেন বিশ্লেষকরা।", image: images.politics[3], label: "রাজনীতি", date: "১৫ মার্চ, ২০২৬", readTime: "৬ মিনিট", author: "মোহনা টিভি" },

  // সারাদেশ
  { id: "5", title: "ঈদ সামনে রেখে উত্তরে ৭২ ঘণ্টায় নানা আয়োজনে ৬০ জন গ্রেপ্তার", excerpt: "ঈদের আগে আইনশৃঙ্খলা রক্ষায় বিশেষ অভিযান চালাচ্ছে পুলিশ।", image: images.country[0], label: "সারাদেশ", date: "১৫ মার্চ, ২০২৬", readTime: "৪ মিনিট", author: "মোহনা টিভি" },
  { id: "6", title: "চট্টগ্রামে ইফতারের আয়ুব জীবন হত্যা করে খানা হাজির স্বামী", excerpt: "চট্টগ্রামে একটি মর্মান্তিক হত্যাকাণ্ডে শোকাহত এলাকাবাসী।", image: images.country[1], label: "সারাদেশ", date: "১৫ মার্চ, ২০২৬", readTime: "৩ মিনিট", author: "মোহনা টিভি" },
  { id: "7", title: "বাগেরহাটে পরিবহন শ্রমিক আন্দোলন ও যানজটের উত্তরণ", excerpt: "পরিবহন সংকটে ভুগছেন বাগেরহাটের মানুষ।", image: images.country[2], label: "সারাদেশ", date: "১৫ মার্চ, ২০২৬", readTime: "৫ মিনিট", author: "মোহনা টিভি" },

  // বিশ্ব
  { id: "8", title: "স্টিভেন হকিং: মহাবিশ্ব গবেষণায় কিংবদন্তি বিজ্ঞানী", excerpt: "পদার্থবিজ্ঞানের ইতিহাসে অন্যতম উজ্জ্বল নক্ষত্র স্টিভেন হকিং।", image: images.world[0], label: "বিশ্ব", date: "১৫ মার্চ, ২০২৬", readTime: "৭ মিনিট", author: "মোহনা টিভি" },
  { id: "9", title: "খাদু শিশু: ইনকা সভ্যতার রহস্যময় নগরী", excerpt: "দক্ষিণ আমেরিকার প্রাচীন সভ্যতার নতুন তথ্য উদঘাটন।", image: images.world[1], label: "বিশ্ব", date: "১৫ মার্চ, ২০২৬", readTime: "৬ মিনিট", author: "মোহনা টিভি" },

  // খেলা
  { id: "10", title: "লিওনেল মেসি: আধুনিক ফুটবলের কিংবদন্তি", excerpt: "বিশ্ব ফুটবলের সেরা খেলোয়াড় মেসির ক্যারিয়ারের অসাধারণ যাত্রা।", image: images.sports[0], label: "খেলা", date: "১৫ মার্চ, ২০২৬", readTime: "৫ মিনিট", author: "মোহনা টিভি" },
  { id: "11", title: "উসাইন বোল্ট: বিশ্বের দ্রুততম মানুষ", excerpt: "স্প্রিন্টিং ইতিহাসে অমর হয়ে থাকবেন জ্যামাইকার এই তারকা।", image: images.sports[1], label: "খেলা", date: "১৫ মার্চ, ২০২৬", readTime: "৪ মিনিট", author: "মোহনা টিভি" },
  { id: "12", title: "ক্রিকেটে কিংবদন্তি স্যার ডন ব্র্যাডম্যান", excerpt: "ক্রিকেট ইতিহাসের সবচেয়ে মহান ব্যাটসম্যানের গল্প।", image: images.sports[2], label: "খেলা", date: "১৫ মার্চ, ২০২৬", readTime: "৬ মিনিট", author: "মোহনা টিভি" },

  // বিনোদন
  { id: "13", title: "সাদিয়ার লাস্ট সিজন-এও রয়েছে বিভ্রান্তি!", excerpt: "জনপ্রিয় ধারাবাহিকের শেষ পর্বে দর্শকদের অপেক্ষা।", image: images.entertainment[0], label: "বিনোদন", date: "১৫ মার্চ, ২০২৬", readTime: "৩ মিনিট", author: "মোহনা টিভি" },
  { id: "14", title: "সিনেমার সঙ্গে ভালোবাসার 'রাক্কস' এর রহস্যময় যাত্রা", excerpt: "নতুন চলচ্চিত্রে দেখা যাচ্ছে অভিনেতা-অভিনেত্রীদের নতুন রূপ।", image: images.entertainment[1], label: "বিনোদন", date: "১৫ মার্চ, ২০২৬", readTime: "৪ মিনিট", author: "মোহনা টিভি" },

  // প্রযুক্তি
  { id: "15", title: "গুগল ক্রোমে ব্রাউজার ইতিহাসের নিরাপদ সুরক্ষার নতুন উপায়", excerpt: "ব্রাউজার নিরাপত্তায় গুগলের নতুন ফিচার।", image: images.tech[0], label: "প্রযুক্তি", date: "১৫ মার্চ, ২০২৬", readTime: "৫ মিনিট", author: "মোহনা টিভি" },
  { id: "16", title: "প্রযুক্তি আপডেটে নতুন তৈরি সফটওয়্যারি প্ল্যাটফর্মের জগৎ", excerpt: "প্রযুক্তি বিশ্বে নতুন সফটওয়্যারের আলোচনা।", image: images.tech[1], label: "প্রযুক্তি", date: "১৫ মার্চ, ২০২৬", readTime: "৪ মিনিট", author: "মোহনা টিভি" },

  // অর্থনীতি
  { id: "17", title: "পুঁজিবাজারে সাপ্তাহিক লেনদেন কমেছে ১৪ শতাংশ", excerpt: "শেয়ারবাজারে লেনদেন কমে যাওয়ায় বিনিয়োগকারীদের মধ্যে উদ্বেগ।", image: images.economy[0], label: "অর্থনীতি", date: "১৫ মার্চ, ২০২৬", readTime: "৫ মিনিট", author: "মোহনা টিভি" },
  { id: "18", title: "মুরগির বাজারে অস্থিরতা, খামারিদের ছয় দফা দাবি", excerpt: "পোল্ট্রি শিল্পে সংকট: খামারিরা সরকারের কাছে দাবি জানাচ্ছেন।", image: images.economy[1], label: "অর্থনীতি", date: "১৫ মার্চ, ২০২৬", readTime: "৪ মিনিট", author: "মোহনা টিভি" },
];

export const getPostsByLabel = (label: string) => mockPosts.filter(p => p.label === label);
export const getLatestPosts = (count = 5) => mockPosts.slice(0, count);
