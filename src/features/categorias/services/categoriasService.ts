import { supabase } from '../../../shared/lib/supabase';
import type { Categoria } from '../types';

export const categoriasService = {
  async getAll(empresaId?: string | null, isSuperAdmin?: boolean): Promise<Categoria[]> {
    let query = supabase
      .from('categorias')
      .select('*')
      .order('nombre', { ascending: true });

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

  async create(categoria: Partial<Categoria>, empresaId?: string | null): Promise<Categoria> {
    const payload: any = { nombre: categoria.nombre };
    if (empresaId !== undefined) {
      payload.empresa_id = empresaId;
    }

    const { data, error } = await supabase
      .from('categorias')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, categoria: Partial<Categoria>): Promise<Categoria> {
    const { data, error } = await supabase
      .from('categorias')
      .update({ nombre: categoria.nombre })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
