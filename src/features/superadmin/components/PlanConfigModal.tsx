import {
  Modal,
  Button,
  TextField,
  Label,
  InputGroup,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit2, DollarSign, Hash } from "lucide-react";
import type { PlanConfig } from "../services/planesConfigService";

const planConfigSchema = z.object({
  nombre_legible: z.string().min(2, "El nombre legible es muy corto"),
  precio_sugerido: z.coerce.number().nonnegative("El precio sugerido debe ser positivo"),
  limite_suscripciones: z.coerce.number().int().nonnegative("El límite debe ser un número entero positivo"),
});

type PlanConfigFormValues = z.infer<typeof planConfigSchema>;

interface PlanConfigModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (data: PlanConfigFormValues) => void;
  plan: PlanConfig | null;
  isLoading?: boolean;
}

export function PlanConfigModal({ isOpen, onOpenChange, onSubmit, plan, isLoading }: PlanConfigModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PlanConfigFormValues>({
    resolver: zodResolver(planConfigSchema),
    defaultValues: {
      nombre_legible: "",
      precio_sugerido: 0,
      limite_suscripciones: 10,
    },
  });

  useEffect(() => {
    if (plan && isOpen) {
      reset({
        nombre_legible: plan.nombre_legible || "",
        precio_sugerido: Number(plan.precio_sugerido) || 0,
        limite_suscripciones: plan.limite_suscripciones ?? 10,
      });
    }
  }, [plan, isOpen, reset]);

  const handleFormSubmit = (data: PlanConfigFormValues) => {
    onSubmit(data);
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[500px] bg-background border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <Modal.CloseTrigger />
          <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col max-h-[90vh]">
            <Modal.Header className="flex flex-col gap-1 p-8 border-b border-default-100">
              <Modal.Heading className="text-2xl font-black text-default-900">
                Configurar Plan: <span className="text-primary">{plan?.plan}</span>
              </Modal.Heading>
              <p className="text-sm text-default-500 font-medium tracking-wide">
                Modifica el precio sugerido, límite de licencias y nombre de visualización del plan.
              </p>
            </Modal.Header>
            <Modal.Body className="gap-6 p-8 overflow-y-auto min-h-0">
              <div className="grid grid-cols-1 gap-6">
                <TextField isInvalid={!!errors.nombre_legible}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Nombre Legible</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Prefix className="pl-3 text-primary/40"><Edit2 size={18} /></InputGroup.Prefix>
                    <InputGroup.Input 
                      placeholder="Ej. Plan Gold"
                      {...register("nombre_legible")}
                      value={watch("nombre_legible") || ""}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.nombre_legible && <p className="text-danger text-tiny mt-1 ml-1">{errors.nombre_legible.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.precio_sugerido}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Precio Sugerido (USD)</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Prefix className="pl-3 text-primary/40"><DollarSign size={18} /></InputGroup.Prefix>
                    <InputGroup.Input 
                      type="number"
                      step="0.01"
                      placeholder="Ej. 49.00"
                      {...register("precio_sugerido")}
                      value={watch("precio_sugerido") ?? ""}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.precio_sugerido && <p className="text-danger text-tiny mt-1 ml-1">{errors.precio_sugerido.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.limite_suscripciones}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Límite de Licencias / Ventas</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Prefix className="pl-3 text-primary/40"><Hash size={18} /></InputGroup.Prefix>
                    <InputGroup.Input 
                      type="number"
                      placeholder="Ej. 10"
                      {...register("limite_suscripciones")}
                      value={watch("limite_suscripciones") ?? ""}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.limite_suscripciones && <p className="text-danger text-tiny mt-1 ml-1">{errors.limite_suscripciones.message}</p>}
                </TextField>
              </div>
            </Modal.Body>
            <Modal.Footer className="p-8 border-t border-default-100">
              <Button 
                variant="flat" 
                color="danger" 
                onPress={() => onOpenChange()}
                className="font-bold rounded-xl"
                isDisabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30"
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                Guardar Cambios
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
