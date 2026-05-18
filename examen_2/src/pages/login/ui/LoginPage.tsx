import { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Alert, TouchableOpacity, ScrollView
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useLogin } from "@/features/auth/model/useLogin";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { theme } from "@/core/styles/theme";
import { useGoogleLogin } from "@/features/auth/model/useGoogleLogin";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordChanged, setShowPasswordChanged] = useState(false);
  const login = useLogin();
  const { loginWithGoogle, loading: googleLoading, error: googleError } = useGoogleLogin();
  const params = useLocalSearchParams<{ passwordChanged?: string }>();

  useEffect(() => {
    if (params.passwordChanged === "true") {
      setShowPasswordChanged(true);
      setTimeout(() => setShowPasswordChanged(false), 5000);
    }
  }, [params.passwordChanged]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos requeridos", "Completa email y contraseña.");
      return;
    }
    try {
      await login.mutateAsync({ email, password });
      // Pequeña espera para que se guarde la sesión
      setTimeout(() => {
        router.replace("/home");
      }, 100);
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Credenciales incorrectas.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {showPasswordChanged && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>🔒 Tu contraseña ha sido cambiada exitosamente</Text>
          </View>
        )}
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.logo}>🔐</Text>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>ESFOT — Inicia sesión</Text>
          </View>
          <View style={styles.form}>
            <Input label="Correo electrónico" value={email} onChangeText={setEmail}
              keyboardType="email-address" placeholder="tu@correo.com" />
            <Input label="Contraseña" value={password} onChangeText={setPassword}
              secureTextEntry placeholder="Tu contraseña" />
            <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")}
              style={{ alignSelf:"flex-end" }}>
              <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            <Button onPress={handleLogin} isLoading={login.isPending} label="Iniciar sesión" />
            <Button onPress={loginWithGoogle} isLoading={googleLoading} label="Continuar con Google" />
            {googleError && <Text style={{ color: "red", textAlign: "center" }}>{googleError}</Text>}
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}
              style={{ alignItems:"center" }}>
              <Text style={styles.linkMuted}>
                ¿No tienes cuenta?{" "}
                <Text style={{ color: theme.colors.primary, fontWeight:"700" }}>Regístrate</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: theme.colors.bg },
  scroll:    { flexGrow:1, justifyContent:"center", padding:24 },
  card:      { backgroundColor: theme.colors.card, borderRadius:20,
               overflow:"hidden", ...theme.shadow.card },
  header:    { backgroundColor: theme.colors.primary, padding:32, alignItems:"center" },
  logo:      { fontSize:52, marginBottom:12 },
  title:     { color:"#fff", fontSize:26, fontWeight:"700", marginBottom:4 },
  subtitle:  { color:"rgba(255,255,255,0.75)", fontSize:14 },
  form:      { padding:28, gap:16 },
  link:      { color: theme.colors.accent, fontSize:14 },
  linkMuted: { color: theme.colors.textMuted, fontSize:14 },
  successBanner: { backgroundColor: theme.colors.success, padding: 16, borderRadius: 12, marginBottom: 16 },
  successText: { color: "#fff", fontSize: 14, textAlign: "center", fontWeight: "600" },
});