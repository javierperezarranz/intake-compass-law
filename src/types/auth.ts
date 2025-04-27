
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'lawyer';

export interface UserDetails {
  id: string;
  email: string;
  role: UserRole;
  firmName?: string;
  firmSlug?: string;
}

export interface AuthContextType {
  user: UserDetails | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firmName: string, firmSlug: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
}
