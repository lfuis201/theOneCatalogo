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
import { User, Mail, Phone, Building, Key, Eye, EyeOff } from "lucide-react";
import type { Cliente } from "../types";
import { getClienteSchema, type ClienteFormValues } from "../schemas/clienteSchema";

interface ClienteModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (data: ClienteFormValues) => void;
  cliente?: Cliente | null;
}

export function ClienteModal({ isOpen, onOpenChange, onSubmit, cliente }: ClienteModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(getClienteSchema(!!cliente)),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      empresa: "",
      password: "",
    },
  });

  useEffect(() => {
    if (cliente && isOpen) {
      reset({
        nombre: cliente.nombre || "",
        email: cliente.email || "",
        telefono: cliente.telefono || "",
        empresa: cliente.empresa || "",
        password: "",
      });
    } else if (isOpen) {
      reset({
        nombre: "",
        email: "",
        telefono: "",
        empresa: "",
        password: "",
      });
    }
    setShowPassword(false);
  }, [cliente, isOpen, reset]);

  const handleFormSubmit = (data: ClienteFormValues) => {
    onSubmit(data);
    reset();
    onOpenChange();
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[500px] bg-background border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <Modal.CloseTrigger />
          <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col max-h-[90vh]">
            <Modal.Header className="flex flex-col gap-1 p-8 border-b border-default-100">
              <Modal.Heading className="text-2xl font-black text-default-900">
                {cliente ? "Editar Cliente" : "Registrar Nuevo Cliente"}
              </Modal.Heading>
              <p className="text-sm text-default-500 font-medium tracking-wide">
                {cliente ? "Actualiza los datos del cliente." : "Completa los datos para añadirlo a tu catálogo."}
              </p>
            </Modal.Header>
            <Modal.Body className="gap-6 p-8 overflow-y-auto min-h-0">
              <TextField isInvalid={!!errors.nombre}>
                <Label className="text-primary font-bold mb-1 ml-1 text-sm">Nombre Completo</Label>
                <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                  <InputGroup.Prefix className="pl-3 text-primary/40"><User size={18} /></InputGroup.Prefix>
                  <InputGroup.Input 
                    placeholder="Ej. Juan Pérez"
                    {...register("nombre")}
                    className="px-3 text-sm font-medium"
                  />
                </InputGroup>
                {errors.nombre && <p className="text-danger text-tiny mt-1 ml-1">{errors.nombre.message}</p>}
              </TextField>

              <TextField isInvalid={!!errors.email}>
                <Label className="text-primary font-bold mb-1 ml-1 text-sm">Correo Electrónico</Label>
                <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                  <InputGroup.Prefix className="pl-3 text-primary/40"><Mail size={18} /></InputGroup.Prefix>
                  <InputGroup.Input 
                    placeholder="ejemplo@correo.com"
                    {...register("email")}
                    className="px-3 text-sm font-medium"
                    disabled={!!cliente}
                  />
                </InputGroup>
                {errors.email && <p className="text-danger text-tiny mt-1 ml-1">{errors.email.message}</p>}
              </TextField>

              {!cliente && (
                <TextField isInvalid={!!errors.password}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Contraseña de Acceso</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Prefix className="pl-3 text-primary/40"><Key size={18} /></InputGroup.Prefix>
                    <InputGroup.Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      {...register("password")}
                      className="px-3 text-sm font-medium"
                    />
                    <InputGroup.Suffix className="pr-2">
                      <Button 
                        isIconOnly 
                        variant="ghost" 
                        size="sm" 
                        onPress={() => setShowPassword(!showPassword)}
                        className="text-primary/60 hover:text-primary hover:bg-primary/10 rounded-xl"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </InputGroup.Suffix>
                  </InputGroup>
                  {errors.password && <p className="text-danger text-tiny mt-1 ml-1">{errors.password.message}</p>}
                </TextField>
              )}

              <div className="grid grid-cols-2 gap-4">
                <TextField isInvalid={!!errors.telefono}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Teléfono</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Prefix className="pl-3 text-primary/40"><Phone size={18} /></InputGroup.Prefix>
                    <InputGroup.Input 
                      placeholder="555-0000"
                      {...register("telefono")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.telefono && <p className="text-danger text-tiny mt-1 ml-1">{errors.telefono.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.empresa}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Empresa</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Prefix className="pl-3 text-primary/40"><Building size={18} /></InputGroup.Prefix>
                    <InputGroup.Input 
                      placeholder="Opcional"
                      {...register("empresa")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.empresa && <p className="text-danger text-tiny mt-1 ml-1">{errors.empresa.message}</p>}
                </TextField>
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
                {cliente ? "Guardar Cambios" : "Guardar Cliente"}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
