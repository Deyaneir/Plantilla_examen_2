import { useEffect, useState } from "react";
import { supabase } from "@/shared/api/supabase";

type Status = "loading" | "success" | "error";

export const useConfirmEmail = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let hasConfirmed = false;

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("🔐 Auth event:", event, "Session:", session ? "SÍ" : "NO");

        // Eventos que indican confirmación exitosa
        if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session && !hasConfirmed) {
          console.log("✅ Email confirmado!");
          hasConfirmed = true;
          setStatus("success");

          // Cerrar sesión después de confirmar
          await supabase.auth.signOut();
        }
      });

    // Verificar estado actual de la sesión
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("📍 Current session:", data.session ? "SÍ" : "NO");
      
      if (data.session && !hasConfirmed) {
        console.log("✅ Sesión existente - confirmado!");
        hasConfirmed = true;
        setStatus("success");
        await supabase.auth.signOut();
      } else if (!hasConfirmed) {
        setStatus("error");
        setError("El link de confirmación es inválido o ha expirado.");
      }
    };

    // Esperar a que Supabase procese el token del URL
    const timer = setTimeout(checkSession, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  return { status, error };
};