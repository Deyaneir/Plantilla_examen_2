import { useState } from "react";
import { supabase } from "@/shared/api/supabase";

const getBaseUrl = () => {
  const configuredUrl =
    process.env.EXPO_PUBLIC_WEB_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  if (configuredUrl) {
    const normalizedUrl = configuredUrl.replace(/\/$/, "");
    return normalizedUrl.startsWith("http://") || normalizedUrl.startsWith("https://")
      ? normalizedUrl
      : `https://${normalizedUrl}`;
  }

  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:5173";
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const isWeb = typeof window !== "undefined" && typeof document !== "undefined";
    const redirectTo = isWeb ? `${getBaseUrl()}/confirm-email` : `authesfot://confirm-email`;

    console.log("📝 Registrando usuario...");
    console.log("   Email:", email);
    console.log("   Redirect to:", redirectTo);
    console.log("   Is Web:", isWeb);

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
    } else {
      console.log("✅ Usuario registrado:", data.user?.id);
      console.log("   Email confirmada:", data.user?.email_confirmed_at ? "SÍ" : "NO");
      console.log("   Needs confirmation:", data.user?.confirmation_sent_at ? "SÍ" : "NO");
    }

    setLoading(false);
  };

  return { register, loading, error };
};