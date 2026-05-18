import { supabase } from "@/shared/api/supabase";
import { useMutation } from "@tanstack/react-query";

const getPublicOrigin = () => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return window.location.origin;
  }

  const configuredUrl = import.meta.env.VITE_PUBLIC_WEB_URL || import.meta.env.VITE_WEB_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  return "http://localhost:5173";
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const redirectTo = `${getPublicOrigin()}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo,
      });

      if (error) throw error;
      return normalizedEmail;
    },
  });
};
