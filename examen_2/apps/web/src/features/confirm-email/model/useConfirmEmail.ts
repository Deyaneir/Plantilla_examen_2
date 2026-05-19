import { useEffect, useState } from "react";
import { supabase } from "@/shared/api/supabase";

type Status = "loading" | "success" | "error";

export const useConfirmEmail = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let hasConfirmed = false;

    const parseFromLocation = () => {
      const search = typeof window !== "undefined" ? window.location.search.replace(/^\?/, "") : "";
      const hash = typeof window !== "undefined" ? (window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash) : "";
      const searchParams = new URLSearchParams(search);
      const hashParams = new URLSearchParams(hash);

      return {
        accessToken: hashParams.get("access_token") ?? searchParams.get("access_token"),
        refreshToken: hashParams.get("refresh_token") ?? searchParams.get("refresh_token"),
        code: searchParams.get("code") ?? hashParams.get("code"),
        token: searchParams.get("token") ?? hashParams.get("token"),
        email: searchParams.get("email") ?? hashParams.get("email"),
        type: hashParams.get("type") ?? searchParams.get("type"),
      };
    };

    const tryConsumeToken = async () => {
      try {
        const { accessToken, refreshToken, code, token, email, type } = parseFromLocation();
        console.log(
          "🔍 ConfirmEmail attempt - code:", !!code,
          "token:", !!token,
          "access_token:", !!accessToken,
          "type:", type,
        );

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          console.log("✅ exchangeCodeForSession OK");
          setStatus("success");
          await supabase.auth.signOut();
          return true;
        }

        if (token && email) {
          const verificationType = type === "recovery" ? "recovery" : "email";
          const { error } = await supabase.auth.verifyOtp({
            token,
            email,
            type: verificationType,
          });

          if (error) throw error;
          console.log("✅ verifyOtp OK");
          setStatus("success");
          await supabase.auth.signOut();
          return true;
        }

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (error) throw error;
          console.log("✅ setSession OK");
          setStatus("success");
          await supabase.auth.signOut();
          return true;
        }

        return false;
      } catch (err: any) {
        console.log("❌ Error consuming token:", err?.message ?? err);
        setError(err?.message ?? "Error al procesar el enlace.");
        setStatus("error");
        return false;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔐 Auth event:", event, "Session:", session ? "SÍ" : "NO");
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session && !hasConfirmed) {
        console.log("✅ Email confirmado via auth state!");
        hasConfirmed = true;
        setStatus("success");
        await supabase.auth.signOut();
      }
    });

    const timer = setTimeout(async () => {
      const ok = await tryConsumeToken();

      if (ok) return;

      const { data } = await supabase.auth.getSession();
      if (data.session && !hasConfirmed) {
        console.log("✅ Sesión detectada despues de espera - confirmado!");
        hasConfirmed = true;
        setStatus("success");
        await supabase.auth.signOut();
        return;
      }

        if (!hasConfirmed) {
        setStatus("error");
        setError("El link de confirmación es inválido o ha expirado.");
      }
    }, 400);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  return { status, error };
};