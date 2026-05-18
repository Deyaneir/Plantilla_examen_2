import { useState, useEffect } from "react";
import { theme } from "@/core/styles/theme";
import { supabase } from "@/shared/api/supabase";
import * as Linking from "expo-linking";
import { Button } from "@/shared/ui/Button";
import { router } from "expo-router";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";

const parseConfirmationToken = (url: string): { accessToken: string | null; refreshToken: string | null; type: string | null } => {
  if (!url) return { accessToken: null, refreshToken: null, type: null };

  try {
    if (url.includes("#")) {
      const hash = url.split("#")[1];
      const params = new URLSearchParams(hash);
      return {
        accessToken: params.get("access_token"),
        refreshToken: params.get("refresh_token"),
        type: params.get("type"),
      };
    }

    if (url.includes("?")) {
      const search = url.split("?")[1];
      const params = new URLSearchParams(search);
      return {
        accessToken: params.get("access_token"),
        refreshToken: params.get("refresh_token"),
        type: params.get("type"),
      };
    }

    return { accessToken: null, refreshToken: null, type: null };
  } catch {
    return { accessToken: null, refreshToken: null, type: null };
  }
};

export const ConfirmEmailPage = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verificando tu correo...");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const url = await Linking.getInitialURL();
        console.log("📧 Confirm email URL:", url);

        if (!url) {
          setStatus("error");
          setMessage("URL no proporcionada.");
          return;
        }

        const { accessToken, refreshToken, type } = parseConfirmationToken(url);
        console.log("📧 Access Token:", accessToken ? "SÍ" : "NO", "Type:", type);

        if (accessToken && refreshToken && type === "signup") {
          console.log("🔄 Estableciendo sesión...");
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.log("❌ Error setSession:", error.message);
            setStatus("error");
            setMessage("El enlace de confirmación ha expirado.");
          } else {
            console.log("✅ Email confirmado y sesión establecida!");
            setStatus("success");
            setMessage("¡Tu correo ha sido confirmado exitosamente!");
          }
        } else {
          console.log("❌ No access_token/refresh_token found", { accessToken, refreshToken, type });
          setStatus("error");
          setMessage("Token no encontrado en el enlace.");
        }
      } catch (err: any) {
        console.log("❌ Error:", err.message);
        setStatus("error");
        setMessage("Error al confirmar el correo.");
      }
    };

    const timer = setTimeout(confirmEmail, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {status === "loading" && (
        <>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.message}>{message}</Text>
        </>
      )}
      
      {status === "success" && (
        <>
          <Text style={styles.icon}>✅</Text>
          <Text style={styles.title}>¡Confirmado!</Text>
          <Text style={styles.message}>{message}</Text>
          <Button 
            onPress={() => router.replace("/(auth)/login")} 
            label="Ir al Login"
          />
        </>
      )}
      
      {status === "error" && (
        <>
          <Text style={styles.icon}>❌</Text>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.message}>{message}</Text>
          <Button 
            onPress={() => router.replace("/(auth)/register")} 
            label="Registrarse"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  icon: { fontSize: 72, marginBottom: 24 },
  title: { fontSize: 26, fontWeight: "700", color: theme.colors.primary, marginBottom: 16 },
  message: { fontSize: 16, color: theme.colors.textMid, textAlign: "center", marginBottom: 32 },
});