import { createClient } from "@supabase/supabase-js";

// Support both Vite `VITE_` prefixed envs and Expo `EXPO_PUBLIC_` envs
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || (import.meta.env.EXPO_PUBLIC_SUPABASE_URL as string) || "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || (import.meta.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string) || "";

if (!supabaseUrl || !supabaseAnonKey) {
  const present = Object.keys(import.meta.env).filter((k) => k.includes("SUPABASE") || k.includes("VITE_SUPABASE") || k.includes("EXPO_PUBLIC_SUPABASE"));
  throw new Error(
    `Faltan variables de entorno para Supabase. Revisa .env. Variables detectadas: ${present.join(", ")}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);