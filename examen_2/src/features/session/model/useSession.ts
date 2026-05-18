import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/shared/api/supabase";
import type { Session } from "@supabase/supabase-js";

export const SESSION_QUERY_KEY = ["auth", "session"] as const;

export const useSession = () => {
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useQuery<Session | null>({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        queryClient.setQueryData(SESSION_QUERY_KEY, newSession);
      }
    );
    return () => subscription.unsubscribe();
  }, [queryClient]);

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
  };

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    user: session?.user ?? null,
    signOut,
  };
};