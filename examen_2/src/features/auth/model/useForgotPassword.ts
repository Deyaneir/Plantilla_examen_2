import { supabase } from "@/shared/api/supabase";
import { useMutation } from "@tanstack/react-query";

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

  // In browser: use window.location.origin when no public URL is configured.
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return window.location.origin;
  }

  // Fallback for local dev or non-browser contexts without public URL config.
  return "http://localhost:5173";
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const baseUrl = getBaseUrl();
      const redirectTo = `${baseUrl}/reset-password`;

      console.log("📧 Sending reset email to:", normalizedEmail);
      console.log("🔗 Redirect to:", redirectTo);

      const { data, error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo,
      });

      if (error) {
        console.log("❌ Reset password error:", error.message);
        throw error;
      }
      
      console.log("✅ Reset email sent:", data);
      return normalizedEmail;
    },
  });
};