export type RolUsuario = 'admin' | 'cliente' | 'staff';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  empresa?: string;
  rol: RolUsuario;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

