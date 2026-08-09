import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../../shared/lib/supabase';
import type { AdminUser } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const getTempSupabase = () => createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

export const adminsService = {
  async getAll(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*, suscripciones(plan, status)')
      .eq('rol', 'admin')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Consultar el conteo de licencias/suscripciones creadas por empresa
    const { data: subsData } = await supabase
      .from('suscripciones')
      .select('empresa_id');

    const countsMap: Record<string, number> = {};
    (subsData || []).forEach((item: any) => {
      if (item.empresa_id) {
        countsMap[item.empresa_id] = (countsMap[item.empresa_id] || 0) + 1;
      }
    });

    return (data || []).map((row: any) => {
      const activeSub = row.suscripciones?.find((s: any) => s.status === 'Active');
      return {
        ...row,
        plan_activo: activeSub ? activeSub.plan : 'Sin Plan',
        licencias_creadas: row.empresa_id ? (countsMap[row.empresa_id] || 0) : 0,
      };
    });
  },

  async create(admin: Partial<AdminUser> & { password?: string; plan_suscripcion?: 'silver' | 'gold' | 'ninguno' }): Promise<AdminUser> {
    const tempSupabase = getTempSupabase();
    const { data: authData, error: authError } = await tempSupabase.auth.signUp({
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
        empresa_id: admin.empresa_id || null,
      })
      .select()
      .single();

    if (error) throw error;

    if (admin.plan_suscripcion) {
      await this.syncSubscription(userId, admin.plan_suscripcion);
    }

    return data;
  },

  async update(id: string, admin: Partial<AdminUser> & { plan_suscripcion?: 'silver' | 'gold' | 'ninguno' }): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('usuarios')
      .update({
        nombre: admin.nombre,
        email: admin.email,
        telefono: admin.telefono || null,
        empresa: admin.empresa || null,
        status: admin.status,
        empresa_id: admin.empresa_id || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (admin.plan_suscripcion) {
      await this.syncSubscription(id, admin.plan_suscripcion);
    }

    return data;
  },

  async syncSubscription(usuarioId: string, planSuscripcion?: 'silver' | 'gold' | 'ninguno'): Promise<void> {
    if (!planSuscripcion) return;

    if (planSuscripcion === 'ninguno') {
      await supabase
        .from('suscripciones')
        .delete()
        .eq('usuario_id', usuarioId);
      return;
    }

    const planCode = planSuscripcion === 'gold' ? 'VIP Gold Perfumer' : 'Silver Collector';
    const price = planSuscripcion === 'gold' ? 49.00 : 29.00;

    const { data: existing } = await supabase
      .from('suscripciones')
      .select('id')
      .eq('usuario_id', usuarioId)
      .limit(1);

    const today = new Date().toISOString().split("T")[0];
    const nextRenewal = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    if (existing && existing.length > 0) {
      await supabase
        .from('suscripciones')
        .update({
          plan: planCode,
          price,
          status: 'Active',
          next_renewal: nextRenewal
        })
        .eq('id', existing[0].id);
    } else {
      await supabase
        .from('suscripciones')
        .insert({
          usuario_id: usuarioId,
          plan: planCode,
          price,
          status: 'Active',
          start_date: today,
          next_renewal: nextRenewal
        });
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
