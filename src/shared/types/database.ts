export type RolUsuario = 'superadmin' | 'admin' | 'cliente' | 'staff';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  empresa_id?: string | null;
  rol: RolUsuario;
  status: 'active' | 'inactive';
  limite_licencias?: number;
  licencias_creadas?: number;
  plan_activo?: string;
  created_at: string;
  updated_at: string;
}

