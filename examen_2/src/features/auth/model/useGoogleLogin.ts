import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { supabase } from "@/shared/api/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { SESSION_QUERY_KEY } from "@/features/session/model/useSession";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const redirectTo = makeRedirectUri({ scheme: "authesfot", path: "auth/callback" });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      const result = await WebBrowser.openAuthSessionAsync(data.url!, redirectTo);
      console.log("result type:", result.type);

      if (result.type === "success") {
        console.log("result url:", result.url);
        const url = new URL(result.url);

        const code = url.searchParams.get("code");

        if (code) {
          const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
          if (sessionError) throw sessionError;
          queryClient.setQueryData(SESSION_QUERY_KEY, sessionData.session);
        } else {
          const hash = url.hash.substring(1);
          const params = new URLSearchParams(hash);
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          router.replace("/home");

          if (accessToken && refreshToken) {
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (sessionError) throw sessionError;
            queryClient.setQueryData(SESSION_QUERY_KEY, sessionData.session);
          }
        }
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading, error };
};