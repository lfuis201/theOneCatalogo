import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import type { Usuario } from '../../../shared/types/database';
import { supabase } from '../../../shared/lib/supabase';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Usuario | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Usuario | null) => void;
  setLoading: (loading: boolean) => void;
  fetchProfile: (userId: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();
      if (error) throw error;
      set({ profile: data });
    } catch (err) {
      console.error("Error al obtener perfil en store:", err);
      set({ profile: null });
    }
  },
  signIn: async (email, password) => {
    await authService.signIn(email, password);
  },
  signOut: async () => {
    try {
      await authService.signOut();
    } catch (err) {
      console.error("Error al cerrar sesión remotamente, limpiando estado local:", err);
    }
    set({ user: null, session: null, profile: null });
  },
  initialize: () => {
    let active = true;

    // Fetch initial session
    authService.getSession().then(async (initialSession) => {
      if (!active) return;
      set({ session: initialSession, user: initialSession?.user ?? null });
      if (initialSession?.user) {
        await get().fetchProfile(initialSession.user.id);
      }
      set({ loading: false });
    }).catch((err) => {
      console.error("Error al inicializar sesión en store:", err);
      if (active) set({ loading: false });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!active) return;
      set({ session: currentSession, user: currentSession?.user ?? null });
      if (currentSession?.user) {
        set({ loading: true });
        await get().fetchProfile(currentSession.user.id);
      } else {
        set({ profile: null });
      }
      set({ loading: false });
    });

    // Safety fallback: if loading is still true after 3 seconds, force it to false
    const fallbackTimer = setTimeout(() => {
      if (active && get().loading) {
        console.warn("Safety fallback: Loading took too long, forcing loading to false.");
        set({ loading: false });
      }
    }, 3000);

    return () => {
      active = false;
      subscription.unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }
}));
