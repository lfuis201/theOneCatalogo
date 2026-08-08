import * as z from "zod";

export const getAdminSchema = (isEdit: boolean) => {
  return z.object({
    nombre: z.string().min(3, "El nombre es muy corto"),
    email: z.string().email("Email inválido"),
    telefono: z.string().min(7, "Teléfono inválido").optional().nullable(),
    empresa: z.string().min(2, "El nombre de la empresa es obligatorio"),
    status: z.enum(["active", "inactive"]).optional(),
    limite_licencias: z.coerce.number().int().nonnegative("El límite debe ser un número positivo").default(10),
    password: isEdit
      ? z.string().optional()
      : z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  });
};

export type AdminFormValues = z.infer<ReturnType<typeof getAdminSchema>>;
