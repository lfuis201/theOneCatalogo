import { supabase } from '../../../shared/lib/supabase';

export interface GlobalProduct {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  precioTienda: number;
  adminNombre?: string;
  adminEmail?: string;
  adminEmpresa?: string;
  created_at: string;
}

export interface GlobalSubscription {
  id: string;
  plan: string;
  status: 'Active' | 'Paused' | 'Cancelled';
  price: number;
  startDate: string;
  nextRenewal: string;
  clienteNombre: string;
  clienteEmail: string;
  adminNombre?: string;
  adminEmail?: string;
  adminEmpresa?: string;
  created_at: string;
}

export interface SuperadminStats {
  totalAdmins: number;
  totalEmpresas: number;
  totalSuscripcionesActivas: number;
  mrrEstimado: number;
  adminsActivos: number;
  adminsInactivos: number;
}

export const superadminService = {
  async getGlobalProducts(): Promise<GlobalProduct[]> {
    const { data, error } = await supabase
      .from('productos')
      .select('*, empresas:empresa_id(nombre)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      nombre: row.name,
      marca: row.brand,
      categoria: row.categoria,
      precioTienda: Number(row.price),
      adminNombre: row.empresas?.nombre || 'Plataforma',
      adminEmail: 'N/A',
      adminEmpresa: row.empresas?.nombre || 'Particular',
      created_at: row.created_at,
    }));
  },

  async getGlobalSubscriptions(): Promise<GlobalSubscription[]> {
    // Fetches all subscriptions.
    const { data, error } = await supabase
      .from('suscripciones')
      .select('*, cliente:usuario_id(nombre, email), empresas:empresa_id(nombre)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      plan: row.plan,
      status: row.status,
      price: Number(row.price),
      startDate: row.start_date,
      nextRenewal: row.next_renewal,
      clienteNombre: row.cliente?.nombre || 'Desconocido',
      clienteEmail: row.cliente?.email || 'N/A',
      adminNombre: row.empresas?.nombre || 'Plataforma',
      adminEmail: 'N/A',
      adminEmpresa: row.empresas?.nombre || 'SaaS Global',
      created_at: row.created_at,
    }));
  },

  async getGlobalStats(): Promise<SuperadminStats> {
    // 1. Count admins
    const { count: totalAdmins, error: errAdmins } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true })
      .eq('rol', 'admin');

    if (errAdmins) throw errAdmins;

    // 2. Active vs Inactive Admins
    const { count: adminsActivos, error: errActivos } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true })
      .eq('rol', 'admin')
      .eq('status', 'active');

    if (errActivos) throw errActivos;

    // 3. Count companies (empresas)
    const { count: totalEmpresas, error: errEmpresas } = await supabase
      .from('empresas')
      .select('*', { count: 'exact', head: true });

    if (errEmpresas) throw errEmpresas;

    // 4. Subscriptions stats
    const { data: subsData, error: errSubs } = await supabase
      .from('suscripciones')
      .select('price, status');

    if (errSubs) throw errSubs;

    const activeSubs = (subsData || []).filter((s: any) => s.status === 'Active');
    const mrrEstimado = activeSubs.reduce((acc: number, curr: any) => acc + Number(curr.price), 0);

    return {
      totalAdmins: totalAdmins || 0,
      adminsActivos: adminsActivos || 0,
      adminsInactivos: (totalAdmins || 0) - (adminsActivos || 0),
      totalEmpresas: totalEmpresas || 0,
      totalSuscripcionesActivas: activeSubs.length,
      mrrEstimado,
    };
  },

  async deleteGlobalProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async deleteGlobalSubscription(id: string): Promise<void> {
    const { error } = await supabase
      .from('suscripciones')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async updateGlobalSubscriptionStatus(id: string, status: 'Active' | 'Paused' | 'Cancelled'): Promise<void> {
    const { error } = await supabase
      .from('suscripciones')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  }
};
