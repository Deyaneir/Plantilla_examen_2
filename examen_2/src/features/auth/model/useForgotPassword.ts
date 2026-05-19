import { supabase } from "@/shared/api/supabase";
import { useMutation } from "@tanstack/react-query";

const WEB_APP_URL = "https://plantilla-examen-2.vercel.app";

const getBaseUrl = () => {
  return WEB_APP_URL;
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