import * as z from "zod";

export const getEmpresaSchema = () => {
  return z.object({
    nombre: z.string().min(2, "El nombre de la empresa es obligatorio"),
    logo_url: z.string().url("URL de logo inválida").or(z.string().length(0)).optional().nullable(),
    status: z.enum(["active", "inactive"]).optional().default("active"),
  });
};

export type EmpresaFormValues = z.infer<ReturnType<typeof getEmpresaSchema>>;
