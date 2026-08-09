import * as z from "zod";

export const getAdminSchema = (isEdit: boolean) => {
  return z.object({
    nombre: z.string().min(3, "El nombre es muy corto"),
    email: z.string().email("Email inválido"),
    telefono: z.string().optional().nullable().or(z.literal("")),
    empresa: z.string().optional().nullable(),
    tipo_empresa: z.enum(["crear", "asignar", "ninguno"]).default("ninguno"),
    empresa_id: z.string().optional().nullable(),
    empresa_nueva_nombre: z.string().optional().nullable(),
    status: z.enum(["active", "inactive"]).optional(),
    plan_suscripcion: z.enum(["silver", "gold", "ninguno"]).default("ninguno"),
    limite_licencias: z.coerce.number().int().nonnegative("El límite debe ser un número positivo").default(10),
    password: isEdit
      ? z.string().optional()
      : z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  }).refine((data) => {
    if (data.tipo_empresa === "crear") {
      return !!data.empresa_nueva_nombre && data.empresa_nueva_nombre.trim().length >= 2;
    }
    if (data.tipo_empresa === "asignar") {
      return !!data.empresa_id;
    }
    return true;
  }, {
    message: "Debe rellenar este campo según el tipo de empresa seleccionado",
    path: ["empresa_nueva_nombre"],
  });
};

export type AdminFormValues = z.infer<ReturnType<typeof getAdminSchema>>;
