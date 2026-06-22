import type { Session, User } from '@supabase/supabase-js';
import type { Usuario } from '../../../shared/types/database';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Usuario | null;
  loading: boolean;
  signOut: () => Promise<void>;
}
