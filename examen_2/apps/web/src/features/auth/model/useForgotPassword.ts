import { supabase } from "@/shared/api/supabase";
import { useMutation } from "@tanstack/react-query";

const WEB_APP_URL = "https://plantilla-examen-2.vercel.app";

const getPublicOrigin = () => {
  return WEB_APP_URL;
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
