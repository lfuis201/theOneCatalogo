import {
  Modal,
  Button,
  TextField,
  Label,
  InputGroup,
  Select,
  ListBox,
} from "@heroui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Image } from "lucide-react";
import type { Empresa } from "../services/empresasService";
import { getEmpresaSchema, type EmpresaFormValues } from "../schemas/empresaSchema";

interface EmpresaModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (data: EmpresaFormValues) => void;
  empresa?: Empresa | null;
}

export function EmpresaModal({ isOpen, onOpenChange, onSubmit, empresa }: EmpresaModalProps) {

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmpresaFormValues>({
    resolver: zodResolver(getEmpresaSchema()),
    defaultValues: {
      nombre: "",
      logo_url: "",
      status: "active",
    },
  });

  const selectedStatus = watch("status");

  useEffect(() => {
    if (empresa && isOpen) {
      reset({
        nombre: empresa.nombre || "",
        logo_url: empresa.logo_url || "",
        status: empresa.status || "active",
      });
    } else if (isOpen) {
      reset({
        nombre: "",
        logo_url: "",
        status: "active",
      });
    }
  }, [empresa, isOpen, reset]);

  const handleFormSubmit = (data: EmpresaFormValues) => {
    onSubmit(data);
    reset();
    onOpenChange();
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[600px] bg-background border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <Modal.CloseTrigger />
          <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col max-h-[90vh]">
            <Modal.Header className="flex flex-col gap-1 p-8 border-b border-default-100">
              <Modal.Heading className="text-2xl font-black text-default-900">
                {empresa ? "Editar Empresa" : "Registrar Nueva Empresa"}
              </Modal.Heading>
              <p className="text-sm text-default-500 font-medium tracking-wide">
                {empresa ? "Actualiza los datos de la empresa." : "Ingresa los datos para registrar un nuevo negocio en el sistema."}
              </p>
            </Modal.Header>
            <Modal.Body className="gap-6 p-8 overflow-y-auto min-h-0">
              <div className="grid grid-cols-1 gap-6">
                <TextField isInvalid={!!errors.nombre}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Nombre de la Empresa</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Prefix className="pl-3 text-primary/40"><Building size={18} /></InputGroup.Prefix>
                    <InputGroup.Input 
                      placeholder="Ej. Distribuidora Central"
                      {...register("nombre")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.nombre && <p className="text-danger text-tiny mt-1 ml-1">{errors.nombre.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.logo_url}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">URL del Logo (Opcional)</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Prefix className="pl-3 text-primary/40"><Image size={18} /></InputGroup.Prefix>
                    <InputGroup.Input 
                      placeholder="https://ejemplo.com/logo.png"
                      {...register("logo_url")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.logo_url && <p className="text-danger text-tiny mt-1 ml-1">{errors.logo_url.message}</p>}
                </TextField>

                <div className="flex flex-col">
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Estado de la Empresa</Label>
                  <Select
                    selectedKey={selectedStatus}
                    onSelectionChange={(key) => setValue("status", key as any)}
                    className="w-full"
                  >
                    <Select.Trigger className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all shadow-sm">
                      <Select.Value className="text-sm font-medium" />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        <ListBox.Item id="active" textValue="Activo">Activo <ListBox.ItemIndicator /></ListBox.Item>
                        <ListBox.Item id="inactive" textValue="Inactivo">Inactivo <ListBox.ItemIndicator /></ListBox.Item>
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="p-8 border-t border-default-100">
              <Button 
                variant="flat" 
                color="danger" 
                onPress={() => onOpenChange()}
                className="font-bold rounded-xl"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30"
              >
                {empresa ? "Guardar Cambios" : "Guardar Empresa"}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
