import { supabase } from '../../../shared/lib/supabase';

export interface PlanConfig {
  plan: string;
  nombre_legible: string;
  precio_sugerido: number;
  limite_suscripciones: number;
  created_at?: string;
  updated_at?: string;
}

export const planesConfigService = {
  async getAll(): Promise<PlanConfig[]> {
    const { data, error } = await supabase
      .from('planes_config')
      .select('*')
      .order('precio_sugerido', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async update(plan: string, updates: Partial<PlanConfig>): Promise<PlanConfig> {
    const { data, error } = await supabase
      .from('planes_config')
      .update({
        nombre_legible: updates.nombre_legible,
        precio_sugerido: updates.precio_sugerido,
        limite_suscripciones: updates.limite_suscripciones,
        updated_at: new Date().toISOString()
      })
      .eq('plan', plan)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
