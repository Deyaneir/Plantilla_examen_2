import { supabase } from "@/shared/api/supabase";
import { useEffect, useState } from "react";

type Status = "loading" | "ready" | "updating" | "success" | "error";

export const useResetPassword = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isPasswordRecovery = false;

    const init = async () => {
      try {
        // Parsear tokens del URL
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        console.log("🔑 Reset Password URL:", {
          accessToken: accessToken ? "SÍ" : "NO",
          refreshToken: refreshToken ? "SÍ" : "NO",
          type,
        });

        // Si hay tokens en el URL, establecer sesión
        if (accessToken && refreshToken && type === "recovery") {
          console.log("🔄 Estableciendo sesión de recuperación...");
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (setSessionError) {
            console.log("❌ Error setSession:", setSessionError.message);
            setStatus("error");
            setError("Link inválido o expirado");
            return;
          }

          console.log("✅ Sesión establecida");
          isPasswordRecovery = true;
          setStatus("ready");
        } else {
          // Sino, verificar sesión actual
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            console.log("✅ Sesión existente detectada");
            isPasswordRecovery = true;
            setStatus("ready");
          } else {
            console.log("❌ No hay sesión");
            setStatus("error");
            setError("Link inválido o expirado");
          }
        }
      } catch (err: any) {
        console.log("❌ Error:", err.message);
        setStatus("error");
        setError("Error al procesar el enlace");
      }
    };

    init();

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((event) => {
        console.log("🔐 Auth event:", event);
        if (event === "PASSWORD_RECOVERY") {
          console.log("✅ PASSWORD_RECOVERY event");
          isPasswordRecovery = true;
          setStatus("ready");
        }
      });

    return () => subscription.unsubscribe();
  }, []);

  const updatePassword = async (newPassword: string) => {
    setStatus("updating");
    setError(null);

    console.log("🔐 Actualizando contraseña...");
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.log("❌ Error updateUser:", error.message);
      setError(error.message);
      setStatus("ready");
      return;
    }

    console.log("✅ Contraseña actualizada!");
    await supabase.auth.signOut();
    setStatus("success");
  };

  return { status, error, updatePassword };
};