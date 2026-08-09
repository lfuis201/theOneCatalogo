import { supabase } from '../../../shared/lib/supabase';
import type { Subscription } from '../types';

export const suscripcionesService = {
  async getAll(empresaId?: string | null, isSuperAdmin?: boolean): Promise<Subscription[]> {
    let query = supabase
      .from('suscripciones')
      .select('*, usuarios:usuario_id(nombre, email)')
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

    return (data || []).map((row: any) => ({
      id: row.id,
      clienteNombre: row.usuarios?.nombre || 'Desconocido',
      clienteEmail: row.usuarios?.email || 'N/A',
      plan: row.plan,
      status: row.status,
      price: Number(row.price),
      startDate: row.start_date,
      nextRenewal: row.next_renewal,
      paymentStatus: 'Paid',
    }));
  },

  async getByUserId(usuarioId: string): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('suscripciones')
      .select('*, usuarios:usuario_id(nombre, email)')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) return null;

    const row = data[0];
    return {
      id: row.id,
      clienteNombre: row.usuarios?.nombre || 'Desconocido',
      clienteEmail: row.usuarios?.email || 'N/A',
      plan: row.plan,
      status: row.status,
      price: Number(row.price),
      startDate: row.start_date,
      nextRenewal: row.next_renewal,
      paymentStatus: 'Paid',
    };
  },

  async create(suscripcion: {
    usuarioId: string;
    plan: string;
    status: string;
    price: number;
    startDate: string;
    nextRenewal: string;
  }, empresaId?: string | null): Promise<void> {
    // Si la acción proviene de un Admin de Empresa (tenant), se valida el límite de licencias permitidas
    if (empresaId) {
      // 1. Obtener la configuración del plan asignado al Admin/Empresa
      const { data: subAdmin } = await supabase
        .from('suscripciones')
        .select('plan')
        .eq('empresa_id', empresaId)
        .eq('status', 'Active')
        .maybeSingle();

      const planCode = subAdmin?.plan || 'Silver Collector';

      // 2. Obtener el límite de suscripciones permitido desde planes_config
      const { data: planConfig } = await supabase
        .from('planes_config')
        .select('limite_suscripciones')
        .eq('plan', planCode)
        .maybeSingle();

      const maxPermitido = planConfig?.limite_suscripciones ?? 50;

      // 3. Contar la cantidad actual de suscripciones registradas por esta empresa
      const { count, error: countError } = await supabase
        .from('suscripciones')
        .select('id', { count: 'exact', head: true })
        .eq('empresa_id', empresaId);

      if (countError) throw countError;

      if ((count || 0) >= maxPermitido) {
        throw new Error(
          `Has alcanzado el límite máximo de ${maxPermitido} licencias/suscripciones permitidas para tu plan (${planCode}). Actualiza tu plan para registrar más.`
        );
      }
    }

    const { error } = await supabase
      .from('suscripciones')
      .insert({
        usuario_id: suscripcion.usuarioId,
        plan: suscripcion.plan,
        status: suscripcion.status,
        price: suscripcion.price,
        start_date: suscripcion.startDate,
        next_renewal: suscripcion.nextRenewal,
        empresa_id: empresaId ?? null,
      });

    if (error) throw error;
  },

  async update(id: string, updates: Partial<{
    plan: string;
    status: string;
    price: number;
    startDate: string;
    nextRenewal: string;
  }>): Promise<void> {
    const { error } = await supabase
      .from('suscripciones')
      .update({
        plan: updates.plan,
        status: updates.status,
        price: updates.price,
        start_date: updates.startDate,
        next_renewal: updates.nextRenewal,
      })
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('suscripciones')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getPayments(suscripcionId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('pagos')
      .select('*')
      .eq('suscripcion_id', suscripcionId)
      .order('fecha_pago', { ascending: false });

    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: row.id,
      suscripcionId: row.suscripcion_id,
      monto: Number(row.monto),
      fechaPago: row.fecha_pago,
      metodo: row.metodo,
      status: row.status,
      comprobanteUrl: row.comprobante_url || undefined,
      referencia: row.referencia || undefined,
      createdAt: row.created_at,
    }));
  },

  async createPayment(pago: {
    suscripcionId: string;
    monto: number;
    metodo: string;
    status: string;
    referencia?: string;
    comprobanteUrl?: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('pagos')
      .insert({
        suscripcion_id: pago.suscripcionId,
        monto: pago.monto,
        metodo: pago.metodo,
        status: pago.status,
        referencia: pago.referencia || null,
        comprobante_url: pago.comprobanteUrl || null,
      });

    if (error) throw error;
  },

  async deletePayment(id: string): Promise<void> {
    const { error } = await supabase
      .from('pagos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
