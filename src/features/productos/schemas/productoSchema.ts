import * as z from "zod";

export const productoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  marca: z.string().min(2, "La marca debe tener al menos 2 caracteres"),
  categoria: z.enum(["Dama", "Caballero", "Unisex", "Todos"]),
  categoriaId: z.string().optional().nullable(),
  familiaOlfativa: z.string().min(2, "La familia olfativa es requerida"),
  volumen: z.string().min(1, "El volumen es requerido"),
  anio: z.string().optional(),
  codigo: z.string().optional(),
  precioTienda: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number({ invalid_type_error: "El precio debe ser un número" }).min(0, "El precio no puede ser negativo")
  ),
  imagen: z.string().optional(),
  notas: z.string().optional(),
});

export type ProductoFormValues = z.infer<typeof productoSchema>;

