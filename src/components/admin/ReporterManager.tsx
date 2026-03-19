import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Trash2, Shield, Pencil } from "lucide-react";

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
}

interface UserRole {
  id: string;
  user_id: string;
  role: "admin" | "editor" | "reporter";
  created_at: string;
}

const ReporterManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "reporter">("reporter");

  // Fetch roles with profiles
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      // Fetch profiles for these users
      const userIds = (data || []).map((r: any) => r.user_id);
      const { data: profiles } = await supabase.from("profiles").select("*").in("id", userIds);
      return (data || []).map((r: any) => ({
        ...r,
        profile: (profiles || []).find((p: any) => p.id === r.user_id),
      }));
    },
  });

  const addRoleMutation = useMutation({
    mutationFn: async () => {
      // Find user by email from profiles
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", newEmail.trim());
      if (pErr) throw pErr;
      if (!profiles || profiles.length === 0) {
        throw new Error("এই ইমেইলে কোনো ইউজার পাওয়া যায়নি। আগে সাইনআপ করতে হবে।");
      }
      const { error } = await supabase.from("user_roles").insert({
        user_id: profiles[0].id,
        role: newRole,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast({ title: "রোল যুক্ত হয়েছে ✅" });
      setNewEmail("");
    },
    onError: (err: Error) => {
      toast({ title: err.message, variant: "destructive" });
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast({ title: "রোল মুছে ফেলা হয়েছে" });
    },
  });

  return (
    <div className="bg-card border border-border rounded-sm p-4">
      <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
        <Shield size={16} /> এডমিন ও রিপোর্টার ম্যানেজমেন্ট
      </h3>

      {/* Add new role */}
      <div className="flex gap-2 mb-4">
        <Input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="ইমেইল লিখুন"
          className="flex-1"
        />
        <Select value={newRole} onValueChange={(v) => setNewRole(v as "admin" | "reporter")}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reporter">রিপোর্টার</SelectItem>
            <SelectItem value="admin">এডমিন</SelectItem>
          </SelectContent>
        </Select>
        <Button
          size="sm"
          onClick={() => addRoleMutation.mutate()}
          disabled={!newEmail.trim() || addRoleMutation.isPending}
        >
          <UserPlus size={14} className="mr-1" /> যুক্ত
        </Button>
      </div>

      {/* Roles list */}
      <div className="space-y-2">
        {roles.map((r: any) => (
          <div key={r.id} className="flex items-center justify-between bg-muted/50 rounded-sm px-3 py-2 text-sm">
            <div>
              <span className="font-medium text-foreground">{r.profile?.display_name || r.profile?.email || r.user_id}</span>
              <span className="text-muted-foreground ml-2 text-xs">{r.profile?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${r.role === "admin" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-700"}`}>
                {r.role === "admin" ? "এডমিন" : "রিপোর্টার"}
              </span>
              <button
                onClick={() => removeRoleMutation.mutate(r.id)}
                className="p-1 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {isLoading && <p className="text-xs text-muted-foreground">লোড হচ্ছে...</p>}
        {!isLoading && roles.length === 0 && <p className="text-xs text-muted-foreground">কোনো রোল নেই</p>}
      </div>
    </div>
  );
};

export default ReporterManager;
