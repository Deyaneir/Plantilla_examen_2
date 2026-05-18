import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { useSession } from "@/features/session/model/useSession";
import { Button }     from "@/shared/ui/Button";
import { theme }      from "@/core/styles/theme";

export const HomePage = () => {
  const { user, signOut } = useSession();

  const handleSignOut = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas salir?", [
      { text:"Cancelar", style:"cancel" },
      { text:"Salir", style:"destructive", onPress: async () => {
        await signOut();
        router.replace("/(auth)/login");
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🎓</Text>
          <Text style={styles.headerTitle}>ESFOT</Text>
          <Text style={styles.headerSub}>Tecnología Superior en Desarrollo de Software</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.welcomeIcon}>🚀</Text>
          <Text style={styles.welcomeTitle}>¡Bienvenido, lo lograste,{" "}tecnólogo de la ESFOT!</Text>
          <View style={styles.divider} />
          <Text style={styles.challengeText}>¿No fue tan difícil... o sí? 😄</Text>
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>
        <View style={styles.achievementsCard}>
          <Text style={styles.achievementsTitle}>Lo que implementaste:</Text>
          {[
            "✅ Autenticación con Supabase Auth",
            "✅ Tokens persistidos con SecureStore",
            "✅ Estado de sesión con TanStack Query",
            "✅ Arquitectura Feature-Sliced Design",
            "✅ Expo Router con TypeScript",
            "✅ App web en Vercel para auth flows",
          ].map(item => <Text key={item} style={styles.achievement}>{item}</Text>)}
        </View>
        <Button onPress={handleSignOut} label="Cerrar sesión" variant="ghost" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe:              { flex:1, backgroundColor: theme.colors.bg },
  container:         { flex:1, padding:24, gap:20 },
  header:            { backgroundColor: theme.colors.primary, borderRadius:16,
                       padding:24, alignItems:"center", ...theme.shadow.card },
  headerIcon:        { fontSize:48, marginBottom:8 },
  headerTitle:       { color:"#fff", fontSize:28, fontWeight:"800" },
  headerSub:         { color:"rgba(255,255,255,0.75)", fontSize:12, textAlign:"center", marginTop:4 },
  card:              { backgroundColor: theme.colors.card, borderRadius:16,
                       padding:28, alignItems:"center", ...theme.shadow.card },
  welcomeIcon:       { fontSize:56, marginBottom:16 },
  welcomeTitle:      { fontSize:22, fontWeight:"800", color: theme.colors.primary,
                       textAlign:"center", lineHeight:30, marginBottom:16 },
  divider:           { width:"100%", height:1, backgroundColor: theme.colors.border, marginVertical:12 },
  challengeText:     { fontSize:18, color: theme.colors.textMid, fontWeight:"600", marginBottom:8 },
  emailText:         { fontSize:13, color: theme.colors.textMuted },
  achievementsCard:  { backgroundColor: theme.colors.card, borderRadius:16,
                       padding:20, gap:8, ...theme.shadow.card },
  achievementsTitle: { fontSize:15, fontWeight:"700", color: theme.colors.primary, marginBottom:8 },
  achievement:       { fontSize:14, color: theme.colors.textMid },
});