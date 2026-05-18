import type { User } from "@supabase/supabase-js";

export type { User };

export interface UserProfile {
  id:         string;
  email:      string;
  fullName?:  string;
  avatarUrl?: string;
  createdAt:  string;
}