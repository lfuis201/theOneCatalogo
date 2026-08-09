import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../../shared/lib/supabase';
import type { Cliente } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const getTempSupabase = () => createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

export const clientesService = {
  async getAll(empresaId?: string | null, isSuperAdmin?: boolean): Promise<Cliente[]> {
    let query = supabase
      .from('usuarios')
      .select('*')
      .neq('rol', 'admin')
      .order('created_at', { ascending: false });

    if (!isSuperAdmin) {
      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      } else {
        query = query.is('empresa_id', null);
      }
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async create(cliente: Partial<Cliente> & { password?: string }, empresaId?: string | null): Promise<Cliente> {
    const tempSupabase = getTempSupabase();
    const { data: authData, error: authError } = await tempSupabase.auth.signUp({
      email: cliente.email!,
      password: cliente.password || 'Password123!',
      options: {
        data: {
          full_name: cliente.nombre,
        }
      }
    });

    if (authError) throw authError;

    const userId = authData.user?.id;
    if (!userId) throw new Error("No se pudo crear el usuario");

    const { data, error } = await supabase
      .from('usuarios')
      .upsert({
        id: userId,
        nombre: cliente.nombre!,
        email: cliente.email!,
        telefono: cliente.telefono || null,
        empresa: cliente.empresa || null,
        empresa_id: empresaId ?? null,
        rol: 'cliente',
        status: cliente.status || 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono || null,
        empresa: cliente.empresa || null,
        status: cliente.status,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
