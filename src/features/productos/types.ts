export type Producto = {
  id: string;
  nombre: string;
  marca: string; // Brand
  categoria: 'Dama' | 'Caballero' | 'Unisex' | 'Todos'; // Category
  categoriaId?: string; // Link to categories table
  anio?: string; // Year
  codigo?: string; // Code (e.g. #6679)
  imagen?: string; // Image URL
  familiaOlfativa: string;
  notas: string;
  volumen: string;
  precioTienda: number;
  created_at: string;
};

