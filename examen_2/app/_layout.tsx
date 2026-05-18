import { useEffect } from "react";
import { Stack, usePathname } from "expo-router";
import { router } from "expo-router";
import { QueryProvider } from "@/core/providers/QueryProvider";
import { useSession } from "@/features/session/model/useSession";

const PUBLIC_ROUTES = [
  "reset-password",
  "forgot-password",
  "confirm-email",
  "register",
  "login",
  "home",
  "index",
];

function AuthGuard() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useSession();

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.includes(route));
  const isHomeRoute = pathname === "/home" || pathname === "/";

  useEffect(() => {
    if (isLoading) return;

    // Si ya está en home y está autenticado, no hacer nada
    if (isHomeRoute && isAuthenticated) {
      return;
    }

    // Si es ruta pública, no hacer nada
    if (isPublicRoute) {
      return;
    }

    // Redirigir según estado de autenticación
    if (isAuthenticated) {
      router.replace("/home");
    } else {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, isLoading, pathname, isPublicRoute, isHomeRoute]);

  return null;
}

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="home" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="confirm-email" />
        <Stack.Screen name="index" />
      </Stack>
      <AuthGuard />
    </QueryProvider>
  );
}