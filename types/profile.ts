export type UserRole = 'buyer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  role: UserRole;
  country?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at?: string;
}
