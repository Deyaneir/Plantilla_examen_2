import { useState } from "react";
import { supabase } from "@/shared/api/supabase";

const DEFAULT_WEB_APP_URL = "https://plantilla-examen-2.vercel.app";

const getBaseUrl = () => {
  // Prefer explicit EXPO_PUBLIC_WEB_URL from environment, fallback to default
  const envUrl = process.env.EXPO_PUBLIC_WEB_URL;
  return (envUrl && envUrl.replace(/\/$/, "")) || DEFAULT_WEB_APP_URL;
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Always use the public web URL for email redirects so links point to Vercel
      const redirectTo = `${getBaseUrl()}/confirm-email`;

      console.log("📝 Registrando usuario...");
      console.log("   Email:", email);
      console.log("   Redirect to:", redirectTo);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        console.log("❌ Error registro:", error.message);
        setError(error.message);
        throw error;
      }

      console.log("✅ Usuario registrado:", data.user?.id);
      console.log("   Email confirmada:", data.user?.email_confirmed_at ? "SÍ" : "NO");
      console.log("   Needs confirmation:", data.user?.confirmation_sent_at ? "SÍ" : "NO");
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};