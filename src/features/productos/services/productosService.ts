import { supabase } from '../../../shared/lib/supabase';
import type { Producto } from '../types';

export function mapRowToProducto(row: any): Producto {
  return {
    id: row.id,
    nombre: row.name,
    marca: row.brand,
    categoria: row.categoria,
    categoriaId: row.categoria_id || undefined,
    anio: row.year || undefined,
    codigo: row.code || undefined,
    imagen: row.image || undefined,
    familiaOlfativa: row.family,
    notas: row.notes,
    volumen: row.volume,
    precioTienda: Number(row.price),
    created_at: row.created_at,
  };
}

export function mapProductoToRow(producto: Partial<Producto>): any {
  const row: any = {};
  if (producto.nombre !== undefined) row.name = producto.nombre;
  if (producto.marca !== undefined) row.brand = producto.marca;
  if (producto.categoria !== undefined) row.categoria = producto.categoria;
  if (producto.categoriaId !== undefined) row.categoria_id = producto.categoriaId || null;
  if (producto.anio !== undefined) row.year = producto.anio;
  if (producto.codigo !== undefined) row.code = producto.codigo;
  if (producto.imagen !== undefined) row.image = producto.imagen;
  if (producto.familiaOlfativa !== undefined) row.family = producto.familiaOlfativa;
  if (producto.notas !== undefined) row.notes = producto.notas;
  if (producto.volumen !== undefined) row.volume = producto.volumen;
  if (producto.precioTienda !== undefined) row.price = producto.precioTienda;
  return row;
}

export const productosService = {
  async getAll(empresaId?: string | null, isSuperAdmin?: boolean): Promise<Producto[]> {
    let query = supabase
      .from('productos')
      .select('*')
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
    return (data || []).map(mapRowToProducto);
  },

  async getById(id: string): Promise<Producto> {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapRowToProducto(data);
  },

  async create(producto: Partial<Producto>, empresaId?: string | null): Promise<Producto> {
    const row = mapProductoToRow(producto);
    if (empresaId !== undefined) {
      row.empresa_id = empresaId;
    }

    const { data, error } = await supabase
      .from('productos')
      .insert(row)
      .select()
      .single();

    if (error) throw error;
    return mapRowToProducto(data);
  },

  async update(id: string, producto: Partial<Producto>): Promise<Producto> {
    const row = mapProductoToRow(producto);
    const { data, error } = await supabase
      .from('productos')
      .update(row)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapRowToProducto(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
