import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "admin" | "editor" | "reporter";

export const useUserRole = () => {
  const { user } = useAuth();

  return useQuery<AppRole | null>({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data?.role as AppRole) || null;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
};
