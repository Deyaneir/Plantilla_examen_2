import { useEffect } from "react";
import { router } from "expo-router";
import { useSession } from "@/features/session/model/useSession";

export default function AuthCallback() {
  const { isAuthenticated } = useSession();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated]);

  return null;
}