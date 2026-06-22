import { supabase } from '../../../shared/lib/supabase';
import type { Cliente } from '../types';

export const clientesService = {
  async getAll(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('rol', 'cliente')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(cliente: Partial<Cliente> & { password?: string }): Promise<Cliente> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
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
      .update({
        telefono: cliente.telefono || null,
        empresa: cliente.empresa || null,
        status: cliente.status || 'active',
      })
      .eq('id', userId)
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
