import { supabase } from '../../../shared/lib/supabase';

export interface Empresa {
  id: string;
  nombre: string;
  logo_url?: string | null;
  configuracion?: any;
  status: 'active' | 'inactive';
  created_at: string;
}

export const empresasService = {
  async getAll(): Promise<Empresa[]> {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(empresa: Partial<Empresa>): Promise<Empresa> {
    const { data, error } = await supabase
      .from('empresas')
      .insert({
        nombre: empresa.nombre!,
        logo_url: empresa.logo_url || null,
        status: empresa.status || 'active',
        configuracion: empresa.configuracion || {},
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, empresa: Partial<Empresa>): Promise<Empresa> {
    const { data, error } = await supabase
      .from('empresas')
      .update({
        nombre: empresa.nombre,
        logo_url: empresa.logo_url,
        status: empresa.status,
        configuracion: empresa.configuracion,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
