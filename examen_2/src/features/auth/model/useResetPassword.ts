import { useState, useEffect } from "react";
import { supabase } from "@/shared/api/supabase";
import * as Linking from "expo-linking";

type ResetStatus = "idle" | "loading" | "success" | "error";

const parseTokenFromUrl = (url: string): { token: string | null; type: string | null } => {
  if (!url) return { token: null, type: null };

  try {
    let params: URLSearchParams;
    
    const hashIndex = url.indexOf("#");
    const searchIndex = url.indexOf("?");

    if (hashIndex > -1) {
      params = new URLSearchParams(url.substring(hashIndex + 1));
    } else if (searchIndex > -1) {
      params = new URLSearchParams(url.substring(searchIndex + 1));
    } else {
      return { token: null, type: null };
    }

    return {
      token: params.get("access_token"),
      type: params.get("type"),
    };
  } catch (e) {
    console.log("Error parsing URL:", e);
    return { token: null, type: null };
  }
};

export const useResetPassword = () => {
  const [status, setStatus] = useState<ResetStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const init = async () => {
      console.log("🔄 Inicializando reset password...");

      try {
        const url = await Linking.getInitialURL();
        console.log("📍 URL:", url);

        if (!url) {
          console.log("ℹ️ No hay URL - página de solicitud");
          setIsReady(true);
          return;
        }

        const { token, type } = parseTokenFromUrl(url);
        console.log("🔑 Token:", token ? "SÍ" : "NO", "Tipo:", type);

        if (token && (type === "recovery" || type === "reset_password")) {
          console.log("🔄 Intercambiando token...");

          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(token);

          if (exchangeError) {
            console.log("❌ Error intercambio:", exchangeError.message);
            setError("El enlace ha expirado. Solicita uno nuevo.");
            setStatus("error");
          } else if (data?.session) {
            console.log("✅ Sesión establecida");
            setHasToken(true);
          }
        } else if (!token) {
          console.log("ℹ️ No hay token - página de solicitud");
        }
      } catch (err: any) {
        console.log("❌ Error:", err.message);
        setError(err.message);
      } finally {
        setIsReady(true);
      }
    };

    const timer = setTimeout(init, 300);
    return () => clearTimeout(timer);
  }, []);

  const updatePassword = async (password: string) => {
    console.log("🔐 Actualizando contraseña...");
    setStatus("loading");
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        console.log("❌ Error directo:", updateError.message);

        const url = await Linking.getInitialURL();
        if (url) {
          const { token } = parseTokenFromUrl(url);

          if (token) {
            console.log("🔄 Intentando con token...");
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(token);

            if (exchangeError || !data?.session) {
              setError("El enlace ha expirado. Solicita uno nuevo.");
              setStatus("error");
              return;
            }

            const { error: retryError } = await supabase.auth.updateUser({ password });

            if (retryError) {
              setError(retryError.message);
              setStatus("error");
              return;
            }
          }
        } else {
          setError(updateError.message);
          setStatus("error");
          return;
        }
      }

      console.log("✅ Contraseña actualizada!");
      setStatus("success");
    } catch (err: any) {
      console.log("❌ Error catch:", err.message);
      setError(err.message || "Error al actualizar.");
      setStatus("error");
    }
  };

  return { status, error, updatePassword, isReady, hasToken };
};