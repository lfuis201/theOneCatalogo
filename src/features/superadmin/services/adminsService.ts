import { supabase } from '../../../shared/lib/supabase';
import type { AdminUser } from '../types';

export const adminsService = {
  async getAll(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('rol', 'admin')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(admin: Partial<AdminUser> & { password?: string }): Promise<AdminUser> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: admin.email!,
      password: admin.password || 'Password123!',
      options: {
        data: {
          full_name: admin.nombre,
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
        nombre: admin.nombre!,
        email: admin.email!,
        telefono: admin.telefono || null,
        empresa: admin.empresa || null,
        rol: 'admin',
        status: admin.status || 'active',
        limite_licencias: admin.limite_licencias ?? 10,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, admin: Partial<AdminUser>): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        nombre: admin.nombre,
        email: admin.email,
        telefono: admin.telefono || null,
        empresa: admin.empresa || null,
        status: admin.status,
        limite_licencias: admin.limite_licencias,
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
