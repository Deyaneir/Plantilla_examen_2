import { Redirect } from "expo-router";
import { useSession } from "@/features/session/model/useSession";
import { ForgotPasswordPage } from "@/pages/forgot-password/ui/ForgotPasswordPage";

export default function ForgotPasswordScreen() {
  const { isAuthenticated } = useSession();

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return <ForgotPasswordPage />;
}