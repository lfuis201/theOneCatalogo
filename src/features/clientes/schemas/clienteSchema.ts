import * as z from "zod";

export const getClienteSchema = (isEdit: boolean) => {
  return z.object({
    nombre: z.string().min(3, "El nombre es muy corto"),
    email: z.string().email("Email inválido"),
    telefono: z.string().min(7, "Teléfono inválido"),
    empresa: z.string().optional().nullable(),
    password: isEdit
      ? z.string().optional()
      : z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  });
};

export type ClienteFormValues = z.infer<ReturnType<typeof getClienteSchema>>;
