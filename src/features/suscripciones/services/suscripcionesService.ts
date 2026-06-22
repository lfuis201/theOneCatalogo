import { supabase } from '../../../shared/lib/supabase';
import type { Subscription } from '../types';

export const suscripcionesService = {
  async getAll(): Promise<Subscription[]> {
    const { data, error } = await supabase
      .from('suscripciones')
      .select('*, usuarios:usuario_id(nombre, email)')
      .order('created_at', { ascending: false });

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

  async create(suscripcion: {
    usuarioId: string;
    plan: string;
    status: string;
    price: number;
    startDate: string;
    nextRenewal: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('suscripciones')
      .insert({
        usuario_id: suscripcion.usuarioId,
        plan: suscripcion.plan,
        status: suscripcion.status,
        price: suscripcion.price,
        start_date: suscripcion.startDate,
        next_renewal: suscripcion.nextRenewal,
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
