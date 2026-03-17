import { useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Pencil, Trash2, Eye, Globe, Loader2, LogOut,
  ClipboardPaste, ArrowUp, ArrowDown, Users, Star, StarOff,
  Rss, X, ImageIcon
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LabelBadge from "@/components/LabelBadge";
import RichEditor from "@/components/RichEditor";
import ReporterManager from "@/components/admin/ReporterManager";
import { labels } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Post {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  source_url: string | null;
  source_name: string | null;
  label: string;
  tags: string[];
  featured: boolean;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const AdminPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [filterLabel, setFilterLabel] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    label: "",
    tags: [] as string[],
    featured: false,
    image_url: "",
    source_url: "",
    source_name: "",
  });
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-posts", filterLabel],
    queryFn: async () => {
      let query = supabase.from("posts").select("*").order("sort_order", { ascending: false }).order("created_at", { ascending: false });
      if (filterLabel !== "all") query = query.eq("label", filterLabel);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map((p: any) => ({ ...p, tags: p.tags || [], featured: p.featured || false })) as Post[];
    },
  });

  // Save
  const saveMutation = useMutation({
    mutationFn: async (data: { isEdit: boolean; id?: string }) => {
      const payload = {
        title: form.title,
        content: form.content,
        excerpt: form.excerpt || form.content.replace(/<[^>]*>/g, "").slice(0, 150),
        image_url: form.image_url,
        source_url: form.source_url,
        source_name: form.source_name,
        label: form.label,
        tags: form.tags,
        featured: form.featured,
        status: "draft" as const,
      };
      if (data.isEdit && data.id) {
        const { error } = await supabase.from("posts").update(payload).eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      toast({ title: editingPost ? "পোস্ট আপডেট হয়েছে ✅" : "নতুন পোস্ট তৈরি হয়েছে ✅" });
      setDialogOpen(false);
    },
    onError: (err: Error) => toast({ title: "ত্রুটি: " + err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      toast({ title: "পোস্ট মুছে ফেলা হয়েছে" });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").update({ status: "published" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      toast({ title: "পোস্ট পাবলিশ হয়েছে ✅" });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase.from("posts").update({ featured }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: "up" | "down" }) => {
      const idx = posts.findIndex(p => p.id === id);
      if (idx < 0) return;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= posts.length) return;
      const current = posts[idx];
      const swap = posts[swapIdx];
      await Promise.all([
        supabase.from("posts").update({ sort_order: swap.sort_order || 0 }).eq("id", current.id),
        supabase.from("posts").update({ sort_order: current.sort_order || 0 }).eq("id", swap.id),
      ]);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-posts"] }),
  });

  // URL fetch with full content
  const handleFetchUrl = useCallback(async () => {
    if (!form.source_url.trim()) return;
    setFetchingUrl(true);
    try {
      const { data, error } = await supabase.functions.invoke("scrape-url", {
        body: { url: form.source_url },
      });
      if (error) throw error;
      const fullContent = data.bodyText
        ? `${data.image ? `<img src="${data.image}" alt="${data.title || ""}" />` : ""}<p>${data.bodyText}</p><p><em>সূত্র: <a href="${form.source_url}" target="_blank">${data.siteName || form.source_url}</a></em></p>`
        : form.content;
      setForm(f => ({
        ...f,
        title: data.title || f.title,
        excerpt: data.description || f.excerpt,
        image_url: data.image || f.image_url,
        source_name: data.siteName || f.source_name,
        content: fullContent,
      }));
      toast({ title: "URL থেকে সম্পূর্ণ তথ্য আনা হয়েছে ✅" });
    } catch (err: any) {
      toast({ title: "URL ফেচ ব্যর্থ: " + err.message, variant: "destructive" });
    } finally {
      setFetchingUrl(false);
    }
  }, [form.source_url, toast]);

  // Paste handler
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) { toast({ title: "ক্লিপবোর্ড খালি", variant: "destructive" }); return; }

      // Check if it's a URL
      const isUrl = /^https?:\/\//i.test(text.trim());
      if (isUrl) {
        setEditingPost(null);
        setForm({ title: "", content: "", excerpt: "", label: labels[0].id, tags: [], featured: false, image_url: "", source_url: text.trim(), source_name: "" });
        setDialogOpen(true);
        // Auto-fetch
        setFetchingUrl(true);
        try {
          const { data, error } = await supabase.functions.invoke("scrape-url", { body: { url: text.trim() } });
          if (!error && data) {
            const fullContent = data.bodyText
              ? `${data.image ? `<img src="${data.image}" alt="${data.title || ""}" />` : ""}<p>${data.bodyText}</p><p><em>সূত্র: <a href="${text.trim()}" target="_blank">${data.siteName || text.trim()}</a></em></p>`
              : "";
            setForm(f => ({
              ...f,
              title: data.title || "",
              excerpt: data.description || "",
              image_url: data.image || "",
              source_name: data.siteName || "",
              content: fullContent,
            }));
          }
        } catch {} finally { setFetchingUrl(false); }
        toast({ title: "URL পেস্ট ও অটো-ফেচ হচ্ছে ✅" });
      } else {
        setEditingPost(null);
        const lines = text.split("\n").filter(l => l.trim());
        setForm({
          title: lines[0]?.slice(0, 200) || "",
          content: `<p>${text.replace(/\n/g, "</p><p>")}</p>`,
          excerpt: text.replace(/\n/g, " ").slice(0, 150),
          label: labels[0].id,
          tags: [],
          featured: false,
          image_url: "",
          source_url: "",
          source_name: "",
        });
        setDialogOpen(true);
        toast({ title: "ক্লিপবোর্ড থেকে পেস্ট হয়েছে ✅" });
      }
    } catch {
      toast({ title: "ক্লিপবোর্ড অ্যাক্সেস ব্যর্থ", variant: "destructive" });
    }
  }, [toast]);

  const openCreate = () => {
    setEditingPost(null);
    setForm({ title: "", content: "", excerpt: "", label: labels[0].id, tags: [], featured: false, image_url: "", source_url: "", source_name: "" });
    setDialogOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      content: post.content || "",
      excerpt: post.excerpt || "",
      label: post.label,
      tags: post.tags || [],
      featured: post.featured || false,
      image_url: post.image_url || "",
      source_url: post.source_url || "",
      source_name: post.source_name || "",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) { toast({ title: "শিরোনাম আবশ্যক", variant: "destructive" }); return; }
    saveMutation.mutate({ isEdit: !!editingPost, id: editingPost?.id });
  };

  const toggleTag = (tag: string) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground sticky top-0 z-50">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-lg font-bold text-primary-foreground">
              গলাচিপা<span className="text-primary">প্রতিদিন</span>
              <span className="text-xs font-normal text-primary-foreground/50 ml-2">এডমিন</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-primary-foreground/50 hidden sm:inline">{user?.email}</span>
            <button onClick={async () => { await signOut(); navigate("/login"); }} className="text-xs text-primary-foreground/60 hover:text-primary-foreground flex items-center gap-1">
              <LogOut size={14} /> লগআউট
            </button>
            <Link to="/" className="text-xs text-primary-foreground/60 hover:text-primary-foreground flex items-center gap-1">
              <Eye size={14} /> সাইট
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Tabs defaultValue="posts">
          <TabsList className="mb-4">
            <TabsTrigger value="posts">📝 পোস্ট</TabsTrigger>
            <TabsTrigger value="team"><Users size={14} className="mr-1" /> টিম</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <div className="bg-card border border-border rounded-sm p-3">
                <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                <p className="text-xs text-muted-foreground">মোট</p>
              </div>
              <div className="bg-card border border-border rounded-sm p-3">
                <p className="text-2xl font-bold text-foreground">{posts.filter(p => p.status === "published").length}</p>
                <p className="text-xs text-muted-foreground">পাবলিশড</p>
              </div>
              <div className="bg-card border border-border rounded-sm p-3">
                <p className="text-2xl font-bold text-primary">{posts.filter(p => p.status === "draft").length}</p>
                <p className="text-xs text-muted-foreground">ড্রাফট</p>
              </div>
              <div className="bg-card border border-border rounded-sm p-3">
                <p className="text-2xl font-bold text-primary">{posts.filter(p => p.featured).length}</p>
                <p className="text-xs text-muted-foreground">⭐ ফিচার্ড</p>
              </div>
              <div className="bg-card border border-border rounded-sm p-3">
                <p className="text-2xl font-bold text-primary">{labels.length}</p>
                <p className="text-xs text-muted-foreground">লেবেল</p>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">পোস্ট</h2>
                <Select value={filterLabel} onValueChange={setFilterLabel}>
                  <SelectTrigger className="w-36 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">সব লেবেল</SelectItem>
                    {labels.map(l => (
                      <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handlePaste}>
                  <ClipboardPaste size={14} className="mr-1" /> পেস্ট
                </Button>
                <Button size="sm" onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus size={14} className="mr-1" /> নতুন পোস্ট
                </Button>
              </div>
            </div>

            {/* Posts table */}
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="animate-spin mr-2" size={18} /> লোড হচ্ছে...
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">কোনো পোস্ট নেই</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-center px-2 py-2.5 font-semibold text-foreground w-16">ক্রম</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-foreground">শিরোনাম</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-foreground hidden md:table-cell">লেবেল</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-foreground hidden md:table-cell">স্ট্যাটাস</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-foreground">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post, idx) => (
                        <tr key={post.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="px-2 py-3">
                            <div className="flex flex-col items-center gap-0.5">
                              <button onClick={() => reorderMutation.mutate({ id: post.id, direction: "up" })} disabled={idx === 0} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30">
                                <ArrowUp size={14} />
                              </button>
                              <button onClick={() => reorderMutation.mutate({ id: post.id, direction: "down" })} disabled={idx === posts.length - 1} className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30">
                                <ArrowDown size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {post.image_url && (
                                <img src={post.image_url} alt="" className="w-12 h-9 rounded-sm object-cover shrink-0 hidden sm:block" />
                              )}
                              <div>
                                <div className="flex items-center gap-1.5">
                                  {post.featured && <Star size={12} className="text-primary fill-primary shrink-0" />}
                                  <span className="font-medium text-foreground line-clamp-1">{post.title}</span>
                                </div>
                                {post.source_name && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <Globe size={10} /> {post.source_name}
                                  </span>
                                )}
                                {post.tags && post.tags.length > 0 && (
                                  <div className="flex gap-1 mt-0.5 flex-wrap">
                                    {post.tags.map(t => (
                                      <span key={t} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground">{t}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <LabelBadge label={post.label} />
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${post.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {post.status === "published" ? "পাবলিশড" : "ড্রাফট"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => toggleFeaturedMutation.mutate({ id: post.id, featured: !post.featured })}
                                className={`p-1.5 rounded-sm transition-colors ${post.featured ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                                title={post.featured ? "ফিচার্ড সরান" : "ফিচার্ড করুন"}
                              >
                                {post.featured ? <Star size={14} className="fill-primary" /> : <StarOff size={14} />}
                              </button>
                              {post.status === "draft" && (
                                <button onClick={() => publishMutation.mutate(post.id)} className="p-1.5 rounded-sm text-green-600 hover:bg-green-50 text-xs font-medium">
                                  পাবলিশ
                                </button>
                              )}
                              <button onClick={() => openEdit(post)} className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted">
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => deleteMutation.mutate(post.id)} className="p-1.5 rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="team">
            <ReporterManager />
          </TabsContent>
        </Tabs>
      </main>

      {/* Post Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "পোস্ট সম্পাদনা" : "নতুন পোস্ট তৈরি"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {/* URL Fetch + Paste */}
            <div className="bg-muted/50 border border-border rounded-sm p-3">
              <label className="text-xs font-medium text-foreground mb-1.5 block">🔗 URL থেকে কুইক পোস্ট</label>
              <div className="flex gap-2">
                <Input
                  value={form.source_url}
                  onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))}
                  placeholder="https://example.com/news-article"
                  className="flex-1"
                />
                <Button onClick={handleFetchUrl} disabled={fetchingUrl || !form.source_url.trim()} variant="outline" size="sm" className="shrink-0">
                  {fetchingUrl ? <Loader2 className="animate-spin" size={14} /> : <Globe size={14} />}
                  <span className="ml-1">ফেচ</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text.trim()) {
                        setForm(f => ({ ...f, source_url: text.trim() }));
                        toast({ title: "পেস্ট হয়েছে" });
                      }
                    } catch { toast({ title: "ক্লিপবোর্ড অ্যাক্সেস ব্যর্থ", variant: "destructive" }); }
                  }}
                >
                  <ClipboardPaste size={14} />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">শিরোনাম, ছবি, সম্পূর্ণ কন্টেন্ট ও সোর্স অটো আসবে</p>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-medium text-foreground">শিরোনাম *</label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="খবরের শিরোনাম" className="mt-1" />
            </div>

            {/* Excerpt */}
            <div>
              <label className="text-xs font-medium text-foreground">সংক্ষিপ্ত বিবরণ</label>
              <Input value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="সংক্ষিপ্ত বিবরণ" className="mt-1" />
            </div>

            {/* Label + Source + Featured */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground">প্রধান লেবেল</label>
                <Select value={form.label} onValueChange={v => setForm(f => ({ ...f, label: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {labels.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">সোর্স</label>
                <Input value={form.source_name} onChange={e => setForm(f => ({ ...f, source_name: e.target.value }))} placeholder="প্রথম আলো..." className="mt-1" />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant={form.featured ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                >
                  <Star size={14} className={`mr-1 ${form.featured ? "fill-primary-foreground" : ""}`} />
                  {form.featured ? "ফিচার্ড ✅" : "ফিচার্ড করুন"}
                </Button>
              </div>
            </div>

            {/* Multi-label Tags */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">🏷️ অতিরিক্ত ট্যাগ/লেবেল</label>
              <div className="flex flex-wrap gap-1.5">
                {labels.map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => toggleTag(l.id)}
                    className={`text-xs px-2.5 py-1 rounded-sm border transition-colors ${
                      form.tags.includes(l.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                    }`}
                  >
                    {l.name}
                    {form.tags.includes(l.id) && <X size={10} className="ml-1 inline" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="text-xs font-medium text-foreground">ছবির URL</label>
              <Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." className="mt-1" />
              {form.image_url && <img src={form.image_url} alt="Preview" className="mt-2 h-32 rounded-sm object-cover" />}
            </div>

            {/* Rich Editor */}
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">কন্টেন্ট</label>
              <RichEditor content={form.content} onChange={html => setForm(f => ({ ...f, content: html }))} />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saveMutation.isPending} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                {saveMutation.isPending && <Loader2 className="animate-spin mr-1" size={14} />}
                {editingPost ? "আপডেট করুন" : "ড্রাফট সেভ করুন"}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>বাতিল</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
