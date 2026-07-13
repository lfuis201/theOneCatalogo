import { supabase } from '../../../shared/lib/supabase';

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signUp(email: string, password: string, nombre: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nombre,
        }
      }
    });
    if (error) throw error;

    // Explicit fallback: insert/upsert user into public.usuarios table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('usuarios')
        .upsert({
          id: data.user.id,
          nombre: nombre,
          email: email,
          rol: 'cliente',
          status: 'active'
        });
      if (profileError) {
        console.error("Error al crear perfil de usuario en base de datos:", profileError);
      }
    }

    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }
};
