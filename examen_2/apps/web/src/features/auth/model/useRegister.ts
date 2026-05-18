import { useState } from "react";
import { supabase } from "@/shared/api/supabase";

type Status = "idle" | "loading" | "success" | "error";

export const useRegister = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const register = async (email: string, password: string) => {
    setStatus("loading");
    setError(null);

    const redirectTo = `${window.location.origin}/confirm-email`;

    console.log("📝 Registrando usuario...");
    console.log("   Email:", email);
    console.log("   Redirect to:", redirectTo);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (signUpError) {
      console.log("❌ Error registro:", signUpError.message);
      setError(signUpError.message);
      setStatus("error");
    } else {
      console.log("✅ Usuario registrado:", data.user?.id);
      console.log("   Email confirmada:", data.user?.email_confirmed_at ? "SÍ" : "NO");
      console.log("   Needs confirmation:", data.user?.confirmation_sent_at ? "SÍ" : "NO");
      setStatus("success");
    }
  };

  return { register, status, error };
};
