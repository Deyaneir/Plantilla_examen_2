import { theme } from "@/core/styles/theme";
import { useForgotPassword } from "@/features/auth/model/useForgotPassword";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const forgotPassword = useForgotPassword();

  const handleSend = async () => {
    if (!email) { 
      Alert.alert("Campo requerido", "Ingresa tu correo electrónico."); 
      return; 
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Email inválido", "Ingresa un correo electrónico válido.");
      return;
    }

    setIsChecking(true);
    
    try {
      await forgotPassword.mutateAsync(email);
      setResetPasswordSuccess(true);
    } catch (err: any) {
      console.log("Error sending reset email:", err.message);
      
      if (err.message?.includes("User not found") || err.message?.includes("No user")) {
        Alert.alert("Usuario no encontrado", "Este correo no está registrado en el sistema.");
      } else if (err.message?.includes("Email not confirmed")) {
        Alert.alert("Email no confirmado", "Primero debes confirmar tu correo. Revisa tu bandeja de entrada.");
      } else {
        Alert.alert("Error", err.message || "No se pudo enviar el correo de recuperación.");
      }
    } finally {
      setIsChecking(false);
    }
  };

  if (resetPasswordSuccess) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.icon}>📧</Text>
        <Text style={styles.successTitle}>¡Email enviado!</Text>
        <Text style={styles.successText}>
          Hemos enviado un enlace para restablecer tu contraseña a{" "}
          <Text style={{ fontWeight:"700" }}>{email}</Text>.
        </Text>
        <Text style={styles.noteText}>
          Revisa tu bandeja de entrada (y spam).
        </Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.link}>← Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <View style={styles.inner}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.logo}>🔑</Text>
            <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
            <Text style={styles.subtitle}>Ingresa tu correo y te enviaremos un enlace para restablecerla</Text>
          </View>
          <View style={styles.form}>
            <Input 
              label="Correo electrónico" 
              value={email} 
              onChangeText={setEmail}
              keyboardType="email-address" 
              autoCapitalize="none"
              placeholder="tu@correo.com" 
            />
            <Button 
              onPress={handleSend} 
              isLoading={forgotPassword.isPending || isChecking} 
              label="Enviar enlace de recuperación" 
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container:        { flex:1, backgroundColor: theme.colors.bg },
  inner:            { flex:1, justifyContent:"center", padding:24 },
  backBtn:          { marginBottom:16 },
  backText:         { color: theme.colors.accent, fontSize:16 },
  card:             { backgroundColor: theme.colors.card, borderRadius:20,
                      overflow:"hidden", ...theme.shadow.card },
  header:           { backgroundColor: theme.colors.primary, padding:32, alignItems:"center" },
  logo:             { fontSize:52, marginBottom:12 },
  title:            { color:"#fff", fontSize:22, fontWeight:"700", textAlign:"center", marginBottom:8 },
  subtitle:         { color:"rgba(255,255,255,0.75)", fontSize:13, textAlign:"center" },
  form:             { padding:28, gap:16 },
  successContainer: { flex:1, backgroundColor: theme.colors.bg,
                      justifyContent:"center", alignItems:"center", padding:32 },
  icon:             { fontSize:72, marginBottom:24 },
  successTitle:     { fontSize:26, fontWeight:"700", color: theme.colors.primary, marginBottom:16 },
  successText:      { fontSize:16, color: theme.colors.textMid,
                      textAlign:"center", lineHeight:24, marginBottom:12 },
  noteText:         { fontSize:14, color: theme.colors.textMuted, marginBottom:24 },
  link:             { color: theme.colors.accent, fontSize:15, fontWeight:"600" },
});