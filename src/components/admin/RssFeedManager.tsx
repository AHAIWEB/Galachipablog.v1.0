import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Rss, Plus, Trash2, Globe } from "lucide-react";

const RssFeedManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const { data: feeds = [], isLoading } = useQuery({
    queryKey: ["admin-rss-feeds"],
    queryFn: async () => {
      const { data, error } = await supabase.from("rss_feeds").select("*").order("created_at");
      if (error) throw error;
      return data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("rss_feeds").insert({ name: newName.trim(), url: newUrl.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rss-feeds"] });
      toast({ title: "ফিড যুক্ত হয়েছে ✅" });
      setNewName("");
      setNewUrl("");
    },
    onError: (err: Error) => toast({ title: err.message, variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { error } = await supabase.from("rss_feeds").update({ enabled }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-rss-feeds"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rss_feeds").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-rss-feeds"] });
      toast({ title: "ফিড মুছে ফেলা হয়েছে" });
    },
  });

  return (
    <div className="bg-card border border-border rounded-sm p-4">
      <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
        <Rss size={16} className="text-primary" /> RSS ফিড ম্যানেজার
      </h3>
      <p className="text-xs text-muted-foreground mb-4">হোমপেজে সংবাদ সংকলন সেকশনে যেসব সোর্স দেখাবে সেগুলো এখান থেকে ম্যানেজ করুন। প্রতি ১ মিনিটে অটো রিফ্রেশ হয়।</p>

      {/* Add new */}
      <div className="flex gap-2 mb-4">
        <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="সোর্সের নাম" className="w-40" />
        <Input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://example.com/feed" className="flex-1" />
        <Button size="sm" onClick={() => addMutation.mutate()} disabled={!newName.trim() || !newUrl.trim() || addMutation.isPending}>
          <Plus size={14} className="mr-1" /> যুক্ত
        </Button>
      </div>

      {/* Feed list */}
      <div className="space-y-2">
        {feeds.map((feed: any) => (
          <div key={feed.id} className="flex items-center justify-between bg-muted/50 rounded-sm px-3 py-2 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <Globe size={12} className="text-primary shrink-0" />
              <span className="font-medium text-foreground">{feed.name}</span>
              <span className="text-xs text-muted-foreground truncate">{feed.url}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Switch
                checked={feed.enabled}
                onCheckedChange={enabled => toggleMutation.mutate({ id: feed.id, enabled })}
              />
              <button
                onClick={() => deleteMutation.mutate(feed.id)}
                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {isLoading && <p className="text-xs text-muted-foreground">লোড হচ্ছে...</p>}
        {!isLoading && feeds.length === 0 && <p className="text-xs text-muted-foreground">কোনো ফিড নেই</p>}
      </div>
    </div>
  );
};

export default RssFeedManager;
